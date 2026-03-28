# SDD+TDD+DDD 블로그 시리즈 가이드

이 문서는 시리즈 작업의 시작점이다. 진행 현황을 확인하고, 다음에 무엇을 써야 하는지 찾는다.

## 진행 현황

### Part 1 — SDD+TDD+DDD 입문
- [x] Ch.1 왜 프레임워크에서 도메인으로 가야 하는가
- [x] Ch.2 같은 요구사항, 다른 코드
- [x] Ch.3 DDD란 무엇인가
- [x] Ch.4 요구사항에서 도메인 객체 뽑아내기
- [x] Ch.5 AI와 함께 Spec 정의하기
- [ ] Ch.6 Spec을 TDD로 구현하기

### Part 2 — DDD Building Blocks 상세
- [ ] Ch.7 새 도메인 설계 — 전략적 설계에서 Building Block으로
- [ ] Ch.8 Value Object
- [ ] Ch.9 Entity
- [ ] Ch.10 Aggregate
- [ ] Ch.11 Domain Service
- [ ] Ch.12 Repository
- [ ] Ch.13 Application Service

### Part 3 — DDD 응용 및 고급 주제
- [ ] Ch.14 나의 DDD 적용 실패기
- [ ] Ch.15 프론트엔드에서 DDD 활용법
- [ ] Ch.16 Hexagonal Architecture
- [ ] Ch.17 Event Sourcing 및 CQRS
- [ ] Ch.18 Functional Programming과 DDD
- [ ] Ch.19 AI 시대의 DDD 운영법

## 다음 작업

**현재: Ch.6 작성**

- Ch.5에서 정의한 Name / Email / RewardPoints Spec을 TDD로 구현한다
- Red → Green → Refactor 사이클을 Name부터 처음부터 끝까지 보여준다
- Part 1의 마무리 챕터

**그다음: Ch.7 작성**

- 새 도메인(Watchable)을 소개하고 전략적 설계로 Building Block을 분해한다
- Bounded Context, Ubiquitous Language를 실전 맥락에서 설명한다

## 파일 컨벤션

```
src/content/posts/xdd-ch{번호}-{slug}.md     # 블로그 글
docs/specs/{building-block}/{name}.md         # Spec 문서
src/domain/{building-block}/{name}.ts         # 도메인 구현
tests/domain/{building-block}/{name}.test.ts  # 테스트
```

---

## 목차 상세

### Part 1 — SDD+TDD+DDD 입문

Customer 예제로 왜 도메인 중심인가, DDD 기본 어휘, SDD와 TDD를 체험한다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.1 | 왜 프레임워크에서 도메인으로 가야 하는가 | 시리즈 소개, 전체 로드맵 |
| Ch.2 | 같은 요구사항, 다른 코드 | 데이터 vs 객체 비교 |
| Ch.3 | DDD란 무엇인가 | DDD 기본 어휘 정리 |
| Ch.4 | 요구사항에서 도메인 객체 뽑아내기 | 설계 단계 |
| Ch.5 | AI와 함께 Spec 정의하기 | SDD 실전 |
| Ch.6 | Spec을 TDD로 구현하기 | TDD 실전, Customer 예제 마무리 |

### Part 2 — DDD Building Blocks 상세

본편 도메인(Watchable)으로 전환해, 전략적 설계로 도메인을 분해한 뒤 각 Building Block을 한 챕터에서 개념 + SDD + TDD로 완결한다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.7 | 새 도메인 설계 — 전략적 설계에서 Building Block으로 | Watchable 도메인 소개, Bounded Context, Ubiquitous Language, Building Block 분해 |
| Ch.8 | Value Object | 개념 심화 + SDD + TDD |
| Ch.9 | Entity | 식별자, 생명주기, 상태 전이 |
| Ch.10 | Aggregate | 일관성 경계, Aggregate Root |
| Ch.11 | Domain Service | 여러 객체에 걸친 규칙 |
| Ch.12 | Repository | DIP, 인터페이스 vs 구현 분리 |
| Ch.13 | Application Service | 유스케이스 조율, 전체 흐름 정리 |

### Part 3 — DDD 응용 및 고급 주제

