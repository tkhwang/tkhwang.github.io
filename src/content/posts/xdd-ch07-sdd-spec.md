---
title: "[SDD+TDD+DDD] Ch.7: AI와 함께 Spec 정의하기 — SDD 실전"
pubDate: 2026-03-29
description: "AI와의 대화로 콘텐츠 도메인 Value Object의 Spec을 정의하는 과정을 실전으로 시연합니다"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "sdd"]
---

이 글은 **[SDD+TDD+DDD] 시리즈**의 일곱 번째 글입니다. <br />

Ch.5에서는 요구사항을 PRD로 정리했고, Ch.6에서는 그 PRD를 DDD 관점에서 top-down으로 분해했습니다. Bounded Context를 나누고, `Content` Aggregate와 `Content` Entity를 중심으로, `ContentUrl`, `Tag`, `ConsumptionStatus`, `Rating` 같은 Value Object 후보를 뽑았습니다.

이번 글의 질문은 그다음 단계입니다. **"그래서 이 객체들의 규칙은 어떻게 설계하지?"** 답은 구현 전에 Spec을 먼저 정의하는 것입니다. 그리고 이 단계에서 AI가 좋은 대화 상대가 됩니다.

이번 글에서는 작은 Value Object 몇 개를 골라, **AI와 대화하며 Spec을 만드는 과정**을 실제 흐름에 가깝게 시연해 보겠습니다.

## SDD란

SDD는 단순합니다. **구현 전에 Spec을 먼저 정의한다.**

여기서 말하는 Spec은 거창한 문서가 아닙니다. 적어도 아래 질문에 답할 수 있으면 됩니다.

- 이 객체는 어떤 조건에서 생성 가능한가?
- 이 객체는 어떤 행동을 하는가?
- 이 객체의 불변 조건은 무엇인가?

이 질문에 답하는 문서가 곧 Spec입니다. 코드를 쓰기 전에 도메인 규칙을 먼저 정리하는 것입니다.

Ch.6에서 이미 객체 후보를 정했기 때문에, 이제는 그 후보 중 작은 것부터 골라 규칙을 좁게 다듬을 수 있습니다. 이번 글에서는 `ContentUrl`, `Tag`, `ConsumptionStatus`를 예로 들겠습니다.

여기서 `design`과 `specs`를 구분해 두면 더 깔끔합니다. `design`은 Ch.6처럼 경계와 객체 후보를 정리하는 문서이고, `specs`는 그중 실제로 구현할 객체의 규칙을 적는 문서입니다. 즉 DDD Building Block 단위로 Spec을 남기되, 설계 문서와는 역할을 분리하는 것입니다.

이번 글의 범위에서는 아직 Value Object부터 시작하는 단계이므로, `docs/specs/value-objects/`만 먼저 사용하면 충분합니다. 이후 Entity나 Aggregate를 구현하는 단계로 가면 그때 `docs/specs/entities/`, `docs/specs/aggregates/`처럼 확장하면 됩니다.

## 왜 이 방식이 AI 시대에 강력한가

### AI는 Spec의 빈틈을 먼저 드러낸다

구현 전에 AI와 Spec을 정리하면, 사람이 익숙해서 지나치기 쉬운 빈칸이 빨리 드러납니다.

- `"   "` 같은 입력은 어떻게 처리할까?
- `http`만 허용할까, `https`도 허용할까?
- 태그 내부 공백은 허용할까?
- `Bookmarked`에서 바로 `Done`으로 갈 수 있을까?

이런 질문은 구현을 시작한 뒤에야 떠오르기 쉽습니다. 하지만 AI와 대화하며 Spec을 쓰면, AI가 빠진 조건을 되묻고 모호한 규칙을 다시 정리해 줍니다. 즉 AI는 단순히 코드를 생성하는 도구가 아니라, **Spec의 논리적 빈틈을 먼저 드러내는 리뷰어**가 될 수 있습니다.

### Spec은 AI에게 주는 명확한 프롬프트다

