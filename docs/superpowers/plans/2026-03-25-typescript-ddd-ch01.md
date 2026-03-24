# TypeScript DDD Ch.1 블로그 포스트 구현 계획

> **에이전트 작업자 참고:** 필수 하위 스킬: superpowers:subagent-driven-development (권장) 또는 superpowers:executing-plans를 사용하여 태스크별로 구현합니다. 각 단계는 체크박스(`- [ ]`)로 추적합니다.

**목표:** Ch.1 블로그 포스트 "Framework에서 Domain으로, AI 시대의 개발 방법론" 작성 — 3막 구조(Framework+데이터 중심의 한계 → AI 시대 역할 전환 → SDD/DDD+TDD 해법)로 시리즈 전체의 동기를 부여하는 첫 챕터.

**구조:** 기존 블로그 규칙을 따르는 Astro 마크다운 포스트 1개. 한국어 기본, 기술 용어만 영문. H2로 최상위 섹션 구분. 코드 최소화 — 의사코드 수준 스니펫만 허용.

**기술 스택:** Astro 블로그 (마크다운 포스트)

**설계 문서:** `docs/superpowers/specs/2026-03-25-typescript-ddd-ch01-design.md`

---

## 파일 구조

| 작업 | 경로 | 역할 |
|------|------|------|
| 생성 | `src/content/posts/typescript-ddd-ch01-framework-to-domain.md` | Ch.1 블로그 포스트 본문 |

다른 파일 수정 불필요 — 기존 콘텐츠 스키마(`src/content/config.ts`)와 레이아웃이 이 포스트를 그대로 지원합니다.

---

### 태스크 1: 포스트 파일 생성 (frontmatter + 도입부)

**파일:**
- 생성: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`

- [ ] **단계 1: frontmatter와 도입부를 갖춘 포스트 파일 생성**

```markdown
---
title: "[TypeScript DDD] Ch.1: Framework에서 Domain으로, AI 시대의 개발 방법론"
pubDate: 2026-03-25
description: "Framework 중심 + 데이터 중심 개발의 한계를 넘어, SDD/DDD + TDD가 AI 시대의 개발 방법론인 이유"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "typescript-ddd", "sdd"]
---

이 글은 **[TypeScript DDD] 시리즈**의 첫 번째 글입니다.

(본문은 이후 태스크에서 작성)
```

- [ ] **단계 2: 빌드 성공 확인**

실행: `pnpm build`
기대 결과: 빌드 성공, 새 포스트가 출력에 포함됨

- [ ] **단계 3: 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-framework-to-domain.md
git commit -m "feat: TypeScript DDD 시리즈 Ch.1 뼈대 추가"
```

---

### 태스크 2: 1막 작성 — Framework 중심 + 데이터 중심 개발의 한계

이 섹션의 목표: 독자가 "나도 이런 경험 있어" 공감. 코드 예제 없이 개발자 경험과 상황 묘사로 전개.

**분량 목표**: 전체의 약 30%

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`

- [ ] **단계 1: 도입부 작성**

시리즈 소개 + "이 글은 Framework 중심 개발을 해온 개발자가 AI 시대에 도메인 중심으로 전환한 이야기" (1~2 문단). 독자가 왜 이 글을 읽어야 하는지 동기 부여.

- [ ] **단계 2: 섹션 제목 + Framework 중심 학습의 반복 작성**

```markdown
## Framework 중심 + 데이터 중심 개발, 어디가 문제인가