주제별 독립 에세이 형태로, 순서에 크게 구애받지 않는다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.14 | 나의 DDD 적용 실패기 | 실패 경험과 교훈 |
| Ch.15 | 프론트엔드에서 DDD 활용법 | React/Next.js 환경 |
| Ch.16 | Hexagonal Architecture | Ports & Adapters, 도메인과 인프라 분리 |
| Ch.17 | Event Sourcing 및 CQRS | 이벤트 기반 아키텍처 |
| Ch.18 | Functional Programming과 DDD | FP 관점의 도메인 모델링 |
| Ch.19 | AI 시대의 DDD 운영법 | Spec sync, 테스트, 협업 운영 |

---

## 운영 메모

### 공통 작성 원칙

- Part 1은 문제의식과 개념 설명에 집중한다 (도입용 Customer 예제)
- Part 2는 Building Block별 한 챕터 안에서 `개념 → SDD → TDD` 리듬을 유지한다
- Part 3는 주제별 독립 에세이 형태로, 순서에 크게 구애받지 않는다
- Spec과 Code는 항상 함께 갱신한다
- Ch.1만 전체 로드맵을 길게 보여주고, 이후 챕터는 다음 글 연결만 둔다

### Building Block 챕터의 내부 구조 (Part 2)

Part 2의 각 챕터는 한 챕터 안에서 아래 흐름을 완결한다.

1. **개념**: 이 Building Block이 왜 필요한가
2. **설계**: 본편 도메인에서 어떤 객체가 이 Block에 해당하는가
3. **SDD**: AI와 함께 Spec을 정리한다
4. **TDD**: Spec을 테스트로 옮기고 구현한다
5. **연결**: 다음 Block이나 유스케이스와 어떻게 이어지는가

### 도메인 예제

- Part 1 (Ch.1~6): `Customer / Name / Email / RewardPoints` — 도입용 예제
- Part 2 (Ch.7~13): `Watchable` (콘텐츠 북마크 & 소비 추적) — 본편 도메인
- Ch.7 도입부에서 "도입 예제 → 본편 예제" 전환을 명시한다

### 본편 실전 예제: Watchable

상세 내용은 [`docs/watchable-PRD.md`](./watchable-PRD.md) 참조.

숏폼 영상 대신 좋은 콘텐츠를 의도적으로 소비하는 습관을 만드는 개인용 도구다. 핵심 축은 북마크 & 상태 전이, 소비 통계, 추천의 세 가지다.

---

## 아이디어 메모

### 나의 DDD 적용 실패기

생각날 때마다 계속 추가하는 메모.

- 도메인 모델을 기본형 위주로만 만들다 보니 DB 모델과 도메인 모델이 거의 같은 모양이 되었고, 그래서 "굳이 DDD를 왜 하지?"라는 의문이 생겼다.
- `Name`, `Email`, `RewardPoints` 같은 Value Object를 도입하지 않으면 도메인 모델이 DB 스키마의 복사본처럼 보이기 쉽고, 그 결과 도메인 모델만의 의미와 장점을 체감하기 어려웠다.
- 도메인 모델과 DB 모델 사이에 Mapper가 왜 필요한지, 그리고 어느 시점에 이 변환을 도입해야 하는지 몰라서 자주 막혔다.
- 처음부터 persistence 구조를 먼저 떠올리다 보니, 도메인 모델을 만들다가도 다시 DB 테이블 설계 쪽으로 사고가 끌려갔다.
- 결국 DDD를 적용하려고 해도 항상 DB 모델이 중심에 남아 있어서 실패했다. 도메인을 먼저 설계하고, 그다음에 저장 구조를 맞추는 흐름을 잘 못 잡았다.
- "도메인 모델은 규칙과 행위를 가진 주체적인 객체이고, DB 모델은 저장을 위한 데이터 구조"라는 분리가 머리로는 이해되는데 실제 구현에서는 자꾸 섞였다.
- Repository, Mapper, ORM Entity, Domain Entity의 역할 경계가 흐려지면 도메인 계층이 다시 인프라 계층에 끌려 내려오는 경험을 했다.
