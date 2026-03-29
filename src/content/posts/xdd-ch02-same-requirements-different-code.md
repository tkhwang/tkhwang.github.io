---
title: "[SDD+TDD+DDD] Ch.2: 같은 요구사항, 다른 코드 — 두 가지 사고방식"
pubDate: 2026-03-25
description: "동일한 요구사항을 데이터 중심 vs 도메인 중심으로 구현해서, 코드로 직접 증명합니다"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "sdd"]
---

이 글은 **[SDD+TDD+DDD] 시리즈**의 두 번째 글입니다. <br />

Ch.1에서는 "왜 도메인 중심이어야 하는가"를 서사로 풀었습니다. 프레임워크 중심 개발의 피로감, 데이터 중심 프로그래밍의 한계, 그리고 AI 시대에 개발자의 본질적 역할이 도메인에 있다는 이야기를 나누었습니다.

이번 글에서는 "어떻게 다른가"를 코드로 보여드립니다.

같은 요구사항을 두 가지 방식으로 구현합니다. 하나는 우리에게 익숙한 데이터 중심 방식, 다른 하나는 도메인 중심 방식입니다. 동일한 비즈니스 규칙을 같은 TypeScript로 나란히 놓고 비교해 보겠습니다. 말뿐 아니라 코드로 직접 확인해 봅시다.

**같은 요구사항, 다른 구조. 코드가 증명합니다.**

## 먼저, 모델링이 왜 중요한가

이번 글에서는 누구나 익숙한 고객(Customer) 예제로 두 가지 사고방식을 비교합니다. 예시는 의도적으로 단순화했고, 핵심은 구현 디테일보다 모델링 관점의 차이에 있습니다. 이후 시리즈가 본격적인 구현 단계로 들어가면, 상태 전이와 일관성 경계가 더 잘 드러나는 콘텐츠 북마크 & 소비 추적 도구 도메인으로 전환합니다.

본격적인 비교에 앞서, 작은 차이 하나를 먼저 보겠습니다. 고객(Customer) 정보를 모델링한다고 해봅시다. 요구사항은 다음과 같습니다.

- **name**: 비어있을 수 없고, 50자 이하, 앞뒤 공백 제거
- **email**: 유효한 이메일 형식이어야 하고, 대소문자 구분 없이 정규화
- **points**: 0 이상의 정수, 소수점 불가

같은 요구사항을 두 가지 방식으로 모델링한 코드입니다.

```typescript
// 기본형으로 모델링
class Customer {
  name: string
  email: string
  points: number
}
```

```typescript
// 객체로 모델링
class Customer {
  name: Name
  email: Email
  points: RewardPoints
}
```

* 위쪽은 익숙합니다. `name`은 `string`, `email`은 `string`, `points`는 `number`.
* 아래쪽은 `Name`, `Email`, `RewardPoints`라는 별도의 객체를 사용합니다.

만약 오른쪽이 더 편하게 느껴지신다면, 이미 객체 지향 설계와 DDD에 익숙하신 분일 가능성이 큽니다. 이 섹션은 가볍게 넘기셔도 좋습니다.

하지만 "굳이 왜? `string`이랑 `number`면 충분하지 않나?"라는 생각이 드신다면, 이 차이가 왜 중요한지 하나씩 살펴보겠습니다.

## 데이터 위주 사고방식

"Customer를 만들어야 해." 이 말을 듣는 순간, 머릿속에 무엇이 떠오르시나요?

많은 개발자가 가장 먼저 떠올리는 건 **데이터**입니다. "이름이 있고, 이메일이 있고, 포인트가 있으니까..." 그리고 자연스럽게 다음 생각이 이어집니다. **"DB 테이블부터 만들자."**

```sql
CREATE TABLE customers (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(255),      -- string
  email    VARCHAR(255),      -- string
  points   INTEGER            -- number
);
```

DB 스키마가 먼저 정해지고 코드는 그 스키마에 맞춰 만들어집니다. <br />
`name`은 `VARCHAR`니까 `string`, `points`는 `INTEGER`니까 `number`. <br />
DB 컬럼과 코드의 필드가 1:1로 매핑됩니다. 이것이 데이터 위주 사고방식의 출발점입니다.

