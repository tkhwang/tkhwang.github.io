---
title: "[mastra.ai] Principles of Building AI Agents"
description: "TypeScript 기반 AI Agent framework인 mastra.ai의 Principles of Building AI Agents 주요 내용 정리"
date: "Aug 13 2025"
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
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4o-mini"),
});
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

### 10. 유명한 서트 파티 툴

## PART 4: GRAPH-BASED WORKFLOWS

### 13. Branching, Chaining, Merging, Conditions

#### Branching `.step()`

새로운 path를 생성하게 됩니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-branching.png?raw=true)

#### Chaining `.then()`

- 이전 작업에 이어서 다음 작업을 수행하는 경우
- Chain 의 각 작업은 이전 스텝이 완료 되기를 기다리고, context를 통해서 이전 작업의 결과를 액세스합니다.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-step.png?raw=true)

#### Merging

다양한 타스크를 수행하기 위해서 branching path 한 이후에는 이들 결과를 하나로 모으기 위해서 merging 필요함.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-merging.png?raw=true)

#### Conditions

Mastra 에서는 parent step 이 아니라 child step 에 조건 패스 실행을 정의 합니다.

```typescript
myWorkflow.step(
  new Step({
    id: "processData",
    execute: async ({ context }) => {
      // Action logic
    },
  }),
  {
    when: {
      "fetchData.status": "success",
    },
  },
);
```

#### Best Practices and Notes

각 스텝을 다음과 같이 구성을 하는 것을 추천함.

- 각 스텝의 입력/출력이 어느 정도 의미를 갖도록 할 것.
- LLM 이 한 번에 하나의 일을 할 수 있도록 스텝을 분리할 것

### 15. STREAMING UPDATES

가능하면 **Stream** 을 적극적으로 사용할 것. <br />
Backend update 를 즉각적으로 frontend update 되도록 할 것.

- [ElectricSQL](https://electric-sql.com/)
- [Turbo stream](https://www.turbostream-cfd.com/)

## PART 5: RETRIEVAL-AUGMENTED GENERATION (RAG)

### 17. RAG 101

- Chunking: Document 를 bite-sized chunk 조각으로 분리
- Embedding: Embedding model 이용해서 숫자로 구성된 embeding vector 계산
- Indexing: VectorDB 에 저장
- Quering: 유저 입력을 embeddings 로 전환한 후 이와 가장 유사항 vector 를 vector store 에서 찾기

## PART 6: MULTI-AGENT SYSTEMS

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-multi-agents.png?raw=true)

### 22. AGENT SUPERVISOR

- Agent supervisor는 다른 에이전트들을 조율하고, 관리하는 특별한 에이전트 입니다.
- 가장 쉬운 방법은 다른 에이전트들을 TOOLS 로 감싸는 것입니다.

```typescript
const publisherAgent = new Agent({
  name: "publisherAgent",
  instructions:
    "You are a publisher agent that coordinates content creation.First call the copywriter for initial content, then the editor for refinement.",
  model: {
    provider: "ANTHROPIC",
    name: "claude-3-5-sonnect-20241022",
  },
  tools: {
    copywriteTool,
    editorTool,
  },
});
```

## PART 7: EVALS

### 28. TEXTUAL EVALS

생성한 content 에 대해서 자동으로 세 가지 metric 을 eval 하도록 한 예제.

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import {
  FaithfulnessMetric,
  ContentSimilarityMetric,
  HallucinationMetric,
} from "@mastra/evals/nlp";

export const myAgent = new Agent({
  name: "ContentWriter",
  instructions: "You are a content writer that creates accurate stoyies.",
  evals: [
    new FaithfulnessMetric(),
    new ContentSimilarityMetric({
      threshold: 0.8,
    }),
    new HallucinationMetric(),
  ],
});
```

## PART 8: DEVELOPMENT & DEPLOYMENT

### 30. LOCAL DEVELOPMENT

Agentic web fronted 개발: Frameworks

- [Asssistant UI](https://www.assistant-ui.com/)
- [Copilot Kit](https://www.copilotkit.ai/)
  - [AG-UI: The Agent-User Interaction Protocol](https://github.com/ag-ui-protocol/ag-ui)
- [Vercel's AI SDK UI](https://ai-sdk.dev/docs/ai-sdk-ui)

Agentic frontend 가 강력함에도 불구하고, full agentic logic 을 일반적으로 보안 문제로 browser 의 client-side 에 구현하지 않습니다.

## PART 9: EVERYTHING ELSE

## Reference

- [(mastra.ai) Principles of Building AI Agents](https://mastra.ai/book)
