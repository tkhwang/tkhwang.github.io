# Ch.2 "Before/After — 코드로 증명하기" 구현 계획

> **에이전트 작업자 참고:** 필수 하위 스킬: superpowers:subagent-driven-development (권장) 또는 superpowers:executing-plans를 사용하여 태스크별로 구현합니다. 각 단계는 체크박스(`- [ ]`)로 추적합니다.

**목표:** Ch.2 블로그 포스트 "Before/After — 코드로 증명하기" 작성 — 동일한 비즈니스 요구사항(주문 관리)을 데이터 중심 vs 도메인 중심 의사코드로 비교하여 Ch.1의 테제를 코드로 증명.

**구조:** 기존 블로그 규칙을 따르는 Astro 마크다운 포스트 1개. 한국어 기본, 기술 용어만 영문. 의사코드(TypeScript 문법 기반, 실행 불필요). 서사 + 코드 균형.

**기술 스택:** Astro 블로그 (마크다운 포스트)

**설계 문서:** `docs/superpowers/specs/2026-03-25-xdd-ch02-design.md`

**참고 파일:** `src/content/posts/xdd-ch01-framework-to-domain.md` (Ch.1 톤, frontmatter 형식 참조)

---

## 파일 구조

| 작업 | 경로 | 역할 |
|------|------|------|
| 생성 | `src/content/posts/xdd-ch02-before-after.md` | Ch.2 블로그 포스트 본문 |

다른 파일 수정 불필요 — 기존 콘텐츠 스키마(`src/content/config.ts`)와 레이아웃이 이 포스트를 그대로 지원합니다.

---

### 태스크 1: 포스트 파일 생성 (frontmatter + 도입부 + 요구사항 정의)

**파일:**
- 생성: `src/content/posts/xdd-ch02-before-after.md`

- [ ] **단계 1: frontmatter, 도입부, 요구사항 정의(1막)를 갖춘 포스트 파일 생성**

frontmatter는 Ch.1과 동일한 형식을 따릅니다:

```yaml
---
title: "[SDD+TDD+DDD] Ch.2: Before/After — 코드로 증명하기"
pubDate: 2026-03-25
description: "동일한 요구사항을 데이터 중심 vs 도메인 중심으로 구현해서, 코드로 직접 증명합니다"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "sdd"]
---
```

도입부 내용:
- 시리즈 두 번째 글임을 밝힘 (Ch.1 링크 포함)
- Ch.1에서 "왜"를 서사로 풀었다면, 이 글에서는 "어떻게 다른가"를 코드로 보여준다는 선언
- "같은 요구사항, 다른 구조. 코드가 증명합니다."

요구사항 정의 섹션 (`## 요구사항: 주문 관리`):
- 주문 상태 전이: `생성됨 → 결제완료 → 배송중 → 배송완료`
- 환불 규칙 3가지 (결제완료만 가능, 배송중 이후 불가, VIP 배송완료 후 7일 이내 가능)
- 주문 금액 계산: 상품 금액 + 배송비 (VIP 배송비 무료)
- "이 요구사항을 구현하는 두 가지 방법을 비교해 보겠습니다."

톤: Ch.1의 공감 서사를 이어가되, 코드와 균형. 독자 참여형("어디서 많이 보셨죠?").

- [ ] **단계 2: 빌드 성공 확인**

실행: `pnpm build`
기대 결과: 빌드 성공, 새 포스트가 출력에 포함됨

- [ ] **단계 3: 커밋**

```bash
git add src/content/posts/xdd-ch02-before-after.md
git commit -m "feat(ch02): 포스트 뼈대 + 요구사항 정의"
```

---

### 태스크 2: 2막 작성 — Before: 데이터 중심 구현

이 섹션의 목표: 데이터 중심(MVC) 구현의 문제점을 의사코드로 구체적으로 드러냄. 독자가 "아, 내 코드가 이랬구나" 공감.

**분량 목표**: 전체의 약 30%

**파일:**
- 수정: `src/content/posts/xdd-ch02-before-after.md`

- [ ] **단계 1: 섹션 제목 + 데이터 모델 작성**

```markdown
## Before: 데이터 중심으로 구현하면

### 데이터 모델 — 필드만 있는 객체
```

다음 내용을 서사 + 의사코드로 전개:
- Order interface/type: `id`, `status` (문자열), `customerId`, `items`, `isVip`, `createdAt` 등 필드만 나열
- 행위(behavior) 없음 — 데이터 그릇일 뿐
- 서사: "익숙한 모습이죠? 대부분의 프로젝트에서 Entity나 모델은 이렇게 데이터 필드만 나열합니다."

