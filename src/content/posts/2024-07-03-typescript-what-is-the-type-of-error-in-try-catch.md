---
title: "[typescript] try catch 에서 error type 은 ?"
description: "TypeScript try-catch error 타입과 타입 내로잉 활용법"
date: "Jul 03 2024"
---

개인적으로 타입스크립트를 쓰면서 이상한 것 중의 하나가 try catch 에서 error 타입이다.
에러이니깐 당연히 `Error` 타입이 되어야 한다고 생각했으나 typescript 버전에 따라서 예전에는 `any`, 최근에는 `unknown` 타입이다.

왜 그럴까 ?

```typescript
try {
} catch (error: ?) {
  // handle Error
}
```

## throw

일반적으로 throw 를 통해서 error 을 전달하지만 javascript 에서는 throw 에는 모든 타입을 다 사용할 수 있다고 합니다.

```typescript
throw "This is error!";
throw 4;
throw { type: "error", message: "This is error!" };
throw null;
throw new Promise(() => {});
throw undefined;
```

이렇게 `throw` 를 통해서 어떤 타입이라도 전달할 수 있기 때문에 `catch` 된 `error` 가 어떤 타입이 되는지 알 수 없습니다.

## Error 타입으로 제한하기

어떤 타입인지 명확하지 않기 때문에 모든 타입을 받을 수 있는 `unknown` 을 받은 다음에 [unknown 사용법](https://tkhwang.github.io/posts/2024-06-29-typescript-how-to-use-unknown/)에 따라서 각 개별 타입에 대해서 **타입 내로잉 type narrowing** 해서 구체화해서 사용을 해야합니다.

```typescript
try {

} catch (error: unknown) {
  // type narrowing
  if (error instanceof Error) {
    // handle Error
    console.log(error.message)
  } else if (typeof error === 'string') {
    // handle string
    console.log(error);
  } else {
    // handle other error
    ...
  }
}
```

## Reference

- [실무로 통하는 타입스크립트](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=341765327)