### 끝없는 Framework 학습의 반복
```

다음 내용을 공감 서사로 전개:
- Backend: Spring → Express → NestJS, Frontend: jQuery → React → Next.js — 새 프레임워크가 나올 때마다 학습 비용 발생
- Framework version up 시 코드 대량 변경 (예: 메이저 버전 업그레이드의 고통)
- "프레임워크를 배우는 게 개발을 배우는 것"이라고 착각하게 되는 구조

- [ ] **단계 3: 데이터 중심 프로그래밍의 한계 작성**

```markdown
### 데이터 중심 프로그래밍의 한계
```

다음 내용을 전개:
- Framework이 제공하는 패턴(Controller → Service → Repository)을 따르다 보면 자연스럽게 MVC 데이터 중심 프로그래밍으로 귀결
- 도메인 객체는 데이터 덩어리 (빈약한 모델, Anemic Domain Model)
- 비즈니스 로직이 Controller/Service에 분산 → 응집성 ↓ 복잡도 ↑
- "이 로직 어디서 수정하지?" — 코드가 커질수록 유지보수 어려움

**두 문제의 인과 관계를 반드시 연결**: Framework 중심 학습 → 자연스럽게 데이터 중심 프로그래밍 → 비즈니스 로직 분산 → 유지보수 붕괴

- [ ] **단계 4: 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-framework-to-domain.md
git commit -m "feat(ch01): 1막 - Framework 중심 + 데이터 중심 개발의 한계"
```

---

### 태스크 3: 2막 작성 — AI 시대, 역할이 뒤바뀌다

이 섹션의 목표: 문제에서 기회로 전환. "AI가 framework을 잘하니, 나는 도메인에 집중해야 한다"는 발견.

**분량 목표**: 전체의 약 30%

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`

- [ ] **단계 1: AI가 Framework을 나보다 잘한다 작성**

```markdown
## AI 시대, 역할이 뒤바뀌다
```

다음 내용을 전개:
- AI 코드 생성 도구(Cursor, Copilot, Claude Code 등)가 등장
- NestJS CRUD 엔드포인트, React 컴포넌트 보일러플레이트, DB 마이그레이션 등 — AI가 빠르고 정확하게 생성
- 개발자가 framework 세부사항에 시간 쏟을 이유가 줄어듦
- "내가 프레임워크 API를 외워서 얻는 가치가 급격히 떨어지고 있다"

- [ ] **단계 2: 내 고유한 도메인 문제는 AI가 부족하다 작성**

다음 내용을 전개:
- 반면, 우리 비즈니스만의 특수한 규칙, 제약, 맥락은 AI가 모름
- 일반적 지식 위주의 AI는 도메인 고유의 문제를 풀기 어려움
- 예: "태스크가 완료 상태이면 담당자를 재배정할 수 없다" 같은 비즈니스 규칙은 우리만 알고 있음

- [ ] **단계 3: 결론 — 개발자의 역할 재정의 작성**

다음 내용으로 2막 마무리:
- Framework → AI에게 위임
- Domain → 개발자가 집중
- "내가 해결해야 하는 고유한 문제에 시간을 써야 한다"
- 이 인식이 DDD(Domain-Driven Design)와 자연스럽게 연결된다는 브릿지

- [ ] **단계 4: 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-framework-to-domain.md
git commit -m "feat(ch01): 2막 - AI 시대 역할 전환과 도메인 집중"
```

---

### 태스크 4: 3막 작성 — SDD/DDD + TDD, AI 시대의 개발 방법론

이 섹션의 목표: 시리즈 전체의 테제 선언. SDD + TDD + DDD 삼위일체를 소개하고 "이것이 AI 시대의 개발 방법론이다"를 논증.

**분량 목표**: 전체의 약 30%

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`

- [ ] **단계 1: Domain 중심 OOP (DDD) 소개 작성**

```markdown
## SDD/DDD + TDD — AI 시대의 개발 방법론