의사코드 형식:
```typescript
// Order는 필드만 가진 데이터 — 행위 없음
interface Order {
  id: string
  status: string          // "created" | "paid" | "shipping" | "delivered"
  customerId: string
  items: OrderItem[]
  isVip: boolean
  createdAt: Date
}
```

- [ ] **단계 2: 비즈니스 로직 — Service에 분산 작성**

```markdown
### 비즈니스 로직 — Service에 흩어진 규칙들
```

다음 내용을 전개:
- OrderService.refund(): 상태 확인 → VIP 여부 확인 → 날짜 계산이 절차적으로 if/else로 나열
- PaymentService.processRefund(): 여기에도 환불 가능 여부 체크 중복
- 서사: "환불 규칙이 OrderService에도, PaymentService에도 흩어져 있습니다. '환불 정책을 수정하려면 어디를 고쳐야 하지?' — 자신 있게 답할 수 없습니다."
- "비즈니스 규칙이 코드의 여러 곳에 중복·분산되어 있다는 것이 핵심 문제입니다."

- [ ] **단계 3: 테스트의 어려움 작성**

```markdown
### 테스트 — Mock이 절반인 테스트
```

다음 내용을 전개:
- DB mock, PaymentGateway mock 설정이 테스트 코드의 절반
- 정작 검증하고 싶은 비즈니스 규칙(VIP 환불 조건)은 mock 설정 사이에 묻혀있음
- 서사: "테스트 코드의 절반이 mock 설정입니다. 정작 검증하고 싶은 비즈니스 규칙은 어디 있나요?"

- [ ] **단계 4: 커밋**

```bash
git add src/content/posts/xdd-ch02-before-after.md
git commit -m "feat(ch02): 2막 - Before 데이터 중심 구현의 문제점"
```

---

### 태스크 3: 3막 작성 — After: 도메인 중심 구현

이 섹션의 목표: 동일한 요구사항을 DDD로 구현. Before와 1:1 대응하는 3단계로 개선점을 보여줌.

**분량 목표**: 전체의 약 30%

**파일:**
- 수정: `src/content/posts/xdd-ch02-before-after.md`

- [ ] **단계 1: 도메인 모델 — 행위를 가진 객체 작성**

```markdown
## After: 도메인 중심으로 구현하면

### 도메인 모델 — 행위를 가진 객체
```

다음 내용을 서사 + 의사코드로 전개:
- OrderStatus Value Object: 상태 전이 규칙(`canTransitionTo`)과 환불 가능 여부(`canRefund`)를 스스로 판단
- Order Entity: 데이터 + 행위를 함께 가짐. `order.refund()`로 환불 실행. 내부에서 `this.status.canRefund()` 호출.
- 서사: "Order가 스스로 환불 가능 여부를 판단합니다. 환불 정책을 수정하려면? Order와 OrderStatus만 보면 됩니다."

의사코드 형식 (Before와 대비되도록):
```typescript
class OrderStatus {
  canTransitionTo(next: OrderStatus): boolean { /* 전이 규칙 */ }
  canRefund(isVip: boolean, orderDate: Date): boolean { /* 환불 규칙 */ }
}

class Order {
  refund(): void {
    if (!this.status.canRefund(this.isVip, this.createdAt))
      throw new Error("환불 불가")
    this.status = OrderStatus.REFUNDED
  }
}
```

- [ ] **단계 2: 비즈니스 로직 — 도메인에 응집 작성**

```markdown
### 비즈니스 로직 — 얇아진 Service
```

다음 내용을 전개:
- Application Service는 오케스트레이션만 담당: repository 조회 → 도메인 메서드 호출 → 저장
- 비즈니스 규칙 코드 zero — 도메인 객체 안에 전부 있음
- Before의 OrderService와 대비: if/else 절차적 코드 vs 한 줄 `order.refund()`
- 서사: "Service가 얇아졌습니다. 비즈니스 로직이 여기저기 흩어지지 않고, 도메인 객체 안에 응집되어 있습니다."

- [ ] **단계 3: 테스트 — Mock 없이 바로 검증 작성**

```markdown
### 테스트 — Mock 없이 바로 검증
```

다음 내용을 전개:
- POJO라서 외부 의존성 zero — DB mock, HTTP mock 전혀 불필요
- 테스트 케이스 예시: VIP 환불 성공, 일반 고객 환불 불가, 배송중 환불 불가
- 테스트 코드가 곧 비즈니스 규칙의 문서
- 서사: "mock이 한 줄도 없습니다. 테스트 코드가 곧 비즈니스 규칙의 문서입니다. 이것이 TDD가 자연스러워지는 구조입니다."

