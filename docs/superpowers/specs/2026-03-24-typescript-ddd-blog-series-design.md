# AI 시대의 TypeScript DDD: Spec에서 코드까지 — 블로그 시리즈 설계

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

## Part 1: MVC에서 DDD로, AI 시대의 발견 (2편)

### Ch.1: MVC에서 DDD로, 그리고 AI 시대의 발견

서사 흐름: **문제 인식 → 해법 발견 → 더 큰 가치 깨달음**

#### 1. MVC의 문제점 — 데이터 중심 프로그래밍의 한계

- 태스크 관리 앱을 MVC로 구현한 코드 예시
- 비즈니스 로직이 Controller/Service에 분산
- 상태 전이 로직 중복, 유효성 검증 누락
- 복잡도 증가 시 유지보수 붕괴

#### 2. DDD라는 대안 — 도메인 중심으로 전환

- 도메인 모델에 비즈니스 로직 응집
- Building Block 소개 (Entity, Value Object, Aggregate 등)
- 같은 문제를 DDD로 풀면 어떻게 달라지는지 미리보기

#### 3. 알고 보니, AI 시대에 딱이었다 — Spec + TDD + DDD 시너지

- Spec 정의 → AI가 이해 가능한 명확한 요구사항
- TDD → AI 생성 코드의 자동 검증 장치
- 프레임워크에 의존하지 않는 도메인 → AI/프레임워크 교체에 안전
- **"처음엔 MVC 한계 때문에 DDD를 찾았는데, AI와 일하다 보니 Spec+TDD+DDD가 최적이었다"**

### Ch.2: Before/After — 코드로 증명하기

- 동일한 요구사항: "태스크 상태를 변경하고 담당자에게 알림"
- **Before (MVC)**: Controller에 로직 분산, 테스트 어려움, AI에게 "이거 만들어줘" → 검증 불가
- **After (DDD)**: 도메인 모델 중심, Spec에서 TDD 자연 도출, AI가 프레임워크 코드 생성
- Spec → TDD → 구현 워크플로우 미리보기
- 이 시리즈에서 만들 것의 로드맵 제시

---

## Part 2: 도메인 Building Blocks — Spec→TDD→구현 (5~6편)

매 편 동일 리듬: **Spec 정의 → TDD 테스트 작성 → 구현 → AI 활용 팁**

### Ch.3: Value Object — 의미 있는 값 만들기

- **Spec**: TaskTitle (1~100자), Priority (high/medium/low), TaskStatus (todo/in-progress/done/cancelled)
- **TDD**: 불변성 검증, 동등성 비교, 유효성 검증 (빈 문자열, 범위 초과 등)
- **구현**: TypeScript class로 Value Object 패턴 (private constructor, factory method)
- **AI 팁**: Spec 문서로 AI에게 Value Object 생성 요청 → TDD로 검증하는 흐름

### Ch.4: Entity — 생명주기를 가진 객체

- **Spec**: Task 엔티티 — 상태 전이 규칙 (todo→in-progress→done, done→cancelled 불가 등)
- **TDD**: 생성 시 기본값, 상태 전이 성공/실패, 비즈니스 룰 위반 시 에러
- **구현**: 풍부한 행위를 가진 Task 엔티티 (메서드가 비즈니스 로직을 가짐)
- Value Object vs Entity 비교: 식별자 유무, 동등성 기준 차이

### Ch.5: Aggregate — 일관성의 경계

- **Spec**: Project 애그리거트 — Task 추가/제거, 동시 진행 Task 수 제한, Project 완료 조건
- **TDD**: Aggregate Root를 통한 조작만 허용, 불변식(invariant) 위반 시 에러
- **구현**: Task 컬렉션을 가진 Project 애그리거트, 트랜잭션 경계 설계
- 핵심 교훈: Aggregate 외부에서 Task를 직접 수정하면 안 되는 이유

### Ch.6: 도메인 서비스 & 도메인 이벤트

