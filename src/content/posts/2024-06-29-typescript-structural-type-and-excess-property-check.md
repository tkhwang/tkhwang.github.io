---
title: "[typescript] 구조적 타이핑 structural typing과 초과 속성 검사 Excess property check"
description: "TypeScript 구조적 타이핑과 초과 속성 검사의 이해"
date: "Mar 29 2024"
tags: ["typescript"]
---

타입스크립트의 다른 typed language 와 다른 점은 `구조적 타이핑 (structural type system)`을 적용한다는 것이다.

```typescript
type Person = {
  name: string;
  age: number;
};

function printPerson(person: Person) {
  console.log(person.name, person.age);
}
```

타입의 이름이 중요한 것이 아니라 모든 멤버에 대응하는 값의 타입이 서로 일치하면 타입이 호환되는 것으로 간주한다.

```typescript
type User = {
  id: number;
  name: string; // Person과 동일
  age: number; // Person과 동일
};
const user: User = {
  id: 1234,
  name: "userName",
  age: 20,
};

// User type 이지만 Person type 이 요구하는 name, age 가지고 있어서 에러가 발생하지 않는다.
printPerson(user);
```

### 초과 속성 검사 Excess property check

여기서 재미있는 것은 동일한 shape 이지만 변수가 아니라 리터럴을 전달할 때에는 `excess property check` 가 동작하여 추가 프로터티가 허용되지 않으므로 컴파일 오류가 발생한다.

```typescript
printPerson({
  name: "userName",
  age: 40,
  id: 1, // Error: 객체 리터럴은 알려진 속성만 지정할 수 있으며 Person 형식에 id가 없습니다
});
```

#### 나의 해석

이는 variable 을 사용하는 경우에 excess property 가 있는 경우는 unintentional error로 생각하는 반면 object literal을 사용하는 경우에는 좀더 직접적인 상황이므로 excess property가 있으면 intentional error 로 생각하는 것이 아닐까 한다.

## Reference

- [실무로 통하는 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=341765327)
  - [2.1] 애너테이션 효과적으로 사용하기
- [Typescript in 50 Lessons](https://typescript-book.com/)
