---
title: "[LangChain.js] RGA pipeline"
description: ""
date: "Sep 01 2025"
tags: ["ai", "langchain", "rag"]
---

Langchain.js 으로 **RAG (Retrieval-Augmented Gneration) 적용** 하기 위해서 rag pipeline 구축하는 내용을 보면서 정리해봅니다.

## 문서-텍스트 변환

```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new TextLoader("./test.txt");
const loader = new CheerioWebBaseLoader("https://www.langchain.com");
const loader = new PDFLoader("./test.pdf");

const docs = await loader.load();
```

## 텍스트를 여러 조각으로 분할

```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const loader = new TextLoader("./test.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splittedDocs = await splitter.splitDocuments(docs);
```

## 텍스트 임베딩 생성

```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

}
const loader = new TextLoader('./test/txt');
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

// 임베딩 생성
const model = new OpenAIEmbeddedings();
const embeddings = await model.embedDocuments(chunks.map((chunk) => chunk.pageContent));
```

## 벡터 저장소에 임베딩 저장

PostgresSQL 에 벡터 저장소 pgvector 확장 기능으로 추가

```typescript
const connectionString = `postgresql://id:pw@localhost:6024/langchain`;

const loader = new TextLoader("./test/txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const docs = await splitter.splitDocuments(docs);

// 문서에 대한 임베딩 생성
const model = new OpenAIEmbeddings();
const db = await PGVectorStore.fromDocuments(docs, model, {
    postgresConnectionOptions: {
      connectionString,
    }}
});
```

## 문서 검색

```typescript
await db.similaritySearch("query", 4);
```

## Reference

- [Plan-and-Execute Agents](https://blog.langchain.com/planning-agents/)