의사코드 형식:
```typescript
test("VIP 고객은 배송완료 후 7일 이내 환불 가능", () => {
  const order = Order.create({ status: "delivered", isVip: true, ... })
  order.refund()  // 성공
})

test("일반 고객은 배송완료 후 환불 불가", () => {
  const order = Order.create({ status: "delivered", isVip: false, ... })
  expect(() => order.refund()).toThrow("환불 불가")
})
```

- [ ] **단계 4: 커밋**

```bash
git add src/content/posts/xdd-ch02-before-after.md
git commit -m "feat(ch02): 3막 - After 도메인 중심 구현"
```

---

### 태스크 4: 4막 작성 — 비교 정리 + SDD 워크플로우 미리보기 + 다음 단계

이 섹션의 목표: 핵심 차이를 표로 정리하고, SDD 워크플로우를 예고하며, Part 2로 연결.

**분량 목표**: 전체의 약 30% (비교 ~20% + 다음 단계 ~10%)

**파일:**
- 수정: `src/content/posts/xdd-ch02-before-after.md`

- [ ] **단계 1: 핵심 차이 요약표 작성**

```markdown
## 무엇이 달라졌는가
```

다음 비교표를 포함:

| 관점 | Before (데이터 중심) | After (도메인 중심) |
|------|---------------------|-------------------|
| 도메인 객체 | 필드만 있는 DTO | 행위를 가진 Entity + Value Object |
| 비즈니스 로직 위치 | Service에 분산 | 도메인 객체에 응집 |
| 수정 시 영향 범위 | "어디를 고쳐야 하지?" | 도메인 객체만 보면 됨 |
| 테스트 | Mock 필수, 설정이 김 | POJO라서 Mock 불필요 |
| 프레임워크 의존성 | 강결합 | 독립 (Framework Agnostic) |

서사로 표의 핵심 포인트를 짧게 해설.

- [ ] **단계 2: SDD 워크플로우 미리보기 작성**

```markdown
## 이 코드는 어떻게 만들어지는가 — SDD 워크플로우 미리보기
```

After 코드가 어떻게 만들어지는지 역순으로 추적:
1. **Spec 정의** (AI와 함께): "VIP 고객은 배송완료 후 7일 이내 환불 가능"
2. **TDD 테스트 작성**: Spec의 각 항목이 곧 테스트 케이스 — 위 After 테스트 코드가 바로 그것
3. **도메인 구현**: 테스트를 통과하도록 OrderStatus, Order 구현

"Spec → Test → Implementation. 이것이 이 시리즈에서 Part 2 전체에 걸쳐 반복할 사이클입니다."

- [ ] **단계 3: 시리즈 다음 단계 작성**

```markdown
## 다음 글에서는
```

- "다음 글(Ch.3)부터는 이 사이클을 태스크/프로젝트 관리 도메인에 본격 적용합니다."
- "첫 번째 Building Block인 Value Object부터 시작합니다. TaskTitle, Priority, TaskStatus — 의미 있는 값을 만드는 것부터."
- 시리즈 로드맵 간략 리마인드 (Part 2~4 한 줄씩)

- [ ] **단계 4: 커밋**

```bash
git add src/content/posts/xdd-ch02-before-after.md
git commit -m "feat(ch02): 4막 - 비교 정리 + SDD 워크플로우 미리보기"
```

---

### 태스크 5: 전체 검토 + 빌드 확인

**파일:**
- 수정: `src/content/posts/xdd-ch02-before-after.md`

- [ ] **단계 1: 전체 포스트 흐름 검토**

전체 포스트를 처음부터 끝까지 읽으며 확인:
- 서사 흐름이 자연스러운가 (요구사항 → Before 문제 → After 해결 → 비교 → 다음)
- Before/After 의사코드가 1:1 대응되는가 (데이터 모델, 비즈니스 로직, 테스트)
- 한국어/영어 혼용이 자연스러운가 (기술 용어만 영문)
- Ch.1과 톤이 일관되는가
- 불필요하게 긴 부분 축약, 빠진 논점 보완

- [ ] **단계 2: 프로덕션 빌드 확인**

실행: `pnpm build`
기대 결과: 에러 없이 빌드 성공

- [ ] **단계 3: 최종 커밋**

```bash
git add src/content/posts/xdd-ch02-before-after.md
git commit -m "docs(ch02): 전체 검토 및 마무리"
```

---

### 후속 작업 (Ch.2 완성 후)

- 부모 시리즈 spec에 Ch.2 완료 표시 (✅) 반영
- Ch.3 brainstorm/plan 작성 진행
