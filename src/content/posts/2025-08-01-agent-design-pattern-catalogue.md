---
title: "[AI] AI 에이전트 디자인 패턴 완전 가이드: 15가지 핵심 패턴과 의사결정 모델"
pubDate: 2025-08-01
description: "Foundation Model 기반 AI 에이전트 개발을 위한 15가지 아키텍처 패턴과 실용적인 의사결정 플로우차트"
author: "tkhwang"
image:
  url: ""
  alt: ""
tags: ["ai", "agents"]
---

import Mermaid from "../../components/Mermaid.astro";

요즘 ai agent 를 이용해서 개발을 하고 싶어서 관련된 자료를 보고 있는데, agent 개발을 위한 design pattern 이 잘 정리가 된 것이 있어서 공부할 겸해서 정리해보았습니다.

- [랭체인과 랭그래프로 구현하는 RAG·AI 에이전트 실전 입문](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=365107423&start=slayer)
- [AGENT DESIGN PATTERN CATALOGUE: A COLLECTION OF ARCHITECTURAL PATTERNS FOR FOUNDATION MODEL BASED AGENTS](https://arxiv.org/pdf/2405.10467)

## 에이전트 디자인 패턴의 전체 모습

에이전트의 역할을 다음 두 가지로 구분을 합니다.

### 중재자로서의 에이전트 `Agent-as-a-coordinator`

사용자로부터 프롬프트를 받아 이 프롬프트가 무엇을 의미하는지 `컨텍스트 엔지니어링`을 통해 명확히 하고, `프롬프트 엔지니어링`을 통해 AI 에이전트가 작동 가능한 프롬프트로 최적화 합니다. 그 후 `모델에 대한 쿼리`나 `기억`을 통한 보조, `외부 시스템의 실행` 등을 활용하여 `실행 계획을 생성`합니다.

### 작업자로서의 에이전트 `Agent-as-a-worker`

`Agent-as-a-coordinator` 로부터 실행 계획을 받아, 각자 역할 분담 등을 거치면서 `실행 결과를 반환`합니다. `Agent-as-a-worker`는 자신의 작업을 다른 AI 에이전트에게 `위임`하기도 합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/ecosystem-of-fm-based-agent-system.png?raw=true)

## 1. 목표 설정과 계획 생성

### 1.1 Passive Goal Creator

AI 에이전트가 사용자의 요구를 적절히 처리하기 위해서는 먼저 그 요구를 구체적인 목표로 변환해야 합니다.
Passive Goal Creator 의 특징은 **사용자가 제공한 정보만을 기반**으로 작동한다는 점이다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/1-passive-goal-creator.png?raw=true)

### 1.2 Proactive Goal Creator

AI 에이전트가 보다 효과적으로 사용자를 지원하기 위해서는 **사용자의 명시적인 지시** 뿐만 아니라, **사용자를 둘러싼 환경을 이해**하고
**선제적으로 대응**하는 것이 요구됩니다. 이러한 능동적인 목표 설정을 실현하기 위한 패턴입니다.

AI 에이전트가 자발적으로 관련 정보를 수집하고 추가 목표 설정함으로써 사용자의 니즈에 더 잘 부합하는 제안을 할 수 있게 됩니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/2-proactive-goal-creator.png?raw=true)

### 1.3 Prompt Response Optimizer

AI 에이전트는 LLM을 활용해 사고하므로, 그 성능은 LLM에 입력하는 프롬프트의 품질에 크게 의존합니다.
Prompt/Response optimizer는 AI 에이전트와의 프롬프트를 통한 상호작용을 더 효과적으로 만들기 위한 패턴입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/3-prompt-resopnse-optimizer.png?raw=true)

### 1.4 Single-Path Plan Generator

Single-Path plan generator는 **사용자의 목표를 달성하기 위한 일련의 절차나 행동 계획을 생성하는 패턴**입니다.
이 패턴은 비교적 단순한 태스크나 명확한 절차가 존재하는 문제에 효과적입니다.

Single-path plan generator를 구현할 때의 과제는 각 플랜의 상세함의 균형 (너무 세밀하지도, 너무 대략적이지도 않게), 예상치 못한 상황에 대한 대응 등이 있습니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/8-single-path-generator.png?raw=true)

### 1.5 Multi-Path Plan Generator

Multi-path plan generator는 **여러 선택지나 조건 분기를 포함한 복잡한 계획을 생성하기 위한 패턴**입니다. 이 패턴은 불확실성이 높은 상황이나
사용자의 취향이나 외부 요인에 따라 계획이 바뀔 가능성이 있는 경우에 특히 효과적입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/8-multi-path-plan-generator.png?raw=true)

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/7-single-path-plan-generator.png?raw=true)