AI에게 그냥 "ContentUrl 만들어줘"라고 하면, AI는 여러 규칙을 추측합니다. 어떤 구현은 `ftp`까지 허용할 수 있고, 어떤 구현은 공백 정리를 하지 않을 수 있습니다.

반대로 Spec이 있으면 이야기가 달라집니다.

> "이 Spec대로 `ContentUrl` Value Object를 TypeScript로 구현해줘."

이때 AI는 추측이 아니라 **명세를 기준으로 구현**합니다. 생성 규칙은 생성자 검증으로, 불변 조건은 테스트 케이스로, 행동은 메서드 설계로 이어집니다.

### Spec은 context 복원 도구다

장기 작업에서는 맥락이 쉽게 끊깁니다. 일주일 뒤에 `ConsumptionStatus` 규칙을 수정해야 한다고 가정해 봅시다. 그때 AI에게 코드만 다시 보여 주는 것보다, Spec을 같이 주는 편이 훨씬 강합니다.

> "이 `ConsumptionStatus` Spec을 기준으로, `Bookmarked -> Done` 직접 전이를 허용할지 다시 검토해줘."

Spec은 곧 context입니다. AI의 기억에 의존하지 않고, 문서화된 규칙에 의존하는 방식입니다.

특히 객체가 많아질수록 이 장점이 커집니다. `ConsumptionStatus` 규칙을 바꾸면 `Content`의 행동과 `Rating` 허용 조건까지 함께 영향을 받을 수 있습니다. 이때 관련 Spec들을 함께 보면, 변경 영향과 정합성을 더 쉽게 점검할 수 있습니다.

### DDD 구성하는 Building Block 단위라서 Spec이 쓰기 쉽다

큰 서비스 전체의 Spec은 쓰기 어렵습니다. 하지만 작은 Value Object 하나의 Spec은 훨씬 좁고 명확합니다. DDD가 도메인을 작은 Building Block으로 나누기 때문에, 각 단위에 대해 Spec을 쓰는 흐름이 자연스럽습니다.

이 차이는 데이터 위주 설계와 비교하면 더 분명합니다. 데이터 위주 설계에서는 규칙이 Service 레이어에 넓게 퍼져 있어서, 하나의 규칙을 설명하려 해도 여러 함수와 조건을 한꺼번에 끌고 와야 합니다. 반면 DDD의 Building Block은 작은 책임 단위로 나뉘어 있어서, **객체 하나의 규칙을 문서화하고 검증하기가 훨씬 쉽습니다.**

**큰 서비스 하나의 Spec은 쓰기 어렵지만, 작은 Value Object 하나의 Spec은 대화 몇 번이면 완성됩니다.**

그렇다면 실제로 SDD를 어떻게 사용하는지 보겠습니다.

## ContentUrl Spec 정의 — AI와의 대화

### 대화 시작

아래 대화는 흐름을 이해하기 쉽도록 정리한 예시입니다. 실제 작업에서는 순서가 조금 달라질 수 있고, 중간에 규칙을 다시 바꾸는 일도 자주 있습니다.

> **나:** 북마크한 콘텐츠의 URL을 표현하는 `ContentUrl` Value Object가 필요해. Spec을 같이 정의해 보자.

> **AI:** 먼저 확인할 것이 있습니다.
>
> 1. 빈 문자열은 허용되나요?
> 2. 상대 경로(`/foo`)도 허용하나요, 아니면 절대 URL만 허용하나요?
> 3. 어떤 프로토콜을 허용하나요? `http`, `https`, `ftp`?
> 4. 정규화는 어디까지 하나요? 앞뒤 공백 제거, host 소문자화, trailing slash 제거 등

> **나:** 빈 문자열은 안 돼. 절대 URL만 허용. 프로토콜은 `http`와 `https`만 허용하자. 공백은 제거하고, 기본적인 URL 파싱으로 정규화되는 정도까지만 하자.

