# AI 시대의 SDD+TDD+DDD: Spec에서 코드까지 — 블로그 시리즈 설계

## 핵심 테제

**"AI 시대에 사람은 Domain, AI는 Framework"**

AI가 코드를 잘 짜는 시대에 개발자의 역할은 도메인 지식과 Spec 정의에 집중하는 것이다. Spec-Driven Development + TDD + DDD 조합이 AI 시대 개발에 최적임을 태스크/프로젝트 관리 도메인을 통해 증명한다.

- **Spec 정의** → AI가 이해하기 좋은 명확한 요구사항
- **TDD** → AI가 생성한 코드의 자동 검증 장치
- **DDD** → 프레임워크에 의존하지 않는 도메인이라 AI/프레임워크가 바뀌어도 안전

## 시리즈 메타데이터

| 항목 | 내용 |
|------|------|
| 독자 | 주니어~미드 개발자 (MVC 경험, DDD 입문) |
| 도메인 | 태스크/프로젝트 관리 |
| 스택 | NestJS (백엔드) + Next.js (프론트엔드), TypeScript 풀스택 |
| 규모 | 12편 (10~15편 범위) |
| 접근법 | Vertical Slice — 동기부여 → 도메인 TDD → 프레임워크 연결 |
| 목표 | 기술서 출간용 블로그 시리즈. 각 포스트 = 1 챕터 |

---

## Part 1: 프레임워크에서 Domain으로, AI 시대의 발견 (2편)

### Ch.1: 프레임워크에서 Domain으로, AI 시대의 개발 방법론 ✅

서사 흐름: **문제 인식 → AI 시대 역할 전환 → SDD/DDD+TDD 해법 제시**

파일: `src/content/posts/xdd-ch01-framework-to-domain.md`

#### 1. 프레임워크 중심 + 데이터 중심 개발의 한계

- 끝없는 프레임워크 학습의 반복 (Spring → Express → NestJS, jQuery → React → Next.js)
- 프레임워크 패턴(MVC)을 따르면 자연스럽게 데이터 중심 프로그래밍으로 귀결
- 비즈니스 로직이 Controller/Service에 분산 → 응집성 ↓ 복잡도 ↑
- 인과 관계: 프레임워크 중심 학습 → 데이터 중심 설계 → 유지보수 붕괴

#### 2. AI 시대, 역할이 뒤바뀌다

- AI가 프레임워크 작업을 더 잘함 (CRUD, 보일러플레이트, 마이그레이션)
- 반면 비즈니스 고유의 도메인 문제는 AI가 모름
- 개발자의 역할 재정의: Framework → AI 위임, Domain → 개발자 집중

#### 3. SDD/DDD + TDD — AI 시대의 개발 방법론

- Domain 중심 OOP: 행위를 가진 도메인 객체, Building Block 소개
- Framework Agnostic + POJO: mock 없이 TDD 가능
- SDD (Spec-Driven Development): AI와 Spec 먼저 정의 → TDD → 구현
- AI closed loop: Spec → Test → Implementation 닫힌 루프
- **SDD + TDD + DDD = AI 시대의 개발 방법론** 테제 선언

### Ch.2: 사고방식 비교 — 데이터 위주 vs 객체 위주

- **모델링 비교 도입**: 기본형(string, number) vs Value Object(Name, Email, Money) — Customer 클래스 비교로 한눈에 차이를 보여줌
- **데이터 위주 사고방식**: DB 우선, 기본형 사용, 빈혈 도메인 모델, Service에 로직 분산
- **객체 위주 사고방식**: 도메인 우선, Value Object + Entity, 도메인에 로직 응집
- 예제 도메인: 주문 관리 (상태 전이 + VIP 환불 정책)로 Before/After 비교
- 핵심 차이 요약표
- Ch.3~6으로의 브릿지: "DDD를 이해하고, 설계하고, Spec과 TDD로 어떻게 실천하는가?"

---

## Part 2: DDD + 설계 + SDD + TDD 실전 (4편)

### Ch.3: DDD — Value Object, Entity, Aggregate 이해하기

- DDD의 핵심 Building Block 설명
- Value Object와 Entity의 차이
- Aggregate, Domain Service, Repository의 역할
- OOP와 FP의 보완 관계
- **산출물**: DDD 기본 어휘와 판단 기준

### Ch.4: 설계 — 요구사항에서 도메인 객체 뽑아내기

- 요구사항을 다시 읽으며 도메인에서 의미 있는 값과 주체를 식별
- Value Object 후보와 Entity 후보를 구분
- 왜 Value Object부터 시작하는지 설명
- **산출물**: 모델링 대상 객체 후보 목록

### Ch.5: SDD — 도메인 객체를 Spec으로 설계하기

- Ch.4에서 고른 Value Object를 대상으로 Spec 정의
- AI와의 대화로 생성 규칙, 행동, 불변 조건, 동등성 정리
- **산출물**: 도메인 객체의 완성된 Spec 문서

### Ch.6: TDD — Spec에서 테스트로, 테스트에서 구현으로

- Ch.5에서 정의한 Spec이 확정된 상태에서 TDD로 구현
- Spec 문장 → 테스트 이름 → 테스트 코드 → 구현의 자연스러운 흐름
- Red-Green-Refactor 사이클 시연
- **산출물**: Spec을 만족하는 테스트 + 구현 코드