이 방식이 익숙하고 자연스러운 건 당연합니다. 대부분의 프레임워크 튜토리얼이 이렇게 시작하니까요. 하지만 이렇게 만들어진 `string`과 `number`에는 비즈니스 규칙이 스며들어 있지 않습니다.

### name: `string`

```typescript
const name: string = ""               // 통과 — 빈 이름?
const name: string = "a".repeat(200)  // 통과 — 200자 이름?
const name: string = "   "            // 통과 — 공백만?
```

`string`은 어떤 값이든 받아들입니다. 빈 문자열 체크, 최대 길이 체크, 공백 트리밍 같은 검증이 회원가입에도, 프로필 수정에도, 관리자 페이지에도 중복됩니다.

> 잠깐만요. name 만 보면 그렇긴한데...
> name 을 바꿀 수 있는 방법은 유저 생성 (createCustomer)와 프로필 상세에서 수정 (updateCustomer) 뿐인거 아닌가요?
> 위의 두 경우 API 에서 DTO 에서 다 검증하고 있어서 잘못된 값이 들어올 수 없습니다.

맞습니다. 실제로 많은 팀이 `class-validator` 같은 라이브러리로 API 경계에서 검증합니다.

```typescript
// 유저 생성 createCustomer :  CreateCustomerDto
class CreateCustomerDto {
  @IsNotEmpty({ message: "이름은 비어있을 수 없습니다" })
  @MaxLength(50, { message: "이름은 50자를 초과할 수 없습니다" })
  @Transform(({ value }) => value?.trim())
  name: string

  @IsEmail({}, { message: "유효하지 않은 이메일 형식입니다" })
  email: string
}

// 유저 업데이트 updateCustomer: UpdateCustomerNameDto — 같은 규칙을 다시 선언
class UpdateCustomerNameDto {
  @IsNotEmpty({ message: "이름은 비어있을 수 없습니다" })
  @MaxLength(50, { message: "이름은 50자를 초과할 수 없습니다" })
  @Transform(({ value }) => value?.trim())
  name: string
}
```

`POST /customers`와 `PUT /customers/:id`에서 DTO 검증을 거치니까 문제될 상황이 없어 보입니다. **하지만 이 방어막만으로는 충분하지 않을 때가 있습니다.**

**1. API 경계를 거치지 않는 진입점**

```typescript
// 배치 작업: CSV에서 고객 일괄 등록
async function importCustomersFromCsv(rows: CsvRow[]) {
  for (const row of rows) {
    // DTO 검증을 거치지 않음 — name이 빈 문자열이어도 그대로 저장
    await customerRepository.save({ name: row.name, email: row.email })
  }
}

// 이벤트 핸들러: 외부 시스템에서 고객 동기화
@OnEvent("external-customer.synced")
async handleCustomerSynced(payload: ExternalCustomerPayload) {
  // DTO 검증을 거치지 않음
  await customerService.createFromExternal(payload.name, payload.email)
}
```

DTO는 **Controller → Service** 경로만 지킵니다. 배치 작업, 이벤트 핸들러, 마이그레이션 스크립트, 내부 서비스 간 호출 같은 경로는 DTO를 거치지 않습니다.

**2. 규칙이 분산되어 조용히 어긋남**

```typescript
// CreateCustomerDto: 50자 제한
@MaxLength(50)
name: string

// 6개월 후, 다른 개발자가 만든 AdminUpdateCustomerDto: 100자 제한
@MaxLength(100)
name: string

// 또 다른 곳의 Service 코드: 제한 없음
if (name.length === 0) throw new Error("이름은 필수입니다")
// MaxLength 체크를 깜빡함
```

Customer 이름 길이를 규정하는 비즈니스 규칙이 여러곳에 흩어져 있습니다. 이렇게 계속 시간이 지나면 서로 다른 규칙이 공존할 수도 있고, 규칙 변경 시에 누락된 것이 있어서 버그가 발생하는 주요한 원인이 되곤 합니다. **규칙의 원본(Single Source of Truth)이 없기 때문입니다.**

**3. 도메인 객체 자체는 무방비**

```typescript
// Service 내부에서 직접 생성 — DTO 검증과 무관
const customer = new Customer()
customer.name = ""           // 아무도 막지 않음
customer.points = -100       // 아무도 막지 않음
await customerRepository.save(customer)
```