> **AI:** 좋습니다. 그러면 규칙은 대략 이렇습니다.
>
> - 입력값의 앞뒤 공백 제거
> - 유효한 절대 URL이어야 함
> - `http` 또는 `https`만 허용
> - 정규화된 문자열을 내부 값으로 사용
>
> 한 가지 더 확인하겠습니다. `HTTPS://Example.com/post` 같은 입력은 소문자화된 scheme/host로 정규화된 결과를 저장해도 되나요?

> **나:** 그 정도는 괜찮아. URL 파서를 거친 결과를 저장한다고 보면 되겠다.

> **AI:** 알겠습니다. 그러면 "유효성 검사 후 정규화된 URL 문자열을 저장한다"로 정리하겠습니다.

> **나:** 좋아. 이 내용을 `docs/specs/value-objects/content-url.md`에 들어갈 형태로 정리해줘.

### 완성된 ContentUrl Spec

```markdown
## ContentUrl (Value Object)

### 생성 규칙
- 입력값의 앞뒤 공백은 제거한다
- 유효한 절대 URL이어야 한다
- 허용 프로토콜은 http, https 뿐이다
- 검증을 통과한 뒤 정규화된 URL 문자열을 내부 값으로 사용한다

### 불변 조건
- ContentUrl의 value는 항상 유효한 절대 URL이다
- ContentUrl의 value는 항상 http 또는 https 스킴을 가진다
- ContentUrl의 value에는 앞뒤 공백이 없다

### 동등성
- 두 ContentUrl은 value가 같으면 같다
```

여기서 중요한 것은 아직 코드가 한 줄도 없다는 점입니다. 순수하게 규칙만 정리했습니다. 그리고 대화가 없었다면 "절대 URL만 허용할지", "`ftp`를 막을지", "정규화 범위를 어디까지 둘지" 같은 결정을 구현 중에 뒤늦게 하게 되었을 가능성이 큽니다.

## Tag Spec 정의 — AI와의 대화

`Tag`는 문자열처럼 단순해 보이지만, 실제로는 정규화 정책이 꽤 중요합니다.

### 대화 시작

> **나:** 이번에는 `Tag` Value Object의 Spec을 정의하자.

> **AI:** 태그는 보통 정규화 규칙부터 정해야 합니다.
>
> 1. 앞뒤 공백 제거?
> 2. 대소문자 구분?
> 3. 빈 문자열 허용?
> 4. 길이 제한?
> 5. 내부 공백은 허용하나요? 예: `machine learning`

> **나:** 앞뒤 공백은 제거하고, 소문자로 정규화하자. 빈 문자열은 안 돼. 길이 제한은 20자로 두자. 내부 공백은 허용하되, trim 후 비어 있으면 안 된다.

> **AI:** 좋습니다. 그러면 `Tag`는 아래처럼 정리할 수 있습니다.
>
> - trim
> - lowercase
> - trim 결과가 비어 있으면 불가
> - 20자 초과 불가
> - 내부 공백은 허용
>
> 한 가지 더: `"DDD"`와 `"ddd"`는 같은 태그로 봐도 되나요?

> **나:** 맞아. 소문자로 정규화했으니 같은 태그다.

> **나:** 좋다. `docs/specs/value-objects/tag.md` 형태로 정리해줘.

### 완성된 Tag Spec

```markdown
## Tag (Value Object)

### 생성 규칙
- 입력값의 앞뒤 공백은 제거한다
- 소문자로 정규화한다
- 정규화한 결과가 비어 있으면 유효하지 않다
- 정규화한 결과가 20자를 초과하면 유효하지 않다
- 내부 공백은 허용한다

### 불변 조건
- Tag의 value는 항상 비어 있지 않다
- Tag의 value는 항상 20자 이하이다
- Tag의 value는 항상 소문자이다
- Tag의 value에는 앞뒤 공백이 없다

### 동등성
- 두 Tag는 value가 같으면 같다
```

