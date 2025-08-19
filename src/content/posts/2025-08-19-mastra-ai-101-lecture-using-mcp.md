---
title: "[mastra.ai] mastra.ai 101"
description: ""
date: "Aug 19 2025"
tags: ["ai", "mastra.ai"]
---

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101.png?raw=true)

요즘 [mastra.ai](https://mastra.ai)를 보고 있는데, 101 강의가 동영상 강의가 아니라 **MCP 이용해서 학습**하도록 되어 있어서 신기하기도 하고 내용도 볼 겸해서 정리해봅니다.

---

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-lecture1.png?raw=true)

## Step 1: Getting Started with Mastra

Welcome to the first step of building your first Mastra agent! In this lesson, you'll learn how to create a simple agent that can read data from a public Google Sheet using a custom tool function.

### What is an Agent?

An agent is software with non-deterministic code that can make autonomous decisions based on inputs and environment rather than following fixed, predictable instructions every time.
Agents are AI systems that can:
Perceive their environment through various inputs
Make decisions based on those inputs
Take actions to accomplish specific goals
Learn and adapt their behavior over time

The best agents use several important features:

- Memory: They remember past interactions and learn from them
- Planning: They can break down complex tasks into smaller steps
- Tool use: They can leverage external tools and APIs to expand their capabilities
- Feedback loops: They can evaluate their own performance and adjust accordingly

## Step 2: What is Mastra?

Mastra is an open-source AI Agent Framework for TypeScript that includes all the basic primitives for AI engineering right out of the box:

- Agents with tools, memory, and tracing
- State-machine based workflows
- Evals for tracking and measuring AI output
- Storage for RAG pipelines
- Local development playground

With Mastra, you can quickly build, test, and deploy AI agents. The framework is modular and extensible so you can add capabilities as needed.
verifying installation

## Step 3: project structure

## Step 4: Verifying Project Structure

Wow. MCP checks project structures.

## Step 5: Running the Playground

Open the playground: http://localhost:4111/ <br />
You can interact with your agent, test tools, and see traces.

## Step 6: Understanding System Prompts

A strong system prompt defines your agent’s role, capabilities, behavior, constraints, and success criteria. Clear prompts lead to more consistent, helpful responses.

- Role: what the agent is/does
- Capabilities: tasks it can perform
- Behavior: tone and interaction style
- Constraints: what not to do
- Success: what “good” looks like

## Step 7: creating your agent

새로운 `financialAgent` 생성