### 1.6 One-Shot Model Querying

One-Shot Model Query는 조정자 역할을 하는 에이전트가 수행하는 **플랜 생성**에서 **모든 단계를 한 번의 LLM 호출로 생성하는 패턴**입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/5-oneshot-model-query.png?raw=true)

### 1.7 Incremental Model Querying

Incremental Model Querying은 **플랜 생성 프로세스의 각 단계에서 LLM에 접근**하여 **단계적으로 추론을 진행하는 패턴**입니다.

LLM이 생성한 응답을 분석하는 점은 Self-Reflection과 유사하지만 초점이 다소 다르다.

- Self-Reflection: 응답의 품질
- Incremental Model Querying: 정보의 확장(다양한 정보 수집)

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/6-incremental-model-query.png?raw=true)

## 2. 추론의 확실성 향상

### 2.1 Retrieval Augmented Generation: RAG

AI 에이전트의 기초가 되는 LLM이 가진 지식에는 한계가 있으며, 특히 최신 정보나 전문적인 지식이 필요한 경우에는 그 한계가 두드러집니다.
LLM의 생성 능력과 외부 정보원에서의 검색을 조합하여 이 문제를 해결하는 패턴입니다.

RAG를 구현할 때 해결해야할 과제로는 적절한 정보원의 선택, 검색 결과의 신뢰성 평가, 답변 생성 프롬프트의 품질 등이 있습니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/4-retrieval-augmented-generation.png?raw=true)

### 2.2 Self-Reflection

Self-Reflection은 AI 에이젠트가 **자신의 출력이나 추론 과정을 평가**하고, 필요에 따라 **스스로 수정을 수행하는 패턴**입니다.
이 평가 결과는 데이터베이스 등에 저장해 두어 다음에 유사한 태스크를 실행할 떄 참고 자료로 활용할 수 있습니다.

구현 시 고려할 점으로는

- 적절한 평가 기준 설정
- 무한 루프에 빠지지 않기 위한 중단 조건 설정
- 리플렉션에 소요되는 시간적, 금전적 비용과 성능의 균형

또한, 셀프 리플렉션에 의한 개선이 실제로 사용자의 요구와 일치하는지 검증하는 것도 중요합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/9-plan-refleciton-pattern.png?raw=true)

### 2.3 Cross-Reflection

Cross-Reflection은 **여러 AI 에이전트나 다른 LLM** 등이 **서로의 출력을 평가**하고 **피드백을 제공하는 패턴**입니다.
이 패턴은 단일 AI 에이전트로는 파악하기 어려운 다양한 관점이나 전문 지식을 도입하여 전체적인 관점이 고려된 신뢰성 높은 결과를 얻는 것을 목적으로 합니다.

구현 시 과제로는

- 적절한 전문가의 선태과 설계
- 다양한 관점에서의 피드백을 적절히 통합하는 방법
- 실행 비용과 응답 시간의 균형 유지

또한, 에이전트 간 의견이 갈릴 경우의 조정 메커니즘도 고려할 필요가 있습니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/9-plan-refleciton-pattern.png?raw=true)

### 2.4 Human-Reflection

Human Reflection은 AI 에이전트의 출력이나 판단에 대해 **인간이 평가나 피드백을 제공**하고, 이를 바탕으로 에이전트의 작동 성능을 향상시키는 패턴입니다.

구현 시 과제로는

- 적절한 인간 평가자 선정
- 평가 기준의 표준화
- 인간의 주관이나 편견과의 균형
- 피드백의 효율적인 수집과 분석 방법

모든 응답에 대해 인간 평가자가 평가하는 것은 현실적으로 어려우므로, Self-Reflection과 같은 자기 개선 프로세스와의 균형을 맞추는 것도 확장성 측면에서 중요합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/9-plan-refleciton-pattern.png?raw=true)

### 2.5 Agent Evaluator

Agent Evaluator는 **AI 에이전트의 성능이나 작동을 평가**하고, **그 결과를 AI 에이전트에 피드백하는 패턴**입니다. 이는 self-reflection이나
cross reflection처럼 곧바로 피드백하는 메터니증이 아니라, AI 에이전트의 일련의 작동 로그를 통해 정성, 정량 평가를 수행한 후
설계나 구현 측면에서 AI 에이전트를 업데이트하기 위한 메커니즘입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/16-agent-evaluator.png?raw=true)

## 3. 에이전트 간의 협력

### 3.1 Voting-based Cooperation

