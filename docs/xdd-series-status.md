# SDD+TDD+DDD 블로그 시리즈 진행 현황

이 문서는 블로그 시리즈의 전체 흐름과 현재 진행 상태를 한눈에 확인하기 위한 운영 문서다.
출간용 글의 초안/교정 상태를 체크하고, 다음에 무엇을 써야 하는지 놓치지 않기 위해 사용한다.

## 시리즈의 큰 흐름

1. 소개: 왜 AI 시대에 SDD + TDD + DDD를 다시 이야기하는가
2. DDD 입문: 객체 위주 설계와 DDD 기본 어휘를 이해한다
3. Building Block 실전: 각 Building Block을 `개념 설명 -> SDD -> TDD` 순서로 다룬다
4. 연결과 운영: Application Service, 프레임워크 연동, 프론트엔드 적용, AI 시대 운영법으로 확장한다

## 공통 작성 원칙

- 앞부분은 문제의식과 개념 설명에 집중한다
- 이후 Building Block 파트는 같은 리듬을 유지한다
- 각 Block은 가능하면 `개념 -> Spec -> Test/Implementation` 순서로 전개한다
- Spec과 Code는 항상 함께 갱신한다
- Ch.1만 전체 로드맵을 길게 보여주고, 이후 챕터는 다음 글 연결만 둔다
- 초반 `Customer` 예제는 도입용이다
- DDD를 깊게 설명하는 본편부터는 더 복잡한 도메인 예제로 전환한다

## 진행 상태 키

- `done`: 초안 및 주요 교정 완료
- `next`: 바로 다음에 작성할 챕터
- `planned`: 아직 작성 전

## 현재 진행 현황

| 챕터 | 제목 | 상태 | 파일 | 비고 |
|---|---|---|---|---|
| Ch.1 | 왜 프레임워크에서 도메인으로 가야 하는가 | `done` | `src/content/posts/xdd-ch01-framework-to-domain.md` | 시리즈 소개, 전체 로드맵 유지 |
| Ch.2 | 같은 요구사항, 다른 코드 | `done` | `src/content/posts/xdd-ch02-same-requirements-different-code.md` | 도입용 Customer 예제 |
| Ch.3 | DDD란 무엇인가 | `done` | `src/content/posts/xdd-ch03-what-is-ddd.md` | DDD 기본 어휘 정리 |
| Ch.4 | 요구사항에서 도메인 객체 뽑아내기 | `done` | `src/content/posts/xdd-ch04-requirements-to-objects.md` | 설계 단계 |
| Ch.5 | AI와 함께 Spec 정의하기 | `done` | `src/content/posts/xdd-ch05-sdd-spec.md` | Value Object SDD 실전 |
| Ch.6 | Value Object를 TDD로 구현하기 | `next` | - | Spec -> Test -> Code 시연 |
| Ch.7 | Entity란 무엇인가 | `planned` | - | Building Block 설명 시작 |
| Ch.8 | Entity Spec 정의하기 | `planned` | - | SDD |
| Ch.9 | Entity를 TDD로 구현하기 | `planned` | - | TDD |
| Ch.10 | Aggregate란 무엇인가 | `planned` | - | Building Block 설명 |
| Ch.11 | Aggregate Spec 정의하기 | `planned` | - | SDD |
| Ch.12 | Aggregate를 TDD로 구현하기 | `planned` | - | TDD |
| Ch.13 | Domain Service란 무엇인가 | `planned` | - | Building Block 설명 |
| Ch.14 | Domain Service Spec 정의하기 | `planned` | - | SDD |
| Ch.15 | Domain Service를 TDD로 구현하기 | `planned` | - | TDD |
| Ch.16 | Repository란 무엇인가 | `planned` | - | DIP, infra 분리 |
| Ch.17 | Repository 계약 정의하기 | `planned` | - | Spec/contract |
| Ch.18 | Repository와 인프라 연결하기 | `planned` | - | in-memory -> 실제 구현 |
| Ch.19 | Application Service와 유스케이스 조율 | `planned` | - | 유스케이스 흐름 |
| Ch.20 | Spec -> Test -> Code 전체 흐름 정리 | `planned` | - | 중간 총정리 |
| Ch.21 | 프레임워크 연동 | `planned` | - | backend/app wiring |
| Ch.22 | 프론트엔드에서 DDD는 어디까지 적용할 수 있을까 | `planned` | - | frontend 운영법 |
| Ch.23 | AI 시대의 DDD 운영법 | `planned` | - | Spec sync, 테스트, 협업 운영 |

## Building Block 파트의 반복 패턴

각 Building Block은 가능하면 아래 순서를 반복한다.

1. 개념 설명: 이 Block이 왜 필요한가
2. 설계/범위: 어떤 규칙을 이 Block이 책임지는가
3. SDD: AI와 함께 Spec을 정리한다
4. TDD: Spec을 테스트로 옮긴다
5. 구현: 테스트를 통과하도록 구현한다
6. 연결: 다음 Block이나 유스케이스와 어떻게 이어지는가

## 도메인 예제 운영 메모

- Ch.1~5의 `Customer / Name / Email / RewardPoints`는 입문용 예제다
- 이후 DDD를 더 자세히 설명하는 본편에서는 더 복잡한 도메인 예제로 전환한다
- 전환 시점에는 각 글 도입부에서 "도입 예제 -> 본편 예제" 전환을 명시한다
- Aggregate, Domain Service, Repository부터는 상태 전이와 일관성 경계가 잘 드러나는 예제를 사용한다