```typescript
// /src/mastra/agents/financial-agent.ts

import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
- Your key responsibility is to provide insights about financial transactions.
- Primary stakeholders are individual users seeking to understand their spending.

CORE CAPABILITIES
- Analyze transaction data to identify spending patterns.
- Answer questions about specific transactions or vendors.
- Provide basic summaries of spending by category or time period.

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Format currency values appropriately.
- Ensure user privacy and data security.

CONSTRAINTS & BOUNDARIES
- Do not provide financial investment advice.
- Avoid discussing topics outside of the transaction data provided.
- Never make assumptions about the user's financial situation beyond what's in the data.

SUCCESS CRITERIA
- Deliver accurate and helpful analysis of transaction data.
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.`,
  model: openai("gpt-4o"),
  tools: {},
});
```

## Step 8: exporting your agent

top file 에서 `financialAgent` 를 agents 에 추가

```typescript
export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, financialAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
```

추가하면 playground 에서 agent 추가되어 보임.

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-step8.png?raw=true)

## Step 9: testing your agent

REST API 통해서 agent 확인 가능

- http://localhost:4111/api/agents

```
{
   "weatherAgent":{
      "name":"Weather Agent",
      "instructions":"\n      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.\n\n      Your primary function is to help users get weather details for specific locations. When responding:\n      - Always ask for a location if none is provided\n      - If the location name isn't in English, please translate it\n      - If giving a location with multiple parts (e.g. \"New York, NY\"), use the most relevant part (e.g. \"New York\")\n      - Include relevant details like humidity, wind conditions, and precipitation\n      - Keep responses concise but informative\n      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.\n      - If the user asks for activities, respond in the format they request.\n\n      Use the weatherTool to fetch current weather data.\n",
      "tools":{
         "weatherTool":{
            "id":"get-weather",
            "description":"Get current weather for a location",
            "inputSchema":"{\"json\":{\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"description\":\"City name\"}},\"required\":[\"location\"],\"additionalProperties\":false,\"$schema\":\"http://json-schema.org/draft-07/schema#\"}}",
            "outputSchema":"{\"json\":{\"type\":\"object\",\"properties\":{\"temperature\":{\"type\":\"number\"},\"feelsLike\":{\"type\":\"number\"},\"humidity\":{\"type\":\"number\"},\"windSpeed\":{\"type\":\"number\"},\"windGust\":{\"type\":\"number\"},\"conditions\":{\"type\":\"string\"},\"location\":{\"type\":\"string\"}},\"required\":[\"temperature\",\"feelsLike\",\"humidity\",\"windSpeed\",\"windGust\",\"conditions\",\"location\"],\"additionalProperties\":false,\"$schema\":\"http://json-schema.org/draft-07/schema#\"}}"
         }
      },
      "workflows":{

      },
      "provider":"openai.chat",
      "modelId":"gpt-4o-mini",
      "defaultGenerateOptions":{

      },
      "defaultStreamOptions":{

      }
   },
   "financialAgent":{
      "name":"Financial Assistant Agent",
      "instructions":"ROLE DEFINITION\n- You are a financial assistant that helps users analyze their transaction data.\n- Your key responsibility is to provide insights about financial transactions.\n- Primary stakeholders are individual users seeking to understand their spending.\n\nCORE CAPABILITIES\n- Analyze transaction data to identify spending patterns.\n- Answer questions about specific transactions or vendors.\n- Provide basic summaries of spending by category or time period.\n\nBEHAVIORAL GUIDELINES\n- Maintain a professional and friendly communication style.\n- Keep responses concise but informative.\n- Always clarify if you need more information to answer a question.\n- Format currency values appropriately.\n- Ensure user privacy and data security.\n\nCONSTRAINTS & BOUNDARIES\n- Do not provide financial investment advice.\n- Avoid discussing topics outside of the transaction data provided.\n- Never make assumptions about the user's financial situation beyond what's in the data.\n\nSUCCESS CRITERIA\n- Deliver accurate and helpful analysis of transaction data.\n- Achieve high user satisfaction through clear and helpful responses.\n- Maintain user trust by ensuring data privacy and security.",
      "tools":{

      },
      "workflows":{

      },
      "provider":"openai.chat",
      "modelId":"gpt-4o",
      "defaultGenerateOptions":{

      },
      "defaultStreamOptions":{

      }
   }
}
```

## Step10: Understanding Tools in Mastra

Tools let your agent call functions to perform specific tasks and access external data/APIs. <br />
Each tool has:

- A unique ID
- A clear description
- Input/output schemas
- An execute function

They extend agent capabilities beyond the model. <br />
Next, we’ll create a tool to fetch transaction data from a Google Sheet.

## Step 11: creating transactions tool

```typescript
// /src/mastra/tools/get-transactions-tool.ts

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const getTransactionsTool = createTool({
  id: "get-transactions",
  description: "Get transaction data from Google Sheets",
  inputSchema: z.object({}),
  outputSchema: z.object({
    csvData: z.string(),
  }),
  execute: async () => {
    return await getTransactions();
  },
});

const getTransactions = async () => {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQWaCzJAFsF4owWRHQRLo4G0-ERv31c74OOZFnqLiTLaP7NweoiX7IXvzQud2H6bdUPnIqZEA485Ux/pub?gid=0&single=true&output=csv";
  const response = await fetch(url);
  const data = await response.text();
  return {
    csvData: data,
  };
};
```

## Step12: connecting tool to agent

`financialAgent` 의 tool 에 `getTransactionsTool` 추가

```typescript
// /src/mastra/agents/financial-agent.ts

