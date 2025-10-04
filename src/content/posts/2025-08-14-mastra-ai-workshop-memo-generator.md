---
title: "[mastra.ai] mastra.ai 에이전트로 밈 생성기 만들어보기"
pubDate: 2025-08-14
description: "mastra.ai를 활용해 회사 짜증나는 상황을 재미있는 밈으로 변환하는 AI 에이전트를 TypeScript로 구현해보는 실습 가이드"
author: "tkhwang"
image:
  url: ""
  alt: ""
tags: ["ai", "mastra.ai"]
---

[mastra.ai](https://mastra.ai/)에 대한 감을 잡기 위해서 유튜브 영상 [(Workshop) AI Pipelines and Agents in Pure TypeScript with Mastra.ai — Nick Nisi, Zack Proser](https://www.youtube.com/watch?v=FWlRHPZWyHE&t=862s) 에 나온 회사 짜증나는 상황에서 짤 생성하는 agent 만들어보는 workshop 영상을 따라하면서 정리해봅니다.

---

## TL;DR

- 입력 : "AI가 너무 빠르게 바뀌어서 힘들어"
- 출력 : ![img](https://github.com/tkhwang/tkhwang-etc/blob/master/img/2025/08/mastra-memo-generation.jpg?raw=true)

## Agent 정의

CrewAI 와 비슷하게 Agent 의 이름, prompt, memory 와 workflow 정의

- name
- instructions
- model
- memory
- workflows

```typescript
export const memeGeneratorAgent = new Agent({
  name: "MemeGenerator",
  instructions: `
    You are a helpful AI assistant that turns workplace frustrations into funny, shareable memes. 
    
    CRITICAL: When a user describes ANY workplace frustration (even briefly), IMMEDIATELY run the "meme-generation" workflow. Do NOT ask for more details.
    
    WORKFLOW - Run the complete meme generation workflow:
    Use the "meme-generation" workflow when user mentions any frustration. This workflow will:
    1. Extract frustrations from user input
    2. Find appropriate meme templates
    3. Generate captions
    4. Create the meme image
    
    After running the workflow, examine the output for the shareableUrl and present it to the user with an enthusiastic, celebratory message that relates to their frustration.
    
    You have access to chat history, so you can reference previous conversations and memes created for the user.
    
    EDGE CASES:
    - If someone just says "hi" or greets you, ask them about their work frustrations
    - If they mention something positive, acknowledge it but ask if they have any frustrations to turn into memes
    - If the workflow fails, apologize and ask them to try describing their frustration differently
    - Keep track of memes you've created for each user to avoid repetition
  `,
  model: openai("gpt-4o-mini"),
  memory,
  workflows: {
    "meme-generation": memeGenerationWorkflow,
  },
});
```

## Workflow 정의

Workflow 내의 세부 steps 정의

- id
- description
- inputSchema
- outputSchema
- steps

Workflow 중간에 📊 Data Mapping 을 `.map()` 함수로 표시합니다. 각 Step 단계 사이에 데이터 변환을 명시함.

```typescript
.map({
  fieldName: {
    step: previousStep,    // Which step to get data from
    path: 'nested.field'   // JSONPath to the specific data
  }
})
```

```typescript
export const memeGenerationWorkflow = createWorkflow({
  id: "meme-generation",
  description:
    "Complete workflow to generate memes from workplace frustrations",
  inputSchema: z.object({
    userInput: z.string().describe("Raw user input about work frustrations"),
  }),
  outputSchema: z.object({
    shareableUrl: z.string(),
    pageUrl: z.string().optional(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  steps: [
    extractFrustrationsStep,
    findBaseMemeStep,
    generateCaptionsStep,
    generateMemeStep,
  ],
});

// Build the workflow chain with data mapping
memeGenerationWorkflow
  .then(extractFrustrationsStep)
  .then(findBaseMemeStep)
  .map({
    frustrations: {
      step: extractFrustrationsStep,
      path: ".",
    },
    baseTemplate: {
      step: findBaseMemeStep,
      path: "templates.0",
    },
  })
  .then(generateCaptionsStep)
  .map({
    baseTemplate: {
      step: findBaseMemeStep,
      path: "templates.0",
    },
    captions: {
      step: generateCaptionsStep,
      path: ".",
    },
  })
  .then(generateMemeStep)
  .map({
    shareableUrl: {
      step: generateMemeStep,
      path: "imageUrl",
    },
    pageUrl: {
      step: generateMemeStep,
      path: "pageUrl",
    },
    analysis: {
      step: generateMemeStep,
      path: "analysis",
    },
  })
  .commit();
```

## Step 정의

각 개별 step 의 동작 정의

- id
- description
- inputSchema
- outputSchema
- execute

### `extractFrustrationsStep`

```typescript
export const extractFrustrationsStep = createStep({
  id: "extract-frustrations",
  description:
    "Extract and categorize user frustrations from raw input using AI",
  inputSchema: z.object({
    userInput: z.string().describe("Raw user input about work frustrations"),
  }),
  outputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log("🔍 Analyzing your workplace frustrations...");

      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: frustrationsSchema,
        prompt: `
          Analyze this workplace frustration and extract structured information:
          
          "${inputData.userInput}"
          
          Extract:
          - Individual frustrations with categories
          - Overall mood
          - Keywords for each frustration
          - Suggested meme style
          
          Keep analysis concise and focused.
        `,
      });

      const frustrations = result.object;

      console.log(
        `✅ Found ${frustrations.frustrations.length} frustrations, mood: ${frustrations.overallMood}`
      );

      return {
        ...frustrations,
        analysis: {
          message: `Analyzed your frustrations - main issue: ${frustrations.frustrations[0]?.category} (${frustrations.overallMood} mood)`,
        },
      };
    } catch (error) {
      console.error("Error extracting frustrations:", error);
      throw new Error("Failed to analyze frustrations");
    }
  },
});
```

### `findBaseMemeStep`

```typescript
export const findBaseMemeStep = createStep({
  id: "find-base-meme",
  description: "Find a base meme template",
  inputSchema: frustrationsSchema.extend({
    analysis: z.object({
      message: z.string(),
    }),
  }),
  outputSchema: z.object({
    templates: z.array(memeTemplateSchema),
    searchCriteria: z.object({
      primaryMood: z.enum([
        "frustrated",
        "annoyed",
        "overwhelmed",
        "tired",
        "angry",
        "sarcastic",
      ]),
      style: z.enum([
        "classic",
        "modern",
        "corporate",
        "developer",
        "meeting",
        "remote-work",
      ]),
    }),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log("🔍 Searching for the perfect meme template...");

      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = (await response.json()) as {
        success: boolean;
        data: {
          memes: Array<{
            id: string;
            name: string;
            url: string;
            width: number;
            height: number;
            box_count: number;
          }>;
        };
      };

      if (!data.success) {
        throw new Error("Failed to fetch meme templates");
      }

      const popularMemes = data.data.memes.slice(0, 100);
      const shuffled = popularMemes.sort(() => Math.random() - 0.5);
      const selectedMemes = shuffled.slice(0, 10);
      console.log(`✅ Found ${selectedMemes.length} suitable meme templates`);

      return {
        templates: selectedMemes,
        searchCriteria: {
          primaryMood: inputData.overallMood,
          style: inputData.suggestedMemeStyle,
        },
        analysis: {
          message: `Found ${selectedMemes.length} meme templates matching ${inputData.overallMood} mood`,
        },
      };
    } catch (error) {
      console.error("Error finding meme templates:", error);
      throw new Error("Failed to find meme templates");
    }
  },
});
```

### `generateCaptionsStep`

```typescript
export const generateCaptionsStep = createStep({
  id: "generate-captions",
  description:
    "Generate funny captions based on frustrations and meme template",
  inputSchema: z.object({
    frustrations: frustrationsSchema,
    baseTemplate: memeTemplateSchema,
  }),
  outputSchema: captionsSchema,
  execute: async ({ inputData }) => {
    try {
      console.log(
        `🎨 Generating captions for ${inputData.baseTemplate.name} meme...`
      );

      const mainFrustration = inputData.frustrations.frustrations?.[0];
      const mood = inputData.frustrations.overallMood;

      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: captionsSchema,
        prompt: `
          Create meme captions for the "${inputData.baseTemplate.name}" meme template.

          Context:
          - Frustration: ${mainFrustration?.text ?? "N/A"}
          - Category: ${mainFrustration?.category ?? "N/A"}
          - Mood: ${mood}
          - Meme has ${inputData.baseTemplate.box_count} text boxes

          Make it funny and relatable to office workers. The humor should match the ${mood} mood.
          Keep text concise for meme format. Be creative but workplace-appropriate.
        `,
      });

      const captions = result.object;

      console.log("✅ Captions generated successfully");

      return captions;
    } catch (error) {
      console.error("Error generating captions:", error);
      throw new Error("Failed to generate captions");
    }
  },
});
```

### `generateMemeStep`

```typescript
export const generateMemeStep = createStep({
  id: "generate-meme",
  description: "Create a meme using Imgflip's API",
  inputSchema: z.object({
    baseTemplate: memeTemplateSchema,
    captions: captionsSchema,
  }),
  outputSchema: z.object({
    imageUrl: z.string(),
    pageUrl: z.string().optional(),
    captions: z.object({
      topText: z.string(),
      bottomText: z.string(),
    }),
    baseTemplate: z.string(),
    memeStyle: z.string(),
    humorLevel: z.string(),
    analysis: z.object({
      message: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    try {
      console.log("🎨 Creating your meme...");

      const username = process.env.IMGFLIP_USERNAME || "imgflip_hubot";
      const password = process.env.IMGFLIP_PASSWORD || "imgflip_hubot";

      const formData = new URLSearchParams();
      formData.append("template_id", inputData.baseTemplate.id);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("text0", inputData.captions.topText);
      formData.append("text1", inputData.captions.bottomText);

      const response = await fetch("https://api.imgflip.com/caption_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const result = (await response.json()) as {
        success: boolean;
        error_message?: string;
        data: { url: string; page_url?: string };
      };

      if (!result.success) {
        throw new Error(`Imgflip API error: ${result.error_message}`);
      }

      console.log("✅ Meme created successfully!");

      return {
        imageUrl: result.data.url,
        pageUrl: result.data.page_url,
        captions: {
          topText: inputData.captions.topText,
          bottomText: inputData.captions.bottomText,
        },
        baseTemplate: inputData.baseTemplate.name,
        memeStyle: inputData.captions.memeStyle,
        humorLevel: inputData.captions.humorLevel,
        analysis: {
          message: `Created ${inputData.captions.memeStyle} meme with ${inputData.captions.humorLevel} humor level`,
        },
      };
    } catch (error) {
      console.error("Error generating meme:", error);
      throw new Error("Failed to generate meme");
    }
  },
});
```

## Reference

- [(Workshop) AI Pipelines and Agents in Pure TypeScript with Mastra.ai — Nick Nisi, Zack Proser](https://www.youtube.com/watch?v=FWlRHPZWyHE&t=862s)
- [(github) AI Pipelines and Agents in Pure TypeScript with Mastra.ai](https://github.com/workos/mastra-agents-meme-generator)