- **Spec**: TaskAssignmentService (담당자 배정 로직), TaskCompleted 이벤트
- **TDD**: 여러 엔티티에 걸친 비즈니스 로직 검증, 이벤트 발행 확인
- **구현**: 순수 도메인 서비스 (외부 의존성 없음), 도메인 이벤트 패턴
- 판단 기준: 엔티티에 넣을지 도메인 서비스로 뺄지

### Ch.7: 리포지토리 인터페이스 & 애플리케이션 서비스

- **Spec**: 리포지토리 계약 (Port 정의), 유스케이스 (CreateTask, AssignTask, CompleteProject)
- **TDD**: 인메모리 리포지토리로 도메인 전체 통합 테스트
- **구현**: 리포지토리 인터페이스 (Port), 애플리케이션 서비스 (유스케이스 오케스트레이션)
- **테제 증명**: "여기까지 프레임워크 코드 0줄. 순수 TypeScript + 도메인 로직만으로 전체 비즈니스가 TDD 검증됨"

### Ch.8 (선택): Spec-Driven Development 실전 시연

- 새 기능 "스프린트 관리"를 AI와 함께 처음부터 진행
- AI와 Spec 논의 → Spec 문서 작성 → TDD 테스트케이스 도출 → Red-Green-Refactor
- 독자가 따라할 수 있는 워크플로우 템플릿 제공
- Spec 문서 양식, AI 프롬프트 예시

---

## Part 3: 프레임워크 연동 — 도메인을 꽂다 (3편)

### Ch.9: 백엔드 — NestJS에 도메인 연결하기

- 인프라스트럭처 계층: 리포지토리 구현 (Prisma 또는 TypeORM)
- NestJS 모듈 구조: domain/ → application/ → infrastructure/ → presentation/
- Controller → 애플리케이션 서비스 → 도메인 모델 흐름
- **결정적 증명**: "Part 2에서 만든 도메인 코드를 한 줄도 수정하지 않고 NestJS에 연결"

### Ch.10: 프론트엔드 DDD — 단계별 적용

- **Level 0**: API 응답을 그대로 사용 (빈약한 모델, 조건문 산재)
- **Level 1**: DTO → 도메인 모델 hydration (응답에서 도메인 객체로 변환)
- **Level 2**: 완전한 도메인 모델 활용 (UI 상태를 도메인 모델로 관리, 비즈니스 로직 프론트에서도 실행)
- 각 단계별 코드 비교 + 트레이드오프
- "어디까지 적용할지는 팀과 프로젝트 상황에 따라 결정"

### Ch.11: 풀스택 통합 — 모노레포에서 도메인 공유

- 모노레포 구조: packages/domain (공유) + apps/backend + apps/frontend
- 백엔드/프론트엔드 동일 도메인 모델 사용
- API 계약과 도메인 타입 일치
- E2E 통합 테스트
- AI에게 프레임워크 코드 생성 시 공유 도메인을 참조하게 하는 방법

---

## Part 4: 총정리 (1편)

### Ch.12: AI 시대의 Spec-Driven DDD 워크플로우 완성

- 전체 워크플로우 다이어그램: Spec → TDD → 도메인 → 프레임워크 연동
- 시리즈에서 만든 코드의 아키텍처 전체도
- 프레임워크에 의존하지 않는 도메인의 실질적 가치 회고
- AI 협업 개발에서 사람이 집중해야 할 것 (도메인 지식, Spec, 테스트 시나리오)
- 다음 단계 안내: 이벤트 소싱, CQRS, 마이크로서비스

---

## 블로그 구현 사항

### 시리즈 지원

현재 블로그에는 시리즈/컬렉션 메커니즘이 없으므로:

1. **태그 기반 그룹핑**: `typescript-ddd` 태그로 시리즈 전체를 묶음
2. **제목 접두어**: `[TypeScript DDD] Ch.N:` 형태로 순서 표시
3. **기존 스키마 활용**: frontmatter 변경 불필요

### 포스트 파일명 규칙

```
src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
src/content/posts/typescript-ddd-ch02-before-after.md
src/content/posts/typescript-ddd-ch03-value-object.md
...
```

### 수정 대상 파일

- `src/content/posts/` — 새 포스트 12편 추가
- `src/content/config.ts` — 변경 불필요 (기존 스키마로 충분)