import { getTransactionsTool } from "../tools/get-transactions-tool";

export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
...
- Maintain user trust by ensuring data privacy and security.`,
  model: openai("gpt-4o"),
  tools: { getTransactionsTool },
});
```

마찬가지로 playground 에서 추가된 tool 확인 가능

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-step11.png?raw=true)

## Step16: adding memory to agent

Added memory to financialAgent with a LibSQLStore-backed Memory.

```typescript
// /src/mastra/agents/financial-agent.ts

import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
...
- Maintain user trust by ensuring data privacy and security.`,
  model: openai("gpt-4o"),
  tools: { getTransactionsTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../memory.db",
    }),
  }),
});
```

아울러 project root folder 에 다음 DB file 생성됨.

```
├── memory.db
├── memory.db-shm
├── memory.db-wal
```

## conclusion

Completed the lesson and here’s the conclusion. <br />
Congratulations!

You built:

- A well-scoped financialAgent with a strong system prompt
- A get-transactions tool pulling data from Google Sheets
- Memory with LibSQLStore for conversational context

Next ideas:

- Add more tools or integrate MCP servers
- Improve memory/storage
- Compose agents with workflows

---

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-lecture2.png?raw=true)

## Step 1: Introduction to MCP

MCP lets your Mastra agent access external services (e.g., Gmail, GitHub, news, filesystem) through a standard interface, without writing custom tools for each.

## Step2 : installing mcp

```bash
npm install @mastra/mcp@latest
```

## Step3: setting up mcp configuration

Adding mcpTools initialization with top-level await

```typescript
// /src/mastra/mcp.ts

import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
  servers: {
    // Servers will be added in subsequent steps
  },
});

export const mcpTools = await mcp.getTools();
```

## Step7: What is Zapier MCP?

Zapier MCP connects your agent to thousands of apps (Gmail, Outlook, Twitter/X, LinkedIn, Trello, Asana, etc.) via Zapier.
It expands capabilities without writing custom tools for each service.

## Step8: getting zapier mcp url

```typescript
// /src/mastra/mcp.ts

import { MCPClient } from "@mastra/mcp";

const zapierUrl = process.env.ZAPIER_MCP_URL;

export const mcp = new MCPClient({
  servers: zapierUrl
    ? {
        zapier: {
          url: new URL(zapierUrl),
        },
      }
    : {},
});

export const mcpTools = await mcp.getTools();
```

## Step13: what is github mcp

```typescript
import { MCPClient } from "@mastra/mcp";
import { createSmitheryUrl } from "@smithery/sdk";

const zapierUrl = process.env.ZAPIER_MCP_URL;
const smitheryApiKey = process.env.SMITHERY_API_KEY;
const smitheryProfile = process.env.SMITHERY_PROFILE;

const githubMcpUrl =
  smitheryApiKey && smitheryProfile
    ? createSmitheryUrl("https://server.smithery.ai/@smithery-ai/github", {
        apiKey: smitheryApiKey,
        profile: smitheryProfile,
      })
    : undefined;

export const mcp = new MCPClient({
  servers: {
    ...(zapierUrl
      ? {
          zapier: {
            url: new URL(zapierUrl),
          },
        }
      : {}),
    ...(githubMcpUrl
      ? {
          github: {
            url: new URL(githubMcpUrl),
          },
        }
      : {}),
  },
});

