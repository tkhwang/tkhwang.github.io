# SDD+TDD+DDD 블로그 시리즈 진행 현황

이 문서는 블로그 시리즈의 전체 흐름과 현재 진행 상태를 한눈에 확인하기 위한 운영 문서다.
출간용 글의 초안/교정 상태를 체크하고, 다음에 무엇을 써야 하는지 놓치지 않기 위해 사용한다.

## 시리즈의 큰 흐름

- **Part 1 — SDD+TDD+DDD 입문** (Ch.1~6): 왜 도메인 중심인가, DDD 기본 어휘, 객체 위주 설계, SDD와 TDD를 Customer 예제로 체험한다.
- **Part 2 — DDD Building Blocks 상세** (Ch.7~12): 본편 도메인(Watchable)으로 전환해, 각 Building Block을 한 챕터에서 개념 + SDD + TDD로 완결한다.
- **Part 3 — DDD 응용 및 고급 주제** (Ch.13~): 프레임워크 연동, 프론트엔드 DDD, Event Sourcing/CQRS, FP와 DDD 등 심화 주제를 다룬다.

## 공통 작성 원칙

- Part 1은 문제의식과 개념 설명에 집중한다 (도입용 Customer 예제)
- Part 2는 Building Block별 한 챕터 안에서 `개념 → SDD → TDD` 리듬을 유지한다
- Part 3는 주제별 독립 에세이 형태로, 순서에 크게 구애받지 않는다
- Spec과 Code는 항상 함께 갱신한다
- Ch.1만 전체 로드맵을 길게 보여주고, 이후 챕터는 다음 글 연결만 둔다

## 진행 상태 키

- `done`: 초안 및 주요 교정 완료
- `next`: 바로 다음에 작성할 챕터
- `planned`: 아직 작성 전

## 현재 진행 현황

### Part 1 — SDD+TDD+DDD 입문

| 챕터 | 제목 | 상태 | 파일 | 비고 |
|---|---|---|---|---|
| Ch.1 | 왜 프레임워크에서 도메인으로 가야 하는가 | `done` | `xdd-ch01-framework-to-domain.md` | 시리즈 소개, 전체 로드맵 |
| Ch.2 | 같은 요구사항, 다른 코드 | `done` | `xdd-ch02-same-requirements-different-code.md` | 데이터 vs 객체 비교 |
| Ch.3 | DDD란 무엇인가 | `done` | `xdd-ch03-what-is-ddd.md` | DDD 기본 어휘 정리 |
| Ch.4 | 요구사항에서 도메인 객체 뽑아내기 | `done` | `xdd-ch04-requirements-to-objects.md` | 설계 단계 |
| Ch.5 | AI와 함께 Spec 정의하기 | `done` | `xdd-ch05-sdd-spec.md` | SDD 실전 |
| Ch.6 | Spec을 TDD로 구현하기 | `next` | - | TDD 실전, Customer 예제 마무리 |

### Part 2 — DDD Building Blocks 상세

| 챕터 | 제목 | 상태 | 비고 |
|---|---|---|---|
| Ch.7 | 새 도메인 설계 — 전략적 설계에서 Building Block으로 | `planned` | Watchable 도메인 소개, Bounded Context, Ubiquitous Language, Building Block 분해 |
| Ch.8 | Value Object | `planned` | 개념 심화 + SDD + TDD |
| Ch.9 | Entity | `planned` | 식별자, 생명주기, 상태 전이 |
| Ch.10 | Aggregate | `planned` | 일관성 경계, Aggregate Root |
| Ch.11 | Domain Service | `planned` | 여러 객체에 걸친 규칙 |
| Ch.12 | Repository | `planned` | DIP, 인터페이스 vs 구현 분리 |
| Ch.13 | Application Service | `planned` | 유스케이스 조율, 전체 흐름 정리 |

### Part 3 — DDD 응용 및 고급 주제

| 챕터 | 제목 | 상태 | 비고 |
|---|---|---|---|
| Ch.14 | 나의 DDD 적용 실패기 | `planned` | 실패 경험과 교훈 |
| Ch.15 | 프론트엔드에서 DDD 활용법 | `planned` | React/Next.js 환경 |
| Ch.16 | Hexagonal Architecture | `planned` | Ports & Adapters, 도메인과 인프라 분리 |
| Ch.17 | Event Sourcing 및 CQRS | `planned` | 이벤트 기반 아키텍처 |
| Ch.18 | Functional Programming과 DDD | `planned` | FP 관점의 도메인 모델링 |
| Ch.19 | AI 시대의 DDD 운영법 | `planned` | Spec sync, 테스트, 협업 운영 |

## Building Block 챕터의 내부 구조 (Part 2)

Part 2의 각 챕터는 한 챕터 안에서 아래 흐름을 완결한다.

1. **개념**: 이 Building Block이 왜 필요한가
2. **설계**: 본편 도메인에서 어떤 객체가 이 Block에 해당하는가
3. **SDD**: AI와 함께 Spec을 정리한다
4. **TDD**: Spec을 테스트로 옮기고 구현한다
5. **연결**: 다음 Block이나 유스케이스와 어떻게 이어지는가

## 도메인 예제 운영 메모

- Part 1 (Ch.1~6): `Customer / Name / Email / RewardPoints` — 도입용 예제
- Part 2 (Ch.7~12): `Watchable` (콘텐츠 북마크 & 소비 추적) — 본편 도메인
- Ch.7 도입부에서 "도입 예제 → 본편 예제" 전환을 명시한다

## 본편 실전 예제: Watchable (콘텐츠 북마크 & 소비 추적)

상세 내용은 [`docs/watchable-PRD.md`](./watchable-PRD.md) 참조.

숏폼 영상 대신 좋은 콘텐츠를 의도적으로 소비하는 습관을 만드는 개인용 도구다. 핵심 축은 북마크 & 상태 전이, 소비 통계, 추천의 세 가지다.

## 다음 작업

### 1. Ch.6 작성

- Customer 예제로 Value Object TDD를 시연한다
- Red → Green → Refactor 사이클을 Name부터 처음부터 끝까지 보여준다
- Part 1의 마무리 챕터

### 2. Ch.7 작성 준비

- 새 도메인(Watchable)으로 전환
- Value Object를 본편 도메인에서 다시 다루되, 개념 심화 + SDD + TDD를 한 챕터에 완결

### 3. 시리즈 톤 유지

- Part 1: 문제의식 → 개념 → 첫 체험 (도입용 예제)
- Part 2: Building Block별 완결형 챕터 (본편 도메인)
- Part 3: 주제별 독립 에세이 (응용/고급)

## 체크리스트

- [x] Ch.1~5 파일 구조 정리
- [x] Ch.1에만 전체 로드맵 유지
- [x] Ch.2~5는 다음 글 연결 중심으로 마무리
- [x] DDD 용어 기본 통일
- [x] Ch.2와 Ch.3 사이에 도입 예제라는 설명 추가
- [x] 본편 도메인 확정 (콘텐츠 북마크 & 소비 추적)
- [x] 3-Part 구조로 목차 재구성
- [ ] Ch.6 초안 작성
- [ ] Ch.7~12 세부 제목 확정
- [ ] Part 3 주제 목록 최종 확정
- [ ] 시리즈 전체 제목/메타 설명 최종 교정
