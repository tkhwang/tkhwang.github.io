---
title: "[typescript] unknown 사용법"
description: "any 대신에 unknown 을 쓰라고 하는데, 어떻게 써야해요 ?"
date: "Mar 29 2024"
tags: ["typescript"]
---

`any` 는 부득이하게 사용하는 경우가 있는데, `unknown` 을 제대로 사용해보지 못한 것 같다.

타입스크립트 사용 시에 `any` 와 `unknown` 은 언제 써야할까 ?

## [1] `any`

타입 기능을 끄고 싶은 상황

## [2] `unknown`

사용 시 주의가 필요할 때 사용

```typescript
function doSomething(value: unknown) {
  if (typeof value === 'string') {
    console.log("It's a string", value.toUpperCase())
  } else if (typeof value === 'number') {
    console.log('It's a number", value * 2)
  }
}
```

이렇게 `unkown` 은

- 타입이 명확하지 않은 경우에
- 안전하게 어떤 타입도 받아드릴 수 있도록 `unknown` 타입으로 선언을 한 후에
- `type narrowing` 을 통해서 특정 타입으로 구체화해서 사용함.

## Reference

- [실무로 통하는 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=341765327)
  - [2.1] 애너테이션 효과적으로 사용하기
