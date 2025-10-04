---
title: "[typescript] 객체 타입 유니언 사용법"
pubDate: 2024-07-02
description: "TypeScript 객체 타입 유니언의 사용법과 타입 내로잉을 통한 속성 접근 방법"
author: "tkhwang"
image:
  url: ""
  alt: ""
tags: ["typescript"]
---

객체 타입 역시 유니언으로 사용할 수 있다.

```typescript
type PoemWithPages = {
  name: string;
  pages: number;
};

type PoemWithRhymes = {
  name: string;
  rhymes: boolean;
};

type Poem = PoemWithPages | PoemWithRhymes;

const poem: Poem =
  Math.random() > 0.5
    ? { name: "The Double Image", pages: 7 }
    : { name: "Her Kind", rhymes: true };
```

## 공통 속성

객체 타입 유니언은 해당 타입의 **공통된 속성에 대한 접근**만 허용된다.

```typescript
poem.name; // OK
```

## 공통되지 않은 속성

공통되지 않은 속성에 접근하면 에러가 발생한다.

```typescript
poem.pages; // Error
```

## 객체 타입 유니언 사용법 : 타입 내로잉 Typing narrowing

공통되지 않은 속성에 대해서는 직접 접근이 되지 않는다.

따라서 이를 접근하기 위해서는 **타입 내로잉 typing narrowing**을 통해서 특정 타입으로 좁혀야 해당 타입에 존재하는 속성을 접근할 수 있다.

- 타입 가드
  - `in` 연산자
  - `typeof` 연산자
  - `instanceof` 연산자
- `satisfies` 연산자

```typescript
if ("pages" in poem) {
  poem.pages; // PoemWithPages 타입
} else {
  poem.rhymes; // PoemWithRhymes 타입
}
```

## Discriminated Unions

개인적으로는 Union 사용 시에는 가능하다면 **Discriminated Unions**을 즐겨 사용한다.

서로 shape 이 너무 다르면 type narrowing 하는 것이 쉽지 않을 수 있으므로, 공통된 필드를 discriminator 로 구분할 있도록 서로 다른 값을 할당한 union 을 사용하는 것이 좋다.

```typescript
interface MessageEvent {
  type: "message"; // discriminator
  content: string;
  senderId: string;
}

interface AlarmEvent {
  type: "alarm"; // discriminator
  severity: "low" | "medium" | "high";
  timestamp: Date;
}
```

## Reference

- [러닝 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=307683870&start=slayer) : 4장 객체
