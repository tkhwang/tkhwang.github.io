---
author: tkhwang
pubDatetime: 2024-07-03T00:00:00.000Z
title: "[typescript] 객체 타입 유니언"
slug: 2024-07-03-typescript-object-type-union
featured: false
tags:
  - typescript
description: "객체 타입 유니언에 공통되지 않은 속성에 접근한다면 ?"
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

객체 타입 유니언은 해당 타입의 **공통된 속성에 대한 접근**만 허용된다.

```typescript
poem.name; // OK
```

공통되지 않은 속성에 접근하면 에러가 발생한다.

```typescript
poem.pages; // Error
```

## 타입 내로잉 Typing narrowing

이를 위해서는 **타입 내로잉 typing narrowing**을 통해서 특정 타입으로 좁혀야 해당 타입에 존재하는 속성을 접근할 수 있다.

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

## Reference

- [러닝 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=307683870&start=slayer) : 4장 객체
