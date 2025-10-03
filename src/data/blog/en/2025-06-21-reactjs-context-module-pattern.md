---
author: "tkhwang"
pubDatetime: 2025-06-21T00:00:00Z
title: "[react.js] React Context Module 패턴: 전역 Context의 한계를 넘어서는 설계 전략"
slug: "2025-06-21-reactjs-context-module-pattern"
featured: false
draft: false
tags:
  - "react"
  - "pattern"
description: "상태 관리와 비즈니스 로직을 모듈 단위로 구조화하는 방법"
---

React에서 전역 상태를 관리할 때 Context API를 사용하는 것이 흔한 선택입니다. 하지만 규모가 커지는 프로젝트에서 단순히 Context를 생성하고 Provider로 감싸는 방식은 여러 가지 문제를 유발할 수 있습니다.

## ❗ 전통적인 Context 사용 방식의 문제점

```typescript
export function App {
    ...
    return (
      <AProvider>
        <BProvider>
          <CProvider>
          ...
          </CProvider>
        </BProvider>
      </AProvider>
    );
}
```

이처럼 여러 Context Provider를 중첩해서 사용하는 방식은 다음과 같은 문제를 발생시킵니다:

- Provider 중첩으로 인해 코드 가독성이 떨어짐
- Context 생성, Provider 정의, 훅 정의가 여러 파일에 흩어져 유지보수가 어려움
- 전역 Context로 인해 의존 범위가 넓어짐
- **하위 컴포넌트의 불필요한 리렌더링**으로 **성능 저하** 가능
- 테스트와 재사용이 어려움

이러한 문제를 해결하기 위한 실용적인 접근 방식으로 **Context Module 패턴**이 등장했습니다.

## ✅ Context Module 패턴이란?

Context Module 패턴은 Context를 전역이 아닌 모듈 단위로 국한하여 사용하는 구조입니다. 필요한 모듈 내에서만 Context를 정의하고 사용함으로써 응집력 있는 구조와 명확한 책임 범위를 유지할 수 있습니다.

### 1. 모듈 전용 Context 정의

```typescript
// /features/users/context/user-context.tsx

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
```

- Context 정의, Provider 구성, 커스텀 훅이 하나의 파일에 응집
- 내부 상태와 접근 방식이 명확히 분리됨

### 2. 모듈 최상단에서만 Provider 감싸기

전역이 아닌, 해당 기능 모듈의 최상단에서만 Provider로 감쌉니다.

```typescript
// /features/users/index.tsx

import { UserProvider } from './context/user-context';

export default function Users() {
  return (
    <UserProvider>
      {/* ... */}
      <UserComponent />
    </UserProvider>
  );
}
```

### 3. 하위 컴포넌트에서는 커스텀 훅으로 접근

```typescript
// UserComponent.tsx

import { useUser } from '../context/user-context';

export function UserComponent() {
  const { user, setUser } = useUser();

  return <div>Hello, {user?.name}</div>;
}
```

### ✨ Context Module 패턴의 장점

- 모듈 단위의 책임 분리: 불필요한 전역 의존성을 줄이고 모듈 내부에서만 상태 관리
- 응집도 높은 구조: 관련 로직이 한 파일에 모여 있어 유지보수와 추적이 용이
- 테스트 용이: 각각의 Context가 독립되어 있어 유닛 테스트 구성이 쉬움

* 확장성과 협업에 유리: 명확한 구조 덕분에 팀원이 빠르게 이해 가능
* 불필요한 리렌더링 방지: 상태 변경의 영향 범위를 좁혀 성능 개선

## 마치며

Context API는 강력하지만, 잘못 사용하면 프로젝트의 복잡성을 가중시킬 수 있습니다. Context Module 패턴은 이를 보완하는 구조적 설계 방식으로, **“Context + Custom Hook” 조합**을 통해 **상태 관리를 모듈화**하고 **효율적으로 유지**할 수 있습니다.

프로젝트가 커질수록 이 패턴은 선택이 아닌 필수에 가까운 전략이 될 수 있습니다.

## 📔 참조 : [shadcn-admin](https://github.com/satnaing/shadcn-admin) 레포지토리

- [UsersProvider](https://github.com/satnaing/shadcn-admin/blob/c07f38a3d650089a7660dc63f671848ac1a2b2ab/src/features/users/index.tsx#L19)

* [UsersContext](https://github.com/satnaing/shadcn-admin/blob/c07f38a3d650089a7660dc63f671848ac1a2b2ab/src/features/users/context/users-context.tsx#L14)
* [useUsers()사용](https://github.com/satnaing/shadcn-admin/blob/c07f38a3d650089a7660dc63f671848ac1a2b2ab/src/features/users/components/users-dialogs.tsx#L7)
