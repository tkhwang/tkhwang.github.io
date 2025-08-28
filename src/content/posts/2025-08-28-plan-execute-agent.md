---
title: "[LangChain] Plan-and-Execute Agents: ReAct를 넘어선 차세대 AI 에이전트 아키텍처"
description: "LangChain의 Plan-and-Execute 스타일 에이전트 디자인을 소개합니다. 기존 ReAct 에이전트 대비 더 빠른 실행 속도, 비용 절감, 그리고 향상된 성능을 제공하는 3가지 개선된 에이전트 아키텍처를 알아봅니다."
date: "Aug 28 2025"
tags: ["ai", "langchain", "langgraph"]
---

요즘 claude code 나 cursor 등의 AI agent 를 보면 먼저 planning 을 세우고, 이에 따라서 하나씩 sub task 들을 agent 가 처리하는 방식으로 많이 구현을 하는 것 같습니다. 이를 어떻게 구현하는지 궁금했었는데, LangChain에 [관련된 blog 글](https://blog.langchain.com/planning-agents/)이 있어서 읽어보면서 정리해봅니다.

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/uRya4zRrRx4?si=9ndW26vpjOH2B0SE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

전통적인 ReAct (Reasoning and Action) 스타일의 agent 를 넘어서 "Plan-and-execute" 스타일의 세 가지 에이전트 디자인을 발표합니다. 이러한 에이전트들은 기존의 Reasoning and Action(ReAct) 스타일 에이전트보다 여러 가지 측면에서 개선을 약속합니다.

⏰ 첫째, 멀티스텝 워크플로우를 **더 빠르게 실행**할 수 있습니다. 각 작업 후에 대형 에이전트와 다시 상의할 필요가 없기 때문입니다. 각 하위 작업은 추가적인 LLM 호출 없이(또는 더 가벼운 LLM 호출로) 수행할 수 있습니다.

💸 둘째, ReAct 에이전트보다 **비용 절감 효과**가 있습니다. 하위 작업에 LLM 호출이 필요할 경우, 보통 더 작고 도메인 특화된 모델을 사용할 수 있습니다. 대형 모델은 (재)계획 단계와 최종 응답 생성에만 호출됩니다.

🏆 셋째, **전체적인 성능(작업 완료율 및 품질) 향상**에 기여할 수 있습니다. 플래너가 작업을 완수하기 위해 필요한 모든 단계를 명시적으로 “생각”하도록 강제하기 때문입니다. 전체 추론 과정을 생성하는 것은 결과를 개선하는 데 검증된 프롬프트 기법입니다. 문제를 세분화하면 더 집중된 작업 수행도 가능합니다.

## 0. Background

지난 1년 동안, 언어 모델(LLM) 기반 에이전트와 상태 머신은 유연하고 효과적인 AI 기반 제품을 만들기 위한 유망한 설계 패턴으로 떠올랐습니다. 본질적으로 에이전트는 LLM을 범용 문제 해결 도구로 활용하여 외부 리소스와 연결함으로써 질문에 답하거나 작업을 수행합니다.

LLM 에이전트는 일반적으로 다음과 같은 주요 단계를 거칩니다:

1. **행동 제안 (Propose action)**: LLM이 사용자에게 직접 응답하거나 함수에 전달할 텍스트를 생성합니다.
2. **행동 실행 (Execute action)**: 코드가 데이터베이스 쿼리나 API 호출과 같은 작업을 수행하기 위해 다른 소프트웨어를 호출합니다.
3. **관찰 (Observe)**: 도구 호출의 응답을 확인하고, 다른 함수를 호출하거나 사용자에게 응답합니다.

[ReAct agent](https://arxiv.org/abs/2210.03629?ref=blog.langchain.com) 는 이를 위한 훌륭한 전형적인 설계로, **생각(Thought) → 행동(Act) → 관찰(Observation)** 의 반복 루프를 사용해 언어 모델을 프롬프트합니다.

```
Thought: I should call Search() to see the current score of the game.
Act: Search("What is the current score of game X?")
Observation: The current score is 24-21
... (repeat N times)
```

이는 [Chain-of-thought](https://arxiv.org/abs/2201.11903?ref=blog.langchain.com) 프롬프트를 활용하여 각 단계마다 단일 행동을 선택하도록 합니다. 단순한 작업에는 효과적일 수 있지만, 다음과 같은 몇 가지 주요 단점이 있습니다:

1. 각 도구 호출마다 LLM 호출이 필요합니다.
2. LLM은 한 번에 하나의 하위 문제만 계획합니다. 이 때문에 전체 작업에 대한 “추론”을 강제하지 않으므로 비효율적인 경로로 이어질 수 있습니다.

이 두 가지 한계를 극복하는 한 가지 방법은 **명시적인 계획 단계(explicit planning step)** 를 도입하는 것입니다. 아래는 우리가 LangGraph에서 구현한 두 가지 설계 예시입니다.

## 1. Plan-And-Execute

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/plan-and-execute.png?raw=true)

Wang 외 연구진의 [Plan-and-Solve Prompting 논문](https://arxiv.org/abs/2305.04091?ref=blog.langchain.com)과 Yohei Nakajima의 [BabyAGI 프로젝트](https://github.com/yoheinakajima/babyagi?ref=blog.langchain.com)를 느슨하게 기반으로 한 이 단순한 아키텍처는 플래닝 에이전트 아키텍처의 대표적인 예입니다.
이 아키텍처는 두 가지 기본 구성 요소로 이루어져 있습니다:

1. **플래너(Planner)** : LLM에 프롬프트를 제공해 대규모 작업을 완료하기 위한 다단계 계획을 생성합니다.
2. **실행기(Executor)** : 사용자 요청과 계획의 각 단계를 받아 하나 이상의 도구를 호출해 해당 작업을 완료합니다.

실행이 완료되면, 에이전트는 재계획(re-planning) 프롬프트와 함께 다시 호출되어 응답으로 작업을 마칠지, 아니면 추가 계획을 생성할지(첫 번째 계획이 원하는 효과를 내지 못한 경우) 결정합니다.

이 에이전트 설계는 각 도구 호출마다 대형 플래너 LLM을 호출할 필요를 없애줍니다. 그러나 여전히 **직렬 도구 호출(serial tool calling)** 에 제한을 받으며, **변수 할당(variable assignment)** 을 지원하지 않기 때문에 각 작업마다 LLM을 사용해야 합니다.

## 2. Reasoning without Observations: ReWOO

[ReWOO](https://arxiv.org/abs/2305.18323?ref=blog.langchain.com)에서 Xu 외 연구진은, 각 작업마다 항상 LLM을 사용할 필요 없이 이전 작업 결과에 따라 후속 작업이 수행될 수 있는 에이전트를 제안합니다.
이는 플래너의 출력에서 **변수 할당(variable assignment)** 을 허용함으로써 구현됩니다.
아래는 해당 에이전트 설계의 다이어그램입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/rewoo.png?raw=true)

플래너는 "Plan(추론)"과 "E#" 라인이 교차된 계획 리스트(plan list)를 생성합니다.
예를 들어, 사용자의 질문이 **"올해 슈퍼볼 참가 쿼터백들의 통계는 무엇인가요?"** 라면, 플래너는 다음과 같은 계획을 생성할 수 있습니다.

```
Plan: I need to know the teams playing in the superbowl this year
E1: Search[Who is competing in the superbowl?]
Plan: I need to know the quarterbacks for each team
E2: LLM[Quarterback for the first team of #E1]
Plan: I need to know the quarterbacks for each team
E3: LLM[Quarter back for the second team of #E1]
Plan: I need to look up stats for the first quarterback
E4: Search[Stats for #E2]
Plan: I need to look up stats for the second quarterback
E5: Search[Stats for #E3]
```

플래너가 #E2와 같은 문법을 사용하여 이전 출력물을 참조할 수 있다는 점에 주목하세요.<br />
이는 매번 재계획을 하지 않고도 작업 목록을 실행할 수 있음을 의미합니다.

**워커 노드(Worker node)** 는 각 작업을 순회하며 작업 출력을 해당 변수에 할당합니다.
또한 이후 호출 시 변수들을 그 결과값으로 치환합니다. 마지막으로 **솔버(Solver)** 가 이 모든 출력을 통합하여 최종 답변을 생성합니다.

이 에이전트 설계는 각 작업이 필요한 컨텍스트(입력값과 변수값)만 가지므로, 단순한 plan-and-execute 에이전트보다 더 효과적일 수 있습니다.
하지만 여전히 **순차적 작업 실행(sequential task execution)** 에 의존하기 때문에 실행 시간이 길어질 수 있습니다.

## 3. LLMCompiler

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/llm-compiler-1.png?raw=true)

Kim 외 연구진의 [LLMCompiler](https://arxiv.org/abs/2312.04511?ref=blog.langchain.com)는 앞서 설명한 plan-and-execute 및 ReWOO 에이전트, 심지어 OpenAI의 **병렬 도구 호출(parallel tool calling)** 보다도 작업 실행 속도를 더욱 향상시키기 위해 설계된 에이전트 아키텍처입니다.

LLMCompiler는 다음과 같은 주요 구성 요소를 갖추고 있습니다:

1. **플래너(Planner)** : 작업의 DAG(Directed Acyclic Graph)를 스트리밍합니다. 각 작업에는 도구(tool), 인자(arguments), 그리고 의존성 목록(dependencies)이 포함됩니다.
2. **작업 실행 유닛(Task Fetching Unit)** : 작업을 스케줄링하고 실행합니다. 이 유닛은 작업 스트림을 받아 의존성이 충족된 작업을 스케줄링합니다. 많은 도구들이 검색 엔진이나 LLM 호출을 포함하기 때문에, 추가적인 병렬 처리(parallelism)가 상당한 속도 향상을 제공합니다(논문에서는 3.6배 향상을 주장합니다).
3. **조인너(Joiner)** : 전체 그래프 이력(작업 실행 결과 포함)에 따라 동적으로 재계획하거나 종료합니다. 이는 LLM 단계로, 최종 답변을 생성할지, 아니면 진행 상황을 (재)계획 에이전트로 전달하여 작업을 계속할지 결정합니다.

여기서 런타임 속도를 높이는 핵심 아이디어는 다음과 같습니다:

- 플래너 출력 스트리밍: 출력 파서를 통해 작업 파라미터와 의존성을 즉시 추출합니다.
- 작업 실행 유닛(Task Fetching Unit): 파싱된 작업 스트림을 받아, 모든 의존성이 충족되면 작업을 스케줄링합니다.
- 작업 인자에 변수 사용 가능: 변수는 DAG 내 이전 작업의 출력값이 될 수 있습니다. 예를 들어, 모델이 `search("${1}")` 를 호출하면 작업 1의 출력으로 생성된 쿼리를 검색할 수 있습니다. 이를 통해 OpenAI의 "embarrassingly parallel" 도구 호출보다 더 빠르게 작업할 수 있습니다.

작업을 DAG로 구성하면 도구 호출 시 소중한 시간을 절약할 수 있어, 전반적인 사용자 경험을 향상시킵니다.

## 결론

이 세 가지 에이전트 아키텍처는 "plan-and-execute" 설계 패턴의 전형적인 예로, LLM 기반 **플래너(planner)** 와 **도구 실행(runtime)** 을 분리합니다.
애플리케이션에서 여러 도구 호출이나 API 호출이 필요한 경우, 이러한 접근 방식은 최종 결과를 반환하는 시간을 줄이고, 더 강력한 LLM 호출 빈도를 줄여 비용 절감에도 도움을 줄 수 있습니다.

## Reference

- [Plan-and-Execute Agents](https://blog.langchain.com/planning-agents/)