### Domain 중심 OOP — 비즈니스 로직을 도메인에 응집
```

다음 내용을 전개:
- 데이터 덩어리가 아닌 **행위를 가진 도메인 객체**로 전환
- 비즈니스 로직이 도메인에 응집 → 응집성 ↑ 복잡도 ↓
- DDD Building Block 미리보기 (각 1~2줄 정의):
  - **Value Object**: 의미 있는 값. 불변. 동등성으로 비교 (예: TaskTitle, Priority)
  - **Entity**: 고유 ID를 가진 생명주기 객체 (예: Task, Member)
  - **Aggregate**: 일관성의 경계. 외부에서 직접 수정 불가 (예: Project)
  - **도메인 서비스**: 여러 엔티티에 걸친 비즈니스 로직
  - **리포지토리**: 저장소 인터페이스 (구현은 인프라에서)

- [ ] **단계 2: Framework Agnostic + POJO 작성**

```markdown
### Framework Agnostic + POJO — TDD가 자연스러워지다
```

다음 내용을 전개:
- 순수 TypeScript/JavaScript 객체(POJO)로 도메인 구현
- NestJS, Spring, React 등 어떤 framework과도 독립
- **핵심**: 외부 의존성 없는 POJO → mock 없이 단위 테스트 가능 → TDD가 자연스러움
- Framework에 의존하지 않으므로 framework이 바뀌어도 도메인 코드는 그대로

- [ ] **단계 3: SDD (Spec-Driven Development) 소개 작성**

```markdown
### SDD (Spec-Driven Development) — AI와 함께 Spec 먼저
```

다음 내용을 전개:
- SDD: AI와 대화하며 **Spec을 먼저 정의**하는 개발 방식
- BDD(Behavior-Driven Development)와 유사하지만, AI를 Spec 정의의 대화 상대로 활용하는 점이 차별점
- Spec에서 TDD 테스트케이스가 자연스럽게 도출
- 워크플로우 소개:

```
AI와 Spec 정의 → TDD 테스트 작성 → 도메인 구현 → Framework 연동 (AI 보조)
```

- 이 워크플로우에서 **사람의 영역**(도메인 지식, Spec 정의)과 **AI의 영역**(Framework 코드, 보일러플레이트)이 자연스럽게 분리
- Ch.8에서 SDD 실전 시연을 다룰 것임을 예고하는 forward-reference 포함

- [ ] **단계 4: 삼위일체 테제 선언 작성**

짧은 마무리 문단:
- **SDD + TDD + DDD = AI 시대의 개발 방법론**이라는 테제 선언
- "이 시리즈에서는 이 워크플로우를 태스크/프로젝트 관리 도메인을 통해 처음부터 끝까지 구현해본다"

- [ ] **단계 5: 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-framework-to-domain.md
git commit -m "feat(ch01): 3막 - SDD/DDD + TDD AI 시대 개발 방법론 테제"
```

---

### 태스크 5: 마무리 — 시리즈 로드맵 + 전체 검토

**분량 목표**: 전체의 약 10%

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`

- [ ] **단계 1: 시리즈 로드맵 작성**

```markdown
## 이 시리즈에서 만들어갈 것
```

다음 로드맵을 간략히:
- **Part 1** (Ch.1~2): 왜 SDD/DDD인가 + Before/After 코드 증명
- **Part 2** (Ch.3~7): 도메인 Building Blocks — Spec → TDD → 구현 사이클
- **Part 3** (Ch.9~11): NestJS/Next.js 연동 + 프론트엔드 DDD
- **Part 4** (Ch.12): 워크플로우 총정리

"다음 글에서는 같은 요구사항을 데이터 중심 vs 도메인 중심으로 나란히 구현해서 코드로 증명합니다."

- [ ] **단계 2: 전체 포스트 흐름 검토**

전체 포스트를 처음부터 끝까지 읽으며 확인:
- 서사 흐름이 자연스러운가 (Framework+데이터 한계 → AI 역할 전환 → SDD/DDD 해법)
- 한국어/영어 혼용이 자연스러운가 (기술 용어만 영문)
- 섹션 비중이 균형적인가 (30/30/30/10)
- 불필요하게 긴 부분 축약, 빠진 논점 보완

- [ ] **단계 3: 프로덕션 빌드 확인**

실행: `pnpm build`
기대 결과: 에러 없이 빌드 성공

- [ ] **단계 4: 최종 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-framework-to-domain.md
git commit -m "feat: Ch.1 완성 - Framework에서 Domain으로, AI 시대의 개발 방법론"
```

---

### 후속 작업 (Ch.1 완성 후)

- 부모 시리즈 spec(`docs/superpowers/specs/2026-03-24-typescript-ddd-blog-series-design.md`) 키워드/제목 업데이트 반영
- Ch.2 plan 작성 진행