`Tag` 예제에서는 AI가 "내부 공백을 허용할 것인가", `"DDD"`와 `"ddd"`를 같은 태그로 볼 것인가" 같은 질문을 먼저 던진 점이 중요합니다. 이런 결정은 작아 보여도, 검색과 필터링, 중복 제거까지 영향을 줍니다.

## ConsumptionStatus Spec 정의 — AI와의 대화

이번에는 단순한 정규화보다 **상태 전이 규칙**이 중요한 Value Object입니다.

### 대화 시작

> **나:** `ConsumptionStatus` Value Object의 Spec도 정리하자. 상태는 `Bookmarked`, `InProgress`, `Done` 세 가지다.

> **AI:** 그럼 먼저 상태 값과 전이 규칙을 분리해서 확인하겠습니다.
>
> 1. 허용 상태는 세 가지뿐인가요?
> 2. `Bookmarked -> InProgress -> Done`만 허용하나요?
> 3. `Bookmarked -> Done` 직접 전이는 허용하나요?
> 4. `Done` 이후 다시 이전 상태로 돌아갈 수 있나요?

> **나:** 허용 상태는 세 가지뿐. 전이는 `Bookmarked -> InProgress -> Done`만 허용하자. 직접 완료는 허용하지 않고, `Done` 이후 되돌리는 것도 일단 없다.

> **AI:** 그러면 행동도 같이 정리할 수 있습니다.
>
> - `start()`: `Bookmarked`에서만 `InProgress`로 전이
> - `complete()`: `InProgress`에서만 `Done`으로 전이
>
> 이 외의 전이는 모두 유효하지 않다고 보면 될까요?

> **나:** 맞아. 일단 그렇게 가자.

> **AI:** 좋습니다. 그러면 이 객체는 단순 enum이 아니라, 상태 전이 규칙을 가진 Value Object로 정리할 수 있습니다.

> **나:** `docs/specs/value-objects/consumption-status.md` 형태로 정리해줘.

### 완성된 ConsumptionStatus Spec

```markdown
## ConsumptionStatus (Value Object)

### 생성 규칙
- 허용 상태는 Bookmarked, InProgress, Done 뿐이다

### 행동
- start()는 Bookmarked 상태에서만 호출 가능하며 InProgress를 반환한다
- complete()는 InProgress 상태에서만 호출 가능하며 Done을 반환한다
- 허용되지 않은 전이는 유효하지 않다

### 불변 조건
- ConsumptionStatus의 value는 항상 Bookmarked, InProgress, Done 중 하나이다

### 동등성
- 두 ConsumptionStatus는 value가 같으면 같다
```

이 예시는 특히 중요합니다. `ConsumptionStatus`를 단순 문자열이나 enum으로만 두면, 전이 규칙이 밖으로 새기 쉽습니다. 그러면 어떤 서비스는 `Bookmarked -> Done`을 허용하고, 어떤 서비스는 막는 식으로 규칙이 흩어질 수 있습니다. 반대로 Value Object와 Spec 안에 이 규칙을 담아 두면, 상태 전이에 대한 판단 기준이 한곳에 모입니다.

## 예시 프로젝트 구조는 이렇게 둘 수 있다

대화의 산출물은 프로젝트 안에 파일로 남기는 편이 좋습니다. 아래는 **예시 프로젝트 구조**입니다.

- `designs`: PRD를 바탕으로 정리한 세부 설계 문서 모음
- `specs`: 실제 구현 전에 객체 단위 규칙을 적는 명세 문서 모음

```text
project/
├── docs/
│   ├── watchable.PRD.md
│   ├── watchable.DESIGN.md
│   ├── designs/                  # 필요할 때 세부 설계 문서 추가
│   │   ├── contexts/
│   │   │   └── bookmark-tracking.md
│   │   ├── aggregates/
│   │   │   └── content.md
│   │   └── flows/
│   │       └── consumption-flow.md
│   └── specs/
│       └── value-objects/
│           ├── content-url.md
│           ├── tag.md
│           └── consumption-status.md
├── src/
│   └── domain/
│       └── value-objects/
│           ├── content-url.ts
│           ├── tag.ts
│           └── consumption-status.ts
└── tests/
    └── domain/
        └── value-objects/
            ├── content-url.test.ts
            ├── tag.test.ts
            └── consumption-status.test.ts
```

