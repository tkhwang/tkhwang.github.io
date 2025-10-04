---
title: "[LangChain] Javascript 로 LangChain.js 와 LangGraph 사용하기"
pubDate: 2025-08-08
description: "간단한 예제로 javascript 로 langchain.js 와 LangGraph 이용하는 예제"
author: "tkhwang"
image:
  url: ""
  alt: ""
tags: ["ai", "langchain"]
---

AI Agent 개발을 위해서 langchain 을 보고 있는데 대부분 python 으로만 설명을 하더군요.

[LangChain.js](https://js.langchain.com/docs/introduction/)도 있다고 하는데, 실제 코드는 잘 보지 못했는데,
orielly 책 [러닝 랭체인](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=363882755&start=slayer)에서 예제를 python 과 함께 javascript code 도 되어 있어서 typical 한 예제 정리해보았습니다.

### LangChain diagram

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/langchain-example-diagram.png?raw=true)

### Import

```typescript
import "dotenv/config";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Calculator } from "@langchain/community/tools/calculator";
import { ChatOpenAI } from "@langchain/openai";
import {
  Annotation,
  END,
  messagesStateReducer,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
```

### Tool 과 model 정의

```typescript
const search = new DuckDuckGoSearch();
const cal = new Calculator();
const tools = [search, cal];

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
}).bindTools(tools);
```

### State 정의

custom annotation 대신에 기본 `MessagesAnnotation` 사용함.

```typescript
const annotation = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});
```

### Node 정의

```typescript
async function modelNode(state) {
  const response = await model.invoke(state.messages);
  return { messages: response };
}
```

### Graph 정의 : node, edge

```typescript
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", modelNode)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "model")
  .addConditionalEdges("model", toolsCondition)
  .addEdge("tools", "model");

const graph = workflow.compile();
```

### Query

```typescript
const input = {
  messages: [
    new HumanMessage("미국의 제30대 대동령이 사망했을 때 몇 살이었나요 ?"),
  ],
};

const result = await graph.invoke(input);
console.log("🚀 ~ result:", result);
```

## Reference

- [러닝 랭체인 - 랭체인과 랭그래프로 구현하는 RAG, 에이전트, 인지 아키텍처 | MCP 개념부터 서버 구축 및 활용법 특별 수록](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=363882755&start=slayer)