export const mcpTools = await mcp.getTools();
```

getting github mcp url
14
updating mcp config github
15
updating agent instructions github
16
testing github integration
17
troubleshooting github
18
what is hackernews mcp
19
updating mcp config hackernews
20
updating agent instructions hackernews
21
testing hackernews integration
22
troubleshooting hackernews
23
what is filesystem mcp
24
creating notes directory
25
updating mcp config filesystem
26
updating agent instructions filesystem
27
testing filesystem integration
28
troubleshooting filesystem
29
enhancing memory configuration
30
conclusion

---

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-lecture3.png?raw=true)

## Step 1: Understanding Memory in Mastra

Memory lets agents keep context across turns, remember preferences, and tailor answers. <br />
Mastra organizes context into:

- System instructions and user info (working memory)
- Recent messages (conversation history)
- Older but relevant messages (semantic recall)

## Step 2: Why Memory Matters

With memory, agents can remember prior inputs, preferences, and context to deliver personalized, coherent responses across turns. This avoids repetitive questions and improves UX.

## Step3: creating basic memory agent

```typescript
// /src/mastra/agents/memory-agent.ts

import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.
  `,
  model: openai("gpt-4o"),
  memory,
});
```

## Step6: Managing Conversation History

Mastra uses memory threads with:

- `threadId`: conversation identifier
- `resourceId`: user/entity identifier

Playground sets these automatically; <br />
In apps, pass them to persist memory per user/conversation.

## Step7: configuring conversation history

add `options.lastMessages`

```typescript
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  options: {
    lastMessages: 20,
  },
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
...
  model: openai("gpt-4o"),
  memory,
});
```

## Step8: using memory in application

To use memory outside the playground, **pass IDs per call**:

```typescript
await memoryAgent.stream("Hello, my name is Alice.", {
  resourceId: "user_alice",
  threadId: "conversation_123",
});
```

## Step11: handling memory frontend

In a frontend, only send the latest user message; Mastra injects history. Include resourceId and threadId on each call.

## Step12: vector store configuration

Adding LibSQLVector to memoryAgent’s Memory configuration so semantic embeddings can be stored

```typescript
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../vector.db",
  }),
  options: {
    lastMessages: 20,
  },
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `...`,
  model: openai("gpt-4o"),
  memory,
});
```

## Step13: What is semantic recall

**Semantic recall** lets the agent search older messages **via the vector store** to bring relevant context back, beyond the recent-history window.

## Step14: how semantic recall works

enable semantic recall by adding `embedder`:

- `openai.embedding('text-embedding-3-small')`
- `options.semanticRecall: true`

```typescript
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../vector.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: true,
  },
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `...`,
  model: openai("gpt-4o"),
  memory,
});
```

## Step17: Advanced configuration semantic recall

- semanticRecall: turns on vector-based search over older messages so the agent can “remember” relevant past info.
- topK: 3: retrieve up to 3 most semantically similar past messages.
- messageRange: { before: 2, after: 1 }: for each matched message, also include 2 messages before and 1 after it for context.
- Effect: beyond the last-history window, the agent pulls a few relevant snippets (with nearby context) from earlier in the conversation.

```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

const memory = new Memory({
  ...
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
  },
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `...`,
  model: openai("gpt-4o"),
  memory,
});
```

## Step18: what is working memory

Working memory (what it is)

- Persistent, structured facts the agent keeps handy (name, preferences, goals, deadlines).
- Different from history/recall: it stores durable key details, not past messages.

## Step19: how working memory works

Stored as a small, structured **Markdown block** the agent reads each turn.
Agent updates it when new durable facts appear.
It’s a **distilled summary (not raw messages)**, so cheaper and consistent to inject each time.

## Step20: configuring working memory

- Enabled working memory: options.workingMemory.enabled = true
- Expanded agent instructions to explain updating and using working memory