예시 프로젝트에서는 `docs/watchable.PRD.md`에 요구사항, `docs/watchable.DESIGN.md`에 기본 상위 설계 결과를 두고, `docs/specs/value-objects/`에 Spec, `src/domain/value-objects/`에 구현, `tests/domain/value-objects/`에 테스트를 둘 수 있습니다. 이렇게 두면 시리즈의 흐름도 그대로 드러납니다. PRD에서 출발해 DESIGN으로 분해하고, 그다음 개별 객체의 Spec을 만들고, 마지막에 테스트와 구현으로 내려가는 구조입니다.

필요한 경우에는 `docs/designs/` 아래에 세부 디자인 문서를 더 추가해도 됩니다. 예를 들어 `contexts/`에는 Bounded Context 분해, `aggregates/`에는 Aggregate 구조, `flows/`에는 주요 흐름이나 화면 흐름을 둘 수 있습니다. 다만 기본 출발점은 여전히 `watchable.DESIGN.md` 하나로 두고, 세부 문서는 그 내용을 보완하거나 확장하는 용도로 쓰는 편이 관리하기 쉽습니다.

물론 실제 저장소에서는 파일명이 조금 다를 수 있습니다. 중요한 것은 이름 자체보다 역할입니다. 요구사항은 PRD에, 상위 설계는 DESIGN에, 구현 전 규칙은 `specs`에 남기면 각 문서의 책임이 섞이지 않습니다. Spec을 수정하면 테스트를 수정하고, 테스트를 수정하면 구현을 수정하는 흐름도 디렉토리 구조에서 바로 드러납니다.

### 왜 객체별로 Spec을 나누는가

이 구조를 추천하는 이유는 DDD의 각 Building Block이 저마다 **주체적인 규칙과 책임**을 가지기 때문입니다. `ContentUrl`, `Tag`, `ConsumptionStatus`처럼 작은 Value Object도 각각 따로 확인해야 할 생성 규칙, 불변 조건, 동등성이 있습니다.

이후 `Entity`, `Aggregate`, `Domain Service`로 넘어가면 각 객체가 책임지는 요구사항과 기능은 더 분명하게 나뉘게 됩니다. 그래서 DDD로 설계한 객체들은 가능하면 **Building Block마다 하나의 Spec**을 두고 관리하는 편이 좋습니다. 지금은 `value-objects/`부터 시작하지만, 나중에는 `entities/`, `aggregates/` 같은 디렉토리로 자연스럽게 확장할 수 있습니다. 하나의 큰 문서 안에 여러 객체의 규칙을 섞어 두면, 나중에 수정할 때 어떤 규칙이 어느 객체의 책임인지 흐려지기 쉽습니다.

반대로 객체별로 Spec을 분리해 두면, 해당 객체의 요구사항과 기능을 독립적으로 검토하고, 테스트와 구현도 같은 단위로 맞춰 가기가 쉬워집니다. 각 DDD Building Block마다 `Spec -> Test -> 구현`이 한 짝으로 대응하기 때문에, 나중에 특정 객체를 다시 이해하거나 context를 복원할 때도 훨씬 유리합니다.

## Value Object Spec에서 자주 확인하는 항목

세 개의 Spec을 나란히 놓고 보면, 반복해서 확인하는 항목이 보입니다.

| Value Object | 생성 규칙 | 행동 | 불변 조건 | 동등성 |
|---|---|---|---|---|
| **ContentUrl** | trim, 절대 URL, http/https만 허용 | — | 항상 유효한 절대 URL | value 동일 |
| **Tag** | trim, lowercase, 비어 있으면 불가, 20자 초과 불가 | — | 비어 있지 않음, 20자 이하, 소문자 | value 동일 |
| **ConsumptionStatus** | 세 상태만 허용 | start, complete | 항상 허용 상태 중 하나 | value 동일 |