DTO가 아무리 철저해도 도메인 객체 자체가 잘못된 값을 허용하면, DTO를 우회하는 순간 시스템 전체가 위험해집니다. DTO는 **외벽의 경비원**이지, 값 자체의 보증은 아닙니다.

### points: `number`

```typescript
const earnedPoints: number = 1000
const bonusPoints: number = 300
const totalPoints: number = earnedPoints + bonusPoints
```

`number`만으로는 여전히 중요한 질문이 남습니다.

- 음수 포인트가 들어오면?
- 1.5포인트 같은 소수값은 허용되나요?
- 적립과 차감 규칙은 누가 보장하나요?

`number`는 이런 질문에 답할 수 없습니다. 그래서 검증 코드가 Service 곳곳에 흩어집니다. `if (points < 0) throw ...`가 여기저기 중복되고, 정수 여부나 차감 가능 여부도 개발자의 주의력에 의존하게 됩니다.

### email: `string`

```typescript
const email: string = "not-an-email"     // 통과
const email: string = ""                  // 통과
const email: string = "  User@Example.COM  "  // 통과
```

형식 검증은 어떨까요? `if (!email.includes("@")) throw ...`가 회원가입에도, 알림 발송에도 중복됩니다. 정규화는 또 어떨까요? 어떤 시스템은 소문자로 바꾸고 어떤 시스템은 그대로 두어 같은 사용자가 다른 사용자로 인식될 수 있습니다.

### 데이터 위주 사고방식의 공통 문제

세 경우 모두 같은 패턴입니다. **기본형은 아무 값이나 받아들이고, 규칙은 그 값을 사용하는 곳에서 반복해서 검증해야 합니다.** 한 곳이라도 빠뜨리면 잘못된 값이 시스템 안을 돌아다닙니다.

## 객체 위주 사고방식

이번에는 같은 요구사항을 객체로 표현해 보겠습니다.

### Name

```typescript
class Name {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Name {
    const trimmed = value.trim()
    if (trimmed.length === 0)
      throw new Error("이름은 비어있을 수 없습니다")
    if (trimmed.length > 50)
      throw new Error("이름은 50자를 초과할 수 없습니다")

    return new Name(trimmed)
  }
}
```

`new Name("홍길동")`이 아니라 `Name.create("홍길동")`으로 생성하고 있습니다.

- **`constructor`는 `private`** — 외부에서 `new Name()`을 직접 호출할 수 없습니다. 검증을 우회할 방법이 없습니다.
- **`create()`가 유일한 진입점** — 모든 생성이 이 팩토리 메서드를 거치므로, 검증 로직이 반드시 실행됩니다.
- **생성자는 단순 할당만** — `constructor`는 이미 검증된 값을 받아서 저장만 합니다. "생성 = 검증 완료"라는 의미가 `create()`라는 이름에 명시적으로 드러납니다.

이 패턴은 이후 `RewardPoints`, `Email`에도 그대로 적용됩니다. **`create()`를 통과했다는 것 자체가 "이 값은 유효하다"는 보증**입니다. `new` 대신 `create()` 팩토리 메서드를 사용하는 것은 절대적인 규칙이 아니라 코딩 스타일의 차이입니다 `constructor` 안에서 직접 검증하고 `new Name("홍길동")`으로 생성하는 방식도 충분히 유효합니다. 여기서 중요한 것은 팩토리냐 생성자냐가 아니라, **어떤 방식이든 검증을 우회할 수 없도록 만든다**는 원칙입니다.

```typescript
// Error
Name.create("")              // Error: 이름은 비어있을 수 없습니다
Name.create("a".repeat(51))  // Error: 이름은 50자를 초과할 수 없습니다

// OK
Name.create("  홍길동  ")      // Name { value: "홍길동" } — 자동 트리밍
```

`Name`을 받는 모든 곳에서는 "비어 있지 않고, 50자 이하이며, 트리밍된 값"이라는 사실이 보장됩니다.

### RewardPoints

```typescript
class RewardPoints {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number): RewardPoints {
    if (!Number.isInteger(value))
      throw new Error("포인트는 정수여야 합니다")
    if (value < 0)
      throw new Error("포인트는 0 이상이어야 합니다")
    return new RewardPoints(value)
  }

  add(other: RewardPoints): RewardPoints {
    return RewardPoints.create(this.value + other.value)
  }
}
```

