---
title: "[typescript] optional field 와 mandatory undefined union field 의 차이점"
pubDate: 2024-07-02
description: "TypeScript optional과 mandatory undefined union field 비교"
author: "tkhwang"
featured: false
image:
  url: ""
  alt: ""
tags: ["typescript"]
---

```typescript
type Writers = {
  author: string | undefined;
  editor?: string;
};
```

## Mandatory undefined union field

`author` 필드는 mandatory field 이고, 타입인 `string` 과 `undefined` union 입니다.

필드가 mandatory 이므로 값이 반드시 존재해야하고, 그 값이 `string` 타입이거나 `undefined` 가 될 수 있습니다.
author 필드는 생략 될 수 없고, 값이 없는 경우에는 `undefined` 값을 넣어야합니다.

```typescript
const writer1: Writers = {
  author: undefined,
};

//Property 'author' is missing in type '{}' but required in type 'Writers'.(2741)
const writer2: Writers = {};
```

## Optional field

`editor` field 는 optional field 입니다. Optional field 는 자동적으로 `undefined` union 으로 추론됩니다.

`editor` 필드는 optional 이므로 필드가 없을 수도 있고, 필드가 있는 경우에도 `string` 혹은 `undefined` 가 될 수 있습니다.

```typescript
const writer3: Writers = {
  author: "John Doe",
};
const writer4: Writers = {
  author: "John Doe",
  editor: "Great Editor",
};
const writer5: Writers = {
  author: "John Doe",
  editor: undefined,
};
```

## Reference

- [실무로 통하는 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=341765327)