Voting-based cooperation은 **여러 AI 에이전트가 독립적으로 판단이나 제안**을 하고, **그 결과를 투표로 집계**하여 최종 의사 결정을 하는 패턴입니다.
이 패턴은 복잡한 문제에 대해 다양한 관점에서의 접근을 가능하게 하고, 개별 AI 에이전트의 판단 편향이나 의사 결정 오류를 줄이는 것을 목적으로 합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/10-voting-based-cooperation.png?raw=true)

### 3.2 Role-based Coopereation

Role-based Cooperation은 여러 AI 에이전트가 협력하여 복잡한 태스크를 해결해야 할 경우, **각 에이전트의 역할을 멱확히 정의**하고
**각자의 전문성을 살펴 협력 작업을 수행하는 패턴**입니다. 이 패턴은 인간 조직의 역할 분담을 AI 에이전트 세계에 적용한 것이라고 할 수 있습니다.

이 패턴의 구현에서는 각 에이전트의 전문성을 LLM의 프롬프트에 포함하는 것이 중요합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/11-rol-based-cooperation.png?raw=true)

### 3.3 Debate-based Cooperation

Debate-based Cooperation은 **여러 AI 에이전트가 대화 형식으로 의견을 교환**하고, **합의 형성을 통해 문제 해결을 해결하는 패턴**입니다.

이 패턴의 구현에서는 이전 협력 패턴과 마찬가지로 각 AI 에이전트의 개성이나 전문성을 LLM의 프롬프트에 포함하는 것이 중요합니다. 또한 토론 진행을
관리하고 합의 형성을 촉진하는 중재자 (moderator) 에이전트나 진행자 (facilitator) 에이전트를 도입하는 것도 효과적입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/12-debate-based-cooperation.png?raw=true)

## 4. 입출력 제어

### 4.1 Multimodal Guardrails

Multimodal Guardrails 은 **AI 에이전트의 입출력을 제어**하고, **특정 요구사항 (사용자 요구, 윤리 기준, 법률 등)에 적합하게 하기 위한 패턴**입니다.

- 사용자 입력에 대한 기반 모델의 응답 (출력 guardrail)
- 프롬프트/응답 최적에 대한 기반 모델의 응답 (출력 guardrail)
- 외부 정보원의 참조 정보 (RAG guardrail)
- 외부 도구 실행 결과 (외부 실행 guardrail)

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/13-multi-modeal-guardrails.png?raw=true)

### 4.2 Tool/Agent Registry

Tool/Agent Registery는 AI 에이전트 시스템 내에서 **이용 가능한 다양한 도구나 에이전트 (서브 에이전트)를 일원화하여 관리**하고,
**필요에 따라 적절한 것을 선택 호출하기 위한 패턴**입니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/14-tool-agent-registry.png?raw=true)

### 4.3 Agent Adapter

Agent Adapter는 **AI 에이전트와 외부 도구 및 시스템 간의 인터페이스를 제공하는 패턴**입니다. 이 패턴은 서로 다른 형식과 프로토콜을 가진
다양한 도구나 시스템과 AI 에이전트를 연계하는 경우에 효과적으로 활용할 수 있습니다.

이 패턴은 서로 다른 형식과 프로토콜을 가진 다양한 도구나 시스템과 AI 에이전트를 연계하는 경우에 효과적으로 활용할 수 있습니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/15-agent-adapter.png?raw=true)

## Decision model

다음은 에이전트 디자인 패턴 선택을 위한 의사결정 모델입니다:

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/0-decisioin-model.png?raw=true)