물론 이것이 고정 템플릿은 아닙니다. 어떤 Value Object는 행동이 거의 없을 수 있고, 어떤 객체는 정규화보다 범위 검증이 더 중요할 수 있습니다. 중요한 것은 형식을 맞추는 것이 아니라, **객체의 규칙을 빠뜨리지 않고 명확하게 적는 것**입니다.

Spec을 쓰다 보면 자연스럽게 DDD Building Block의 형태가 드러납니다. 이것이 DDD와 SDD가 잘 맞는 이유입니다.

## Spec은 Test의 기준이 된다

여기서 한 걸음 더 가면 바로 TDD로 이어집니다. Spec이 있으면 무엇을 검증해야 하는지가 이미 정리되어 있기 때문에, 테스트를 설계하기가 훨씬 쉬워집니다.

예를 들어 `Tag` Spec이 있으면 다음 테스트 후보가 바로 떠오릅니다.

- 앞뒤 공백을 제거하는가?
- 대문자를 소문자로 정규화하는가?
- 공백만 있는 입력을 막는가?
- 20자를 넘는 태그를 막는가?

즉 Spec은 변경의 기준을 만들고, Test는 그 기준이 실제로 지켜지는지를 계속 감시합니다. AI와 반복적으로 협업할수록 이 역할은 더 중요해집니다.

## Spec과 Code는 항상 함께 갱신되어야 한다

Spec을 문서로 남겼다면, 그 Spec과 실제 코드는 항상 함께 맞춰 가야 합니다. 좋은 흐름은 대개 이렇습니다.

1. Spec을 논의하고 확정한다
2. 그 Spec을 바탕으로 테스트 케이스를 정리한다
3. 테스트를 구현한다
4. 테스트를 통과하도록 구현한다

이 순서를 놓치고 코드만 먼저 바꾸면, 문서로 남은 Spec이 빠르게 낡습니다. 나중에 사람이 읽을 때도, AI에게 context로 전달할 때도 잘못된 방향의 근거가 될 수 있습니다.

즉 Spec은 한 번 쓰고 버리는 문서가 아니라, 코드와 함께 유지되는 기준입니다.

## 참고: SDD를 도와주는 도구들

이번 글에서는 AI와 직접 대화하며 Spec을 정의하는 과정을 보여드렸습니다. 이 방식만으로도 충분히 효과적이지만, SDD 워크플로우를 더 체계적으로 지원하는 도구들도 있습니다. 다만 중요한 것은 도구 자체보다, **구현 전에 Spec을 먼저 정의하는 습관**입니다.

- **Superpower**: AI와의 대화 흐름을 `Plan -> Spec -> Implementation` 순서로 정리해 주는 도구입니다.
- **OpenSpec**: Spec 문서 형식을 더 일관되게 관리하고 싶을 때 참고할 수 있는 오픈소스 규약입니다.
- **GitHub Spec Kit**: Spec 문서와 구현 작업을 연결해 관리하는 데 도움을 주는 도구입니다.

## 다음 글에서는

이번 글에서는 콘텐츠 도메인의 작은 Value Object 세 개에 대한 Spec을 정의했습니다. 코드는 아직 한 줄도 없지만, 각 객체가 어떤 규칙을 가지고 어떤 행동을 하는지는 명확해졌습니다.

다음 글(Ch.8)에서는 이 Spec을 **TDD로 구현**합니다. `ContentUrl`이나 `Tag`처럼 경계가 분명한 Value Object 하나를 골라, Red -> Green -> Refactor 사이클을 처음부터 끝까지 돌려 보겠습니다. Spec의 한 줄이 어떻게 테스트가 되고, 그 테스트가 구현을 어떻게 밀어붙이는지 직접 확인해 보겠습니다.
