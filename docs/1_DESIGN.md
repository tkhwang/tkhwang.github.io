# SDD+TDD+DDD 블로그 시리즈 가이드

이 문서는 시리즈 작업의 시작점이다. 진행 현황을 확인하고, 다음에 무엇을 써야 하는지 찾는다.

## 진행 현황

### Part 1 — SDD+TDD+DDD 입문
- [x] Ch.1 왜 프레임워크에서 도메인으로 가야 하는가
- [x] Ch.2 같은 요구사항, 다른 코드
- [x] Ch.3 DDD란 무엇인가 (1)
- [x] Ch.4 DDD란 무엇인가 (2)
- [x] Ch.5 요구사항에서 PRD 정의하기
- [x] Ch.6 PRD에서 도메인 객체 뽑아내기
- [x] Ch.7 AI와 함께 Spec 정의하기
- [x] Ch.8 Spec에서 테스트 케이스 뽑기

### Part 2 — DDD Building Blocks 상세
- [ ] Ch.9 Value Object
- [ ] Ch.10 Entity
- [ ] Ch.11 Aggregate
- [ ] Ch.12 Domain Service
- [ ] Ch.13 Repository
- [ ] Ch.14 Application Service
- [ ] Ch.15 Mapper와 Domain Event

### Part 3 — DDD 응용 및 고급 주제
- [ ] Ch.16 나의 DDD 적용 실패기
- [ ] Ch.17 프론트엔드에서 DDD 활용법
- [ ] Ch.18 Hexagonal Architecture
- [ ] Ch.19 Event Sourcing 및 CQRS
- [ ] Ch.20 Functional Programming과 DDD
- [ ] Ch.21 AI 시대의 DDD 운영법

## 다음 작업

**현재: Ch.9 작성**

- Part 2의 첫 챕터로 Value Object를 본격적으로 다룬다
- `Tag` 또는 `ContentUrl`를 예시로 골라 `개념 → Spec → 테스트 → 구현` 흐름을 한 챕터 안에서 보여준다
- Red → Green → Refactor 사이클을 실제 코드로 처음부터 끝까지 시연한다

**그다음: Ch.10 작성**

- `Content`를 중심으로 Entity의 식별자, 생명주기, 상태 전이를 설명한다
- Value Object에서 Entity, Aggregate로 점진적으로 복잡도를 확장한다

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

작은 도입 예제로 왜 도메인 중심인가를 설명하고, Ch.3과 Ch.4에서 DDD 이론을 두 단계로 정리한 뒤, Ch.5부터는 콘텐츠 북마크와 소비 추적 도메인으로 들어가 SDD와 TDD를 체험한다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.1 | 왜 프레임워크에서 도메인으로 가야 하는가 | 시리즈 소개, 전체 로드맵 |
| Ch.2 | 같은 요구사항, 다른 코드 | 데이터 vs 객체 비교 |
| Ch.3 | DDD란 무엇인가 (1) | 전략적 설계와 핵심 객체 |
| Ch.4 | DDD란 무엇인가 (2) | 저장과 협력 구조 |
| Ch.5 | 요구사항에서 PRD 정의하기 | 본편 도메인 소개, PRD 작성 |
| Ch.6 | PRD에서 도메인 객체 뽑아내기 | DDD top-down 설계 (BC → Aggregate → Entity → VO) |
| Ch.7 | AI와 함께 Spec 정의하기 | 콘텐츠 도메인 Value Object SDD |
| Ch.8 | Spec에서 테스트 케이스 뽑기 | Spec을 테스트 목록으로 옮기는 TDD의 첫 단계 |

### Part 2 — DDD Building Blocks 상세

Ch.6에서 잡은 본편 도메인을 기준으로, 각 Building Block을 더 깊게 설명하고 개념 + SDD + TDD 흐름을 확장한다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.9 | Value Object | 개념 심화 + `Tag`/`ContentUrl` 예제로 테스트 코드 작성 + Red → Green → Refactor |
| Ch.10 | Entity | 식별자, 생명주기, 상태 전이 |
| Ch.11 | Aggregate | 일관성 경계, Aggregate Root |
| Ch.12 | Domain Service | 여러 객체에 걸친 규칙 |
| Ch.13 | Repository | DIP, 인터페이스 vs 구현 분리 |
| Ch.14 | Application Service | 유스케이스 조율 |
| Ch.15 | Mapper와 Domain Event | 모델 변환과 Aggregate 간 연결 |

### Part 3 — DDD 응용 및 고급 주제

주제별 독립 에세이 형태로, 순서에 크게 구애받지 않는다.

| 챕터 | 제목 | 비고 |
|---|---|---|
| Ch.16 | 나의 DDD 적용 실패기 | 실패 경험과 교훈 |
| Ch.17 | 프론트엔드에서 DDD 활용법 | React/Next.js 환경 |
| Ch.18 | Hexagonal Architecture | Ports & Adapters, 도메인과 인프라 분리 |
| Ch.19 | Event Sourcing 및 CQRS | 이벤트 기반 아키텍처 |
| Ch.20 | Functional Programming과 DDD | FP 관점의 도메인 모델링 |
| Ch.21 | AI 시대의 DDD 운영법 | Spec sync, 테스트, 협업 운영 |

---

## 운영 메모

### 공통 작성 원칙

- Part 1은 문제의식과 개념 설명으로 시작하고, Ch.3과 Ch.4에서 DDD 이론을 두 편에 나누어 정리한 뒤 Ch.5부터 본편 도메인으로 전환한다
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

- Ch.1~4: `Customer / RewardPoints` 같은 작은 도입 예제로 문제의식과 DDD 기본 개념을 설명한다
- Ch.5~15: `Watchable` (콘텐츠 북마크 & 소비 추적) 도메인을 본편 예제로 사용한다
- Ch.5에서 "도입 예제 -> 본편 도메인" 전환을 명시한다

### 본편 실전 예제: Watchable

본편 요구사항은 [`docs/0_PRD.md`](./0_PRD.md)를 기준으로 한다. 시리즈 진행 현황과 다음 작업은 이 문서에서 함께 관리한다.

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