<Mermaid
code={`flowchart TD
Start((시작)) --> Q1{환경 컨텍스트를<br/>캡처할 수 있는가?}

    Q1 -->|No| PassiveGoal[<b>Passive goal creator</b><br/>✓ efficiency<br/>✗ reasoning uncertainty]
    Q1 -->|Yes| ProactiveGoal[<b>Proactive goal creator</b><br/>✓ accessibility<br/>✗ overhead]

    PassiveGoal --> Q2{프롬프트<br/>최적화?}
    ProactiveGoal --> Q2

    Q2 -->|No| Q3{외부 데이터<br/>저장소 사용?}
    Q2 -->|Yes| PromptOpt[<b>Prompt/response optimizer</b><br/>✓ standardisation<br/>✓ goal alignment<br/>✓ interoperability<br/>✓ adaptability<br/>✗ rule simplification<br/>✗ overhead]

    PromptOpt --> Q3
    Q3 -->|No| Q4{FM을 여러 번<br/>쿼리하는가?}
    Q3 -->|Yes| RAG[<b>RAG</b><br/>✓ knowledge retrieval<br/>✓ updatability<br/>✓ data privacy<br/>✓ cost-efficiency<br/>✗ overhead<br/>✗ data limitation]

    RAG --> Q4
    Q4 -->|No| OneShot[<b>One-shot<br/>model querying</b><br/>✓ cost-efficiency<br/>✓ simplicity<br/>✗ oversimplification<br/>✗ lack of explainability<br/>✗ context window limitation]
    Q4 -->|Yes| Incremental[<b>Incremental<br/>model querying</b><br/>✓ supplementary context<br/>✓ reasoning certainty<br/>✓ explainability<br/>✗ overhead]

    OneShot --> Q5{계획에서<br/>여러 선택지?}
    Incremental --> Q5

    Q5 -->|No| SinglePath[<b>Single-path<br/>plan generator</b><br/>✓ efficiency<br/>✓ flexibility<br/>✗ oversimplification]
    Q5 -->|Yes| MultiPath[<b>Multi-path<br/>plan generator</b><br/>✓ alignment to human preference<br/>✓ inclusiveness<br/>✗ overhead]

    SinglePath --> Q6{생성된 계획을<br/>반영하는가?}
    MultiPath --> Q6

    Q6 -->|Yes| ReflectionChoice{반영 방식}
    Q6 -->|No| Q7{여러 에이전트<br/>협력하는가?}

    ReflectionChoice --> SelfReflection[<b>Self-reflection</b><br/>✓ continuous improvement<br/>✓ efficiency<br/>✓ reasoning uncertainty<br/>✗ limited capability]

    ReflectionChoice --> CrossReflection[<b>Cross-reflection</b><br/>✓ inclusiveness<br/>✓ scalability<br/>✓ reasoning uncertainty<br/>✓ fairness preservation<br/>✓ complex accountability]

    ReflectionChoice --> HumanReflection[<b>Human reflection</b><br/>✓ robustness<br/>✓ safety<br/>✓ adaptability<br/>✗ fairness]

    SelfReflection --> Q7
    CrossReflection --> Q7
    HumanReflection --> Q7

    Q7 -->|Yes| CoopChoice{협력 방식}
    Q7 -->|No| Q8{FM 입출력<br/>제어하는가?}

    CoopChoice --> VotingCoop[<b>Voting-based<br/>Cooperation</b><br/>✓ fairness<br/>✓ collective intelligence<br/>✓ fault tolerance<br/>✗ division of labor]

    CoopChoice --> RoleCoop[<b>Role-based<br/>Cooperation</b><br/>✓ adaptability<br/>✓ explainability<br/>✓ data privacy<br/>✓ scalability]

    CoopChoice --> DebateCoop[<b>Debate-based<br/>Cooperation</b><br/>✓ critical thinking<br/>✓ reasoning quality<br/>✗ coordination overhead]

    VotingCoop --> Q8
    RoleCoop --> Q8
    DebateCoop --> Q8

    Q8 -->|Yes| Guardrails[<b>Multimodal<br/>guardrails</b><br/>✓ discoverability<br/>✓ efficiency<br/>✓ scalability<br/>✗ overhead]
    Q8 -->|No| Q9{외부 도구/에이전트<br/>사용하는가?}

    Guardrails --> Q9
    Q9 -->|Yes| Registry[<b>Tool/agent<br/>registry</b><br/>✓ discoverability<br/>✓ adaptability<br/>✓ reduced cost<br/>✗ overhead]
    Q9 -->|No| Q10{에이전트 성능<br/>평가하는가?}

    Registry --> Adapter[<b>Agent adapter</b><br/>✓ interoperability<br/>✓ modularity<br/>✗ complexity]
    Adapter --> Q10

    Q10 -->|Yes| Evaluator[<b>Agent<br/>evaluator</b><br/>✓ reliability<br/>✓ explainability<br/>✓ adaptability<br/>✓ flexibility<br/>✓ metric quantification<br/>✓ evaluation quality]
    Q10 -->|No| End((종료))

    Evaluator --> End

    style Start fill:#e1f5fe
    style End fill:#e8f5e8
    style PassiveGoal fill:#fff3e0
    style ProactiveGoal fill:#fff3e0
    style PromptOpt fill:#f3e5f5
    style RAG fill:#e8f5e8
    style OneShot fill:#ffebee
    style Incremental fill:#e8f5e8
    style SinglePath fill:#fff3e0
    style MultiPath fill:#e8f5e8
    style SelfReflection fill:#e3f2fd
    style CrossReflection fill:#e3f2fd
    style HumanReflection fill:#e3f2fd
    style VotingCoop fill:#f1f8e9
    style RoleCoop fill:#f1f8e9
    style DebateCoop fill:#f1f8e9
    style Guardrails fill:#fce4ec
    style Registry fill:#e0f2f1
    style Adapter fill:#e0f2f1
    style Evaluator fill:#f3e5f5`}

/>