### Ch.7: Aggregate — 일관성의 경계

- **Spec**: Project 애그리거트 — Task 추가/제거, 동시 진행 Task 수 제한, Project 완료 조건
- **TDD**: Aggregate Root를 통한 조작만 허용, 불변식(invariant) 위반 시 에러
- **구현**: Task 컬렉션을 가진 Project 애그리거트, 트랜잭션 경계 설계
- 핵심 교훈: Aggregate 외부에서 Task를 직접 수정하면 안 되는 이유

### Ch.8: 도메인 서비스 & 도메인 이벤트

- **Spec**: TaskAssignmentService (담당자 배정 로직), TaskCompleted 이벤트
- **TDD**: 여러 엔티티에 걸친 비즈니스 로직 검증, 이벤트 발행 확인
- **구현**: 순수 도메인 서비스 (외부 의존성 없음), 도메인 이벤트 패턴
- 판단 기준: 엔티티에 넣을지 도메인 서비스로 뺄지

### Ch.9: 리포지토리 인터페이스 & 애플리케이션 서비스

- **Spec**: 리포지토리 계약 (Port 정의), 유스케이스 (CreateTask, AssignTask, CompleteProject)
- **TDD**: 인메모리 리포지토리로 도메인 전체 통합 테스트
- **구현**: 리포지토리 인터페이스 (Port), 애플리케이션 서비스 (유스케이스 오케스트레이션)
- **테제 증명**: "여기까지 프레임워크 코드 0줄. 순수 TypeScript + 도메인 로직만으로 전체 비즈니스가 TDD 검증됨"

### Ch.10 (선택): Spec-Driven Development 실전 시연

- 새 기능 "스프린트 관리"를 AI와 함께 처음부터 진행
- AI와 Spec 논의 → Spec 문서 작성 → TDD 테스트케이스 도출 → Red-Green-Refactor
- 독자가 따라할 수 있는 워크플로우 템플릿 제공
- Spec 문서 양식, AI 프롬프트 예시

---

## Part 3: 프레임워크 연동 — 도메인을 꽂다 (3편)

### Ch.11: 백엔드 — NestJS에 도메인 연결하기

- 인프라스트럭처 계층: 리포지토리 구현 (Prisma 또는 TypeORM)
- NestJS 모듈 구조: domain/ → application/ → infrastructure/ → presentation/
- Controller → 애플리케이션 서비스 → 도메인 모델 흐름
- **결정적 증명**: "Part 2에서 만든 도메인 코드를 한 줄도 수정하지 않고 NestJS에 연결"

### Ch.12: 프론트엔드 DDD — 단계별 적용

- **Level 0**: API 응답을 그대로 사용 (빈약한 모델, 조건문 산재)
- **Level 1**: DTO → 도메인 모델 hydration (응답에서 도메인 객체로 변환)
- **Level 2**: 완전한 도메인 모델 활용 (UI 상태를 도메인 모델로 관리, 비즈니스 로직 프론트에서도 실행)
- 각 단계별 코드 비교 + 트레이드오프
- "어디까지 적용할지는 팀과 프로젝트 상황에 따라 결정"

### Ch.13: 풀스택 통합 — 모노레포에서 도메인 공유

- 모노레포 구조: packages/domain (공유) + apps/backend + apps/frontend
- 백엔드/프론트엔드 동일 도메인 모델 사용
- API 계약과 도메인 타입 일치
- E2E 통합 테스트
- AI에게 프레임워크 코드 생성 시 공유 도메인을 참조하게 하는 방법

---

## Part 4: 총정리 (1편)

### Ch.14: AI 시대의 Spec-Driven DDD 워크플로우 완성

- 전체 워크플로우 다이어그램: Spec → TDD → 도메인 → 프레임워크 연동
- 시리즈에서 만든 코드의 아키텍처 전체도
- 프레임워크에 의존하지 않는 도메인의 실질적 가치 회고
- AI 협업 개발에서 사람이 집중해야 할 것 (도메인 지식, Spec, 테스트 시나리오)
- 다음 단계 안내: 이벤트 소싱, CQRS, 마이크로서비스

---

## 블로그 구현 사항

### 시리즈 지원

현재 블로그에는 시리즈/컬렉션 메커니즘이 없으므로:

1. **태그 기반 그룹핑**: `ddd`, `sdd` 태그로 시리즈 전체를 묶음
2. **제목 접두어**: `[SDD+TDD+DDD] Ch.N:` 형태로 순서 표시
3. **기존 스키마 활용**: frontmatter 변경 불필요

### 포스트 파일명 규칙

```
src/content/posts/xdd-ch01-framework-to-domain.md
src/content/posts/xdd-ch02-same-requirements-different-code.md
src/content/posts/xdd-ch03-what-is-ddd.md
src/content/posts/xdd-ch04-requirements-to-objects.md
src/content/posts/xdd-ch05-sdd-spec.md
...
```

### 수정 대상 파일

- `src/content/posts/` — 새 포스트 12편 추가
- `src/content/config.ts` — 변경 불필요 (기존 스키마로 충분)
