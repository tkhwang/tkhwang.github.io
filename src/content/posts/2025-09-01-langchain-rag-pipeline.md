---
title: "[LangChain.js] RAG pipeline"
description: "LangChain.js로 RAG 파이프라인 구현: 문서 로딩, 텍스트 분할, OpenAI 임베딩 생성, pgvector 저장, 유사도 검색 흐름 정리"
date: "Sep 01 2025"
tags: ["ai", "langchain", "rag"]
---

LangChain.js로 **RAG (Retrieval-Augmented Generation) 적용**을 위해 RAG 파이프라인 구축 내용을 정리해봅니다.

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

const loader = new TextLoader("./test.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

// 임베딩 생성
const model = new OpenAIEmbeddings();
const embeddings = await model.embedDocuments(
  chunks.map((chunk) => chunk.pageContent)
);
```

## 벡터 저장소에 임베딩 저장

PostgreSQL에 pgvector 확장 기능을 추가하여 벡터 저장소로 사용

```typescript
const connectionString = `postgresql://id:pw@localhost:6024/langchain`;

const loader = new TextLoader("./test.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

// 문서에 대한 임베딩 생성
const model = new OpenAIEmbeddings();
const db = await PGVectorStore.fromDocuments(chunks, model, {
  postgresConnectionOptions: {
    connectionString,
  },
});
```

## 문서 검색

```typescript
await db.similaritySearch("query", 4);
```
