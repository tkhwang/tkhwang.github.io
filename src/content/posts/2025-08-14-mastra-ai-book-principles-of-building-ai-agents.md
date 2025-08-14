---
title: "[AI] mastra.ai 의 Principles of Building AI Agents "
description: ""
date: "Aug 14 2025"
tags: ["ai", "mastra.ai"]
---

AI Agent 쪽을 살펴보고 있는데, 주로 python 으로 작성된 framework 들이 많습니다.
Typescript 기반의 AI Agent framework 을 살펴보다가 [mastra.ai](https://mastra.ai/)을 알게 되서 mastra.ai 를 이해할 겸해서 이곳에서 나온 책 [(mastra.ai) Principles of Building AI Agents](https://mastra.ai/book) 읽어보면서 정리해봅니다.

Gatsby co-founder 와 key engineer 들이 뭉쳐서 mastra.ai 를 만들었다고 하네요.

## PART 1: PROMPTING A LARGE LANGUAGE MODEL (LLM)

## PART 2: BUILDING AN AGENT

### 4. Agents 101

#### Levels of Autonomy

- Low level: 에이전트는 decision tree 에서 binary choices 를 함.
- Medium level: 에이전트는 메모리, 툴 (call tools), 실패한 타스크에 대한 재시도 할 수 있음.
- High level: 에이전트는 계획을 하고, 태스크를 서브 태스크로 분리하고 태스크 큐를 관리.

이 책은 주로 LOW 에서 MEDIUM 레벨의 자율성을 갖는 에이전트를 주로 타켓으로 함. <br />
참고로 mastra 의 code 일부는 다음과 같이 생겼습니다.

```typescript
import { Agent } from "@mastra/core/agent"
import { openai } from "@ai-sdk/openai"

export const myAgent = new Agent({
    name: "My Agent",
    instructions: "You are a helpful assistant.",
    model: openai("gpt-4o-mini");
})
```

### 6. Tool calling

#### 툴 계획: 가장 중요한 절차

AI 어플리케이션을 만들때 가장 중요한 작업은 **tool design에 대해서 주의깊에 생각해야한다**는 것입니다.

- 필요한 툴에 대한 리스트
- 각 툴은 무엇을 해야하는가 ?

코딩을 시작하기 전에 이것들을 명시적으로 작성해두세요.

아래의 절차를 따른다면 당신의 에이전트는 더욱 능력이 많고, 믿음직하며 사용하기 좋을거예요.

- 분석가와 같이 생각하세요.
- 당신의 문제를 명시적이고, 재사용 가능한 오퍼레이션으로 분해하세요.
- 이 각각을 위한 툴을 만드세요.

### 7. 에이전트 메모리

#### Working memory

Working memory 는 당신과 관련이 있고, 저장되고, 장시간의 특징들을 저장합니다.

#### Hierarchical memory

Hierarchical memory는 관련된 long-term 메모리와 함께 최근의 메세지를 사용하는 것을 멋있게 이야기하는 것입니다.

```typescript
await agent.stream("What did we decide about the search feature last week ?", {
  memoryOptions: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messagerange: 2,
    },
  },
});
```

### 8. Dynamic Agents

런타임에 명령, 모델, 툴을 동적으로 설정하는 dynamic agents 도 이용 가능함.

### 9. 에이전트 미들웨어

### Guardrails

Guardrails 는 에이전트의 입출력에 대해서 sanitizing 함으로써 jailbreaking 과 같은 공걱에 대한 방어를 하기 위함입니다.

- 에이전트로 들어가는 입력
- 에이전트로부터 나오는 결과

## PART 3: TOOLS & MCP

## PART 4: GRAPH-BASED WORKFLOWS

## PART 5: RETRIEVAL-AUGMENTED GENERATION (RAG)

## PART 6: MULTI-AGENT SYSTEMS

## PART 7: EVALS

## PART 8: DEVELOPMENT & DEPLOYMENT

## PART 9: EVERYTHING ELSE

## Reference

- [(mastra.ai) Principles of Building AI Agents](https://mastra.ai/book)