```typescript
const earnedPoints = RewardPoints.create(1000)
const bonusPoints = RewardPoints.create(300)
const totalPoints = earnedPoints.add(bonusPoints)  // RewardPoints { value: 1300 }
```

음수 포인트나 소수 포인트는 생성 자체가 불가능합니다. 포인트를 더하는 규칙도 `add()` 안에 들어 있습니다. 이제 `points`는 단순한 숫자가 아니라, 규칙을 품은 `RewardPoints`가 됩니다. **값 자체가 규칙을 알고 있습니다.**

### Email

```typescript
class Email {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase()
    if (!Email.isValid(normalized))
      throw new Error("유효하지 않은 이메일 형식입니다")
    return new Email(normalized)
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
```

```typescript
const email = Email.create("  User@Example.COM  ")
// Email { value: "user@example.com" } — 자동 정규화
```

잘못된 형식은 생성 자체가 불가능합니다. 공백과 대소문자도 생성 시점에 정규화됩니다. 여기서는 "이메일은 대소문자를 구분하지 않고 저장한다"는 제품 정책을 가정했습니다. 실제 시스템에서는 정규화 범위를 팀 정책으로 명확히 정하면 됩니다.

### 객체 위주 사고방식의 공통 원칙

세 경우 모두 같은 원칙을 따릅니다. **객체가 생성 시점에 규칙을 강제하고, 한 번 생성된 값은 그 규칙을 만족합니다.** 그래서 객체를 사용하는 쪽의 중복 검증을 크게 줄일 수 있습니다. DDD에서는 이처럼 도메인에서 의미 있는 값을 **Value Object** 라는 객체로 모델링합니다.

### 객체는 데이터만이 아니라 행동도 품는다

객체의 장점은 유효성 검증만이 아닙니다. **객체는 자기 데이터를 다루는 행동(method)도 함께 품습니다.** 
데이터 위주 사고방식에서 포인트를 더하려면 보통 이렇게 합니다.

```typescript
// Service 어딘가에서...
if (!Number.isInteger(earnedPoints) || !Number.isInteger(bonusPoints))
  throw new Error("포인트는 정수여야 합니다")
const totalPoints = earnedPoints + bonusPoints
```

포인트를 더하는 로직이 Service에 있습니다. `earnedPoints`와 `bonusPoints`는 그냥 데이터이고, 어떻게 더해야 하는지는 외부가 알고 있습니다. 데이터는 수동적이고, 로직은 객체 밖에 있습니다. 문제는 값을 바꾸는 주체가 항상 외부가 된다는 점입니다. 이 값을 사용하는 곳이 많아질수록 더하는 규칙, 검증 규칙, 예외 처리가 여러 Service와 함수에 흩어지기 쉽습니다. 그러면 어떤 곳은 정수 검사를 하고, 어떤 곳은 빠뜨리고, 어떤 곳은 다른 방식으로 더하는 식으로 규칙이 조용히 어긋날 수 있습니다.

객체 위주 사고방식에서는 포인트가 스스로 더하는 법을 알고 있습니다.

```typescript
const totalPoints = earnedPoints.add(bonusPoints)
```

정수 검증도, 새 `RewardPoints` 생성도 `add()` 메서드 안에서 일어납니다. **"나에게 다른 포인트를 더해달라"고 요청하면 객체가 스스로 규칙을 지키며 처리합니다.** Service가 매번 정수 여부를 검사할 필요가 없습니다.

이 차이는 수정이 필요할 때 더 크게 드러납니다. 예를 들어 `RewardPoints`를 생성하고 `add()`를 호출하는 Service가 10곳 있다고 해도, 포인트 연산 규칙이 바뀌면 수정해야 할 곳은 그 10곳이 아니라 `RewardPoints` 객체 한 곳입니다. 반대로 데이터 위주 구조에서는 각 Service가 연산과 검증을 직접 알고 있기 때문에, 같은 변경이 여러 곳의 수정으로 번지기 쉽습니다. 객체가 자기 규칙을 품고 있을수록, 변경의 영향 범위는 더 작고 분명해집니다.