```typescript
const memory = new Memory({
...
    workingMemory: {
      enabled: true,
    },
  },
});

export const memoryAgent = new Agent({
    name: 'MemoryAgent',
    instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.

    IMPORTANT: You have access to working memory to store persistent information about the user.
    When you learn something important about the user, update your working memory.
    This includes:
    - Their name
    - Their location
    - Their preferences
    - Their interests
    - Any other relevant information that would help personalize the conversation

    Always refer to your working memory before asking for information the user has already provided.
    Use the information in your working memory to provide personalized responses.
  `,
    model: openai('gpt-4o'),
    memory,
});
```

## Step21: custom working memory templates

```typescript
const memory = new Memory({
...
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Info
- Name:
- Location:
- Timezone:

## Preferences
- Communication Style:
- Interests:
- Favorite Topics:

## Session State
- Current Topic:
- Open Questions:
-
`,
    },
  },
});

export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `...`,
  model: openai("gpt-4o"),
  memory,
});
```

## Step23: working memory in practice

Key takeaways:

- Store only durable, cross-turn facts.
- Guide the agent clearly on when/how to update memory.
- Keep a clean, purpose-built template.
- Test updates and retrieval, including corrections.

## Step26: Creating learning assistant

```typescript
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";

const learningMemory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../vector.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    workingMemory: {
      enabled: true,
      template: `
# Learner Profile

## Personal Info
- Name:
- Learning Style: [Visual, Auditory, Reading/Writing, Kinesthetic]

## Learning Journey
- Current Topics:
  - [Topic 1]:
    - Skill Level: [Beginner, Intermediate, Advanced]
    - Started: [Date]
    - Goals:
    - Resources:
    - Progress Notes:
  - [Topic 2]:
    - Skill Level: [Beginner, Intermediate, Advanced]
    - Started: [Date]
    - Goals:
    - Resources:
    - Progress Notes:

## Session State
- Current Focus:
- Questions to Revisit:
- Recommended Next Steps:
`,
    },
  },
});

export const learningAssistantAgent = new Agent({
  name: "Learning Assistant",
  instructions: `
    You are a personal learning assistant that helps users learn new skills and tracks their progress.
    
    ## Your Capabilities
    
    - You help users set learning goals and track their progress
    - You provide explanations and resources tailored to their skill level
    - You remember what topics they're learning and their progress in each
    - You adapt your teaching style to match their learning preferences
    
    ## Guidelines for Using Memory
    
    - When the user shares information about their learning style or preferences,
      update your working memory.
    
    - When the user asks about a topic they've mentioned before, use your semantic
      recall to provide continuity in your teaching.
    
    - When explaining concepts, check your working memory to understand their
      current skill level and provide an explanation at the appropriate depth.
    
    Always be encouraging and supportive. Focus on building the user's confidence
    and celebrating their progress.
  `,
  model: openai("gpt-4o"),
  memory: learningMemory,
});
```

## Step28: memory best practices

As you build memory-enhanced agents, keep these best practices in mind:

1. **Be selective about what goes into working memory**

- Focus on information that will be relevant across multiple conversations
- Don't overload working memory with transient details

2. **Use clear instructions**

- Give your agent explicit guidance on when and how to update working memory
- Instruct it to check memory before asking for information the user has already provided

3. **Choose appropriate memory parameters**

- Adjust `lastMessages`, `topK`, and `messageRange` based on your use case
- More isn't always better - larger context windows can dilute focus

4. **Consider privacy implications**

- Be transparent with users about what information is being stored
- Implement appropriate security measures for sensitive information

5. **Test thoroughly**

- Verify that your agent correctly recalls information across different scenarios
- Test edge cases like conflicting information or corrections

6. **Design thoughtful templates**

- Structure your working memory templates based on your agent's specific needs
- Include clear sections and organization to make information easy to find

7. **Balance memory types**

- Use conversation history for recent context
- Use semantic recall for finding relevant past information
- Use working memory for persistent user details and state

By following these best practices, you can create memory-enhanced agents that provide truly personalized and contextual experiences while avoiding common pitfalls like information overload, privacy concerns, and inconsistent behavior.

---

![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-ai-101-lecture4.png?raw=true)

## Step1: introduction to workflows

**Workflows** break complex tasks into typed, reusable steps with automatic validation and tracing. We’ll build a content-processing workflow next.

## Step2: Understanding Steps

Each step defines **input/output schemas** and **an execute function**, enabling typed, validated, reusable units you can chain.

## Step3: creating your first step

```typescript
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const validateContentStep = createStep({
  id: "validate-content",
  description: "Validates incoming text content",
  inputSchema: z.object({
    content: z.string().min(1, "Content cannot be empty"),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    const { content, type } = inputData;

    const wordCount = content.trim().split(/\s+/).length;
    const isValid = wordCount >= 5;

    if (!isValid) {
      throw new Error(`Content too short: ${wordCount} words`);
    }

    return {
      content: content.trim(),
      type,
      wordCount,
      isValid,
    };
  },
});
```

## Step4: creating a second step

```typescript
export const enhanceContentStep = createStep({
  id: "enhance-content",
  description: "Adds metadata to validated content",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    const { content, type, wordCount } = inputData;

    const readingTime = Math.ceil(wordCount / 200);

    let difficulty: "easy" | "medium" | "hard" = "easy";
    if (wordCount > 100) difficulty = "medium";
    if (wordCount > 300) difficulty = "hard";

    return {
      content,
      type,
      wordCount,
      metadata: {
        readingTime,
        difficulty,
        processedAt: new Date().toISOString(),
      },
    };
  },
});
```

## Step5: chaining steps together

```typescript
export const contentWorkflow = createWorkflow({
  id: "content-processing-workflow",
  description: "Validates and enhances content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .commit();
```

## Step6: registering with mastra

```typescript
import { contentWorkflow } from './workflows/content-workflow';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, contentWorkflow },
...
});
```

## Step8 : adding a third step

```typescript
export const generateSummaryStep = createStep({
  id: "generate-summary",
  description: "Creates a summary of the content",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { content, type, wordCount, metadata } = inputData;

    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const firstSentence =
      (sentences[0]?.trim() || "") + (sentences[0] ? "." : "");

    let summary = firstSentence;
    if (wordCount > 50) {
      summary += ` This ${type} contains ${wordCount} words and takes approximately ${metadata.readingTime} minute(s) to read.`;
    }

    return {
      content,
      type,
      wordCount,
      metadata,
      summary,
    };
  },
});

export const contentWorkflow = createWorkflow({
  id: "content-processing-workflow",
  description: "Validates and enhances content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .commit();
```

## Step10: creating an ai agent

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

export const contentAgent = new Agent({
  name: "Content Agent",
  description: "AI agent for analyzing and improving content",
  instructions: `
    You are a professional content analyst. Your role is to:
    1. Analyze content for clarity and engagement
    2. Identify the main themes and topics
    3. Provide a quality score from 1-10
    4. Suggest specific improvements
    
    Always provide constructive, actionable feedback.
  `,
  model: openai("gpt-4o-mini"),
});
```

```typescript
export const mastra = new Mastra({
...
  agents: {
    weatherAgent,
    financialAgent,
    memoryAgent,
    learningAssistantAgent,
    contentAgent,
  },
...
});
```

## Step11: using agent in workflow

```typescript
export const aiAnalysisStep = createStep({
  id: "ai-analysis",
  description: "AI-powered content analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
    aiAnalysis: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
  execute: async ({ inputData, mastra }) => {
    const { content, type, wordCount, metadata, summary } = inputData;

    const prompt = `
Analyze this ${type} content:

Content: "${content}"
Word count: ${wordCount}
Reading time: ${metadata.readingTime} minutes
Difficulty: ${metadata.difficulty}

Please provide:
1. A quality score from 1-10
2. Brief feedback on strengths and areas for improvement

Format as JSON: {"score": number, "feedback": "your feedback here"}
`;

    const agent = mastra.getAgent("contentAgent");
    const { text } = await agent.generate([{ role: "user", content: prompt }]);

    let aiAnalysis: { score: number; feedback: string };
    try {
      aiAnalysis = JSON.parse(text);
    } catch {
      aiAnalysis = {
        score: 7,
        feedback: "AI analysis completed. " + text,
      };
    }

    return {
      content,
      type,
      wordCount,
      metadata,
      summary,
      aiAnalysis,
    };
  },
});

export const contentWorkflow = createWorkflow({
  id: "content-processing-workflow",
  description: "Validates and enhances content",
...
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .then(aiAnalysisStep)
  .commit();
```

## Step12: creating ai enhanced workflow

```typescript
export const aiContentWorkflow = createWorkflow({
  id: "ai-content-workflow",
  description: "AI-enhanced content processing with analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(), // added
    aiAnalysis: z.object({
      // added
      score: z.number(),
      feedback: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .then(aiAnalysisStep)
  .commit();
```

## Step13: understanding parallel execution

**Parallel execution** lets independent steps **run simultaneously** for speed.

## Step14: creating parallel steps

- seoAnalysisStep
- readabilityStep
- sentimentStep

```typescript
export const seoAnalysisStep = createStep({
  id: "seo-analysis",
  description: "SEO optimization analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    seoScore: z.number(),
    keywords: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const words = inputData.content.toLowerCase().split(/\s+/);
    const keywords = words.filter((w) => w.length > 4).slice(0, 3);
    return {
      seoScore: Math.floor(Math.random() * 40) + 60,
      keywords,
    };
  },
});
```

```typescript
export const readabilityStep = createStep({
  id: "readability-analysis",
  description: "Content readability analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    readabilityScore: z.number(),
    gradeLevel: z.string(),
  }),
  execute: async ({ inputData }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sentences =
      inputData.content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
        .length || 1;
    const words = inputData.content
      .split(/\s+/)
      .filter((s) => s.trim().length > 0).length;
    const avg = words / sentences;
    const score = Math.max(0, 100 - avg * 3);
    const gradeLevel = score > 80 ? "Easy" : score > 60 ? "Medium" : "Hard";
    return {
      readabilityScore: Math.floor(score),
      gradeLevel,
    };
  },
});
```

```typescript
export const sentimentStep = createStep({
  id: "sentiment-analysis",
  description: "Content sentiment analysis",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    confidence: z.number(),
  }),
  execute: async ({ inputData }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const content = inputData.content.toLowerCase();
    const positives = ["good", "great", "excellent", "amazing"].filter((w) =>
      content.includes(w),
    ).length;
    const negatives = ["bad", "terrible", "awful", "horrible"].filter((w) =>
      content.includes(w),
    ).length;
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (positives > negatives) sentiment = "positive";
    if (negatives > positives) sentiment = "negative";
    return {
      sentiment,
      confidence: Math.random() * 0.3 + 0.7,
    };
  },
});
```

## Step15:building parallel workflow

`.parallel([seoAnalysisStep, readabilityStep, sentimentStep])`

```typescript
export const parallelAnalysisWorkflow = createWorkflow({
  id: "parallel-analysis-workflow",
  description: "Run multiple content analyses in parallel",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    results: z.object({
      seo: z.object({
        seoScore: z.number(),
        keywords: z.array(z.string()),
      }),
      readability: z.object({
        readabilityScore: z.number(),
        gradeLevel: z.string(),
      }),
      sentiment: z.object({
        sentiment: z.enum(["positive", "neutral", "negative"]),
        confidence: z.number(),
      }),
    }),
  }),
})
  .parallel([seoAnalysisStep, readabilityStep, sentimentStep])
  .then(
    createStep({
      id: "combine-results",
      description: "Combines parallel analysis results",
      inputSchema: z.object({
        "seo-analysis": z.object({
          seoScore: z.number(),
          keywords: z.array(z.string()),
        }),
        "readability-analysis": z.object({
          readabilityScore: z.number(),
          gradeLevel: z.string(),
        }),
        "sentiment-analysis": z.object({
          sentiment: z.enum(["positive", "neutral", "negative"]),
          confidence: z.number(),
        }),
      }),
      outputSchema: z.object({
        results: z.object({
          seo: z.object({
            seoScore: z.number(),
            keywords: z.array(z.string()),
          }),
          readability: z.object({
            readabilityScore: z.number(),
            gradeLevel: z.string(),
          }),
          sentiment: z.object({
            sentiment: z.enum(["positive", "neutral", "negative"]),
            confidence: z.number(),
          }),
        }),
      }),
      execute: async ({ inputData }) => {
        return {
          results: {
            seo: inputData["seo-analysis"],
            readability: inputData["readability-analysis"],
            sentiment: inputData["sentiment-analysis"],
          },
        };
      },
    }),
  )
  .commit();
```

## Step17: understanding conditional branching

Conditional branching allows workflows to:

- **Make decisions**: Choose different processing paths based on data
- **Handle variations**: Process different content types differently
- **Optimize performance**: Skip unnecessary steps for certain inputs
- **Customize behavior**: Provide different experiences based on conditions

#### Real-World Example

Imagine a content processing workflow that:

- **Short content** (< 50 words): Gets quick processing
- **Medium content** (50-200 words): Gets standard processing
- **Long content** (> 200 words): Gets detailed processing with extra analysis

#### Basic Branching Syntax

```typescript
.branch([
  [condition1, step1],
  [condition2, step2],
  [condition3, step3]
])
```

Where:

- **condition**: An async function that returns `true` or `false`
- **step**: The step to execute if the condition is `true`

#### Condition Functions

Conditions are functions that examine the input data:

```typescript
// Example condition function
async ({ inputData }) => {
  return inputData.wordCount < 50;
};
```

#### Multiple Paths

- If multiple conditions are `true`, **all matching steps run in parallel**
- If no conditions are `true`, the workflow continues without executing any branch steps
- Conditions are evaluated in order, but matching steps run simultaneously

#### Benefits

- **Smart routing**: Send data down the most appropriate path
- **Performance**: Skip expensive operations when not needed
- **Flexibility**: Handle different scenarios in one workflow
- **Maintainability**: Clear logic for different processing paths

## Step18: creating conditional steps

```typescript
export const assessContentStep = createStep({
  id: "assess-content",
  description: "Assesses content to determine processing path",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
  }),
  execute: async ({ inputData }) => {
    const { content, type } = inputData;
    const words = content
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const wordCount = words.length;

    let category: "short" | "medium" | "long" = "short";
    if (wordCount >= 50) category = "medium";
    if (wordCount >= 200) category = "long";

    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / Math.max(1, wordCount);
    let complexity: "simple" | "moderate" | "complex" = "simple";
    if (avgWordLength > 5) complexity = "moderate";
    if (avgWordLength > 7) complexity = "complex";

    return { content, type, wordCount, complexity, category };
  },
});
```

```typescript
export const quickProcessingStep = createStep({
  id: "quick-processing",
  description: "Quick processing for short and simple content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    return {
      processedContent: inputData.content,
      processingType: "quick",
      recommendations: [
        "Content is concise",
        "Consider expanding for more detail",
      ],
    };
  },
});
```

```typescript
export const generalProcessingStep = createStep({
  id: "general-processing",
  description: "General processing for all other content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      processedContent: inputData.content,
      processingType: "general",
      recommendations: [
        "Consider simplifying content",
        "Break up long paragraphs",
        "Add examples or explanations if needed",
      ],
    };
  },
});
```

## Step19: building conditional workflow

```typescript
export const conditionalWorkflow = createWorkflow({
  id: "conditional-workflow",
  description: "Content processing with conditional branching",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    recommendations: z.array(z.string()),
  }),
})
  .then(assessContentStep)
  .branch([
    [
      async ({ inputData }) =>
        inputData.category === "short" && inputData.complexity === "simple",
      quickProcessingStep,
    ],
    [
      async ({ inputData }) =>
        !(inputData.category === "short" && inputData.complexity === "simple"),
      generalProcessingStep,
    ],
  ])
  .commit();
```

```typescript
export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    contentWorkflow,
    aiContentWorkflow,
    parallelAnalysisWorkflow,
    conditionalWorkflow,  // added
  },
...
});
```

---

## Reference

- [mastra 101](https://mastra.ai/course)