## 본편 실전 예제 후보

본편에서 사용할 실전 예제는 `Jira`나 `Linear` 같은 작업 운영 도구 계열이 적합하다.
다만 팀 협업 SaaS 전체를 만들겠다는 뜻은 아니다. 그 안의 핵심 도메인만 가져온, 개인이 실제로 사용할 수 있는 작은 작업 운영 도구로 범위를 줄인다.

즉 방향은 이렇다.

- `Jira`처럼 너무 크고 무거운 기업용 협업툴은 아니다
- `Linear`처럼 상태 전이와 워크플로우가 깔끔한 구조를 참고한다
- 실제 구현 범위는 개인용 `project/task manager` 수준으로 제한한다

이 도메인이 좋은 이유는 다음과 같다.

- 개인 사이드 프로젝트로 만들 수 있을 만큼 범위가 현실적이다
- 직접 매일 사용할 수 있어 요구사항이 계속 생긴다
- 단순 TODO를 넘어서면 상태 전이와 일관성 경계가 자연스럽게 등장한다
- Value Object, Entity, Aggregate, Domain Service, Repository를 모두 설명하기 좋다
- 프론트엔드 적용 예제로도 이어 가기 쉽다

## 본편 예제의 핵심 개념

작은 범위로 시작하되, DDD 설명에 필요한 개념은 충분히 담는다.

- `Task`
- `Project`
- `Sprint`
- `TaskStatus`
- `Priority`
- `TaskTitle`
- `DueDate`
- `Assignee`

## 본편 예제에서 다루기 좋은 규칙

아래 같은 규칙이 있으면 더 이상 단순 CRUD가 아니라, 도메인 모델링이 필요한 문제가 된다.

- `Task`는 `Todo -> InProgress -> Done` 같은 상태 전이를 가진다
- 완료된 `Project`에는 새 `Task`를 추가할 수 없다
- 같은 `Sprint` 안에서 진행 중인 `Task` 수에 제한을 둘 수 있다
- 높은 우선순위의 `Task`는 `DueDate` 없이 생성할 수 없게 할 수 있다
- 선행 `Task`가 끝나지 않으면 다음 `Task`를 시작할 수 없게 할 수 있다
- 특정 역할이 아니면 승인 단계를 건너뛸 수 없게 할 수 있다

## DDD Building Block 후보

### Value Object

- `TaskTitle`
- `TaskStatus`
- `Priority`
- `DueDate`
- `ProjectName`

### Entity

- `Task`
- `Project`
- `Sprint`
- `Member`

### Aggregate

- `Project` Aggregate
- 내부에 `Task`를 포함하고 프로젝트 차원의 규칙을 함께 관리

### Domain Service

- 담당자 배정 정책
- 우선순위 자동 조정 정책
- 스프린트 계획 계산

### Repository

- `ProjectRepository`
- `TaskRepository`
- `SprintRepository`

## 본편 전개 메모

- 초반 Building Block 설명은 `TaskTitle`, `TaskStatus`, `Priority`, `DueDate` 같은 작은 Value Object부터 시작한다
- 그다음 `Task`를 Entity로 설명한다
- 이후 `Project`를 Aggregate Root로 설명하면서 일관성 경계를 다룬다
- Domain Service에서는 담당자 배정이나 우선순위 정책처럼 여러 객체에 걸친 규칙을 다룬다
- Repository와 Application Service에서는 이 도메인을 실제 유스케이스로 연결한다
- 프론트엔드 챕터에서는 이 도메인을 화면 상태와 어떻게 분리해 운영할지 설명한다

## 다음 작업

### 1. Ch.6 작성

- Ch.5의 Spec을 그대로 테스트 케이스로 번역한다
- Red -> Green -> Refactor를 실제 코드로 보여준다
- `docs/specs/value-objects/`
- `src/domain/value-objects/`
- `tests/domain/value-objects/`
  이 세 경로가 함께 움직이는 흐름을 분명하게 보여준다

### 2. 본편 도메인 전환 준비

- Ch.7 이후 사용할 복잡한 도메인을 확정한다
- Entity / Aggregate / Domain Service 설명에 맞는 핵심 유스케이스를 먼저 정리한다
- Ch.7 도입부에서 도입 예제와 본편 예제의 차이를 명시한다

### 3. 시리즈 톤 유지

- Ch.1은 선언과 로드맵
- Ch.2는 비교
- Ch.3은 DDD 입문
- Ch.4는 설계
- Ch.5는 SDD 실전
- 이후 챕터도 같은 역할 분담이 흐트러지지 않도록 유지한다

## 체크리스트

- [x] Ch.1~5 파일 구조 정리
- [x] Ch.1에만 전체 로드맵 유지
- [x] Ch.2~5는 다음 글 연결 중심으로 마무리
- [x] DDD 용어 기본 통일
- [x] Ch.2와 Ch.3 사이에 도입 예제라는 설명 추가
- [ ] Ch.6 초안 작성
- [ ] Ch.7 이후 본편 도메인 확정
- [ ] Ch.7~23 세부 파일명 확정
- [ ] 시리즈 전체 제목/메타 설명 최종 교정