이것이 객체 지향의 핵심입니다. 데이터와 그 데이터를 다루는 행동이 하나의 객체 안에 함께 있습니다. 객체는 단순한 데이터 그릇이 아니라, **자기 규칙을 알고, 자기 행동을 수행하는 주체**입니다.

## 두 가지 사고방식

지금까지 본 Name, Email, RewardPoints의 차이를 관통하는 질문이 하나 있습니다.
**"값이 자기 자신의 규칙을 알고 있는가? 그리고 자기 행동을 스스로 수행하는가?"**

데이터 위주 사고방식에서 값은 그냥 데이터입니다. `string`이고 `number`입니다. 규칙은 그 값을 사용하는 Service나 Controller가 알고 있고, 행동도 Service에 있습니다. 값은 수동적인 데이터 그릇에 가깝습니다.

객체 위주 사고방식에서는 값이 곧 규칙이고, 행동의 주체입니다. `RewardPoints`는 음수나 소수가 될 수 없을 뿐 아니라 스스로 `add()`하는 법을 알고 있습니다. `Email`은 잘못된 형식이 될 수 없을 뿐 아니라 생성 시점에 스스로 정규화합니다. 규칙과 행동을 객체가 품고 있으니, Service는 도메인 로직의 세부사항보다 흐름 조율에 집중할 수 있습니다.

| | 데이터 위주 사고방식 | 객체 위주 사고방식 |
|---|---|---|
| 값의 역할 | 데이터 그릇 (`string`, `number`) | 규칙과 행동을 품은 객체 (`Name`, `Email`, `RewardPoints`) |
| 설계 출발점 | DB 스키마, API 응답 형태 | 비즈니스 규칙, 도메인 의미 |
| 유효성 검증 | 사용하는 곳마다 중복 | 생성 시점에 한 번 (`create()` 또는 `constructor` 생성자) |
| 비즈니스 로직 | Service에 흩어짐 | 객체의 메서드로 응집 (`add()`, `create()`) |
| 객체의 태도 | 수동적 — 외부가 조작 | 주체적 — 스스로 규칙을 지키고 행동 |
| 테스트 | 인프라와 섞이면 mock이 늘어나기 쉬움 | 순수 객체 중심으로 빠르게 검증 가능 |

이 표가 이번 글의 핵심입니다.

Ch.1에서 "프레임워크 중심 개발이 데이터 중심 프로그래밍으로 이어진다"고 이야기했습니다. 데이터 위주 사고방식이 바로 그것입니다. 프레임워크가 제공하는 구조(Controller → Service → Repository)에 맞추다 보면 값은 그냥 데이터가 되고, 규칙은 Service에 흩어집니다.

반면 객체 위주 사고방식은 값 자체에 의미와 규칙을 부여합니다. 이것이 DDD에서 말하는 **도메인 모델링**의 출발점입니다. Value Object, Entity, Aggregate 같은 Building Block들은 모두 "객체가 자기 자신의 규칙을 알고 있다"는 원칙 위에 세워져 있습니다.

## 다음 글에서는

이번 글에서 확인한 것은 **사고방식의 차이**입니다. 같은 요구사항이라도 데이터 그릇으로 다루느냐, 규칙과 행동을 품은 객체로 다루느냐에 따라 코드의 구조는 완전히 달라집니다. 다만 여기서 사용한 Customer 예제는 Value Object와 객체 위주 모델링의 차이를 빠르게 보여주기 위한 도입 예제입니다. SDD, TDD, DDD의 전체 흐름을 소개하는 단계에서는 이 정도 단순함이 오히려 도움이 됩니다.

이제 남은 질문은 이것입니다. 이 객체 위주 사고방식을 실제 설계와 구현으로 어떻게 이어 갈 것인가?

다음 글(Ch.3)에서는 DDD의 기본 개념을 먼저 정리합니다. 그리고 Ch.4에서 나머지 핵심 Building Block과 협력 구조를 이어서 정리한 뒤, Ch.5에서 요구사항을 PRD로 정리하고, Ch.6에서 DDD 관점으로 분해하고, Ch.7에서 Spec을 정의하고, Ch.8에서 TDD로 구현하는 흐름으로 들어갑니다.
