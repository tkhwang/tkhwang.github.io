# TypeScript DDD Ch.1 블로그 포스트 구현 계획

> **에이전트 작업자 참고:** 필수 하위 스킬: superpowers:subagent-driven-development (권장) 또는 superpowers:executing-plans를 사용하여 태스크별로 구현합니다. 각 단계는 체크박스(`- [ ]`)로 추적합니다.

**목표:** Ch.1 블로그 포스트 "MVC에서 DDD로, 그리고 AI 시대의 발견" 작성 — 3막 구조(MVC 고통 → DDD 해법 → AI 시대 시너지)로 시리즈 전체의 동기를 부여하는 첫 챕터.

**구조:** 기존 블로그 규칙을 따르는 Astro 마크다운 포스트 1개. 한국어 기본, 기술 용어만 영문. H2로 최상위 섹션 구분. 커스텀 컴포넌트 없이 표준 마크다운만 사용.

**기술 스택:** Astro 블로그 (마크다운), 포스트 내 TypeScript 코드 예제

**설계 문서:** `docs/superpowers/specs/2026-03-24-typescript-ddd-blog-series-design.md`

---

## 파일 구조

| 작업 | 경로 | 역할 |
|------|------|------|
| 생성 | `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md` | Ch.1 블로그 포스트 본문 |

다른 파일 수정 불필요 — 기존 콘텐츠 스키마(`src/content/config.ts`)와 레이아웃이 이 포스트를 그대로 지원합니다.

---

### 태스크 1: Ch.1 블로그 포스트 파일 생성 (frontmatter + 뼈대)

**파일:**
- 생성: `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md`

- [ ] **단계 1: frontmatter와 뼈대를 갖춘 포스트 파일 생성**

```markdown
---
title: "[TypeScript DDD] Ch.1: MVC에서 DDD로, 그리고 AI 시대의 발견"
pubDate: 2026-03-24
description: "데이터 중심 MVC의 한계를 넘어 DDD로, 그리고 AI 시대에 Spec+TDD+DDD가 최적의 개발 방법론인 이유를 발견하기까지"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "typescript-ddd"]
---

이 글은 **[TypeScript DDD] 시리즈**의 첫 번째 글입니다.

(본문은 이후 태스크에서 작성)
```

- [ ] **단계 2: 빌드 성공 확인**

실행: `cd /Users/tkhwang/.superset/worktrees/tkhwang.github.io/feat/update-design-local && pnpm build`
기대 결과: 빌드 성공, 새 포스트가 출력에 포함됨

- [ ] **단계 3: 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
git commit -m "feat: TypeScript DDD 시리즈 Ch.1 뼈대 추가"
```

---

### 태스크 2: 섹션 1 작성 — MVC의 문제점

이 섹션의 목표: 독자가 "아, 나도 이런 경험 있어" 하고 공감하게 만들기. 태스크 관리 앱의 MVC 코드를 보여주고, 비즈니스 로직이 분산되는 고통을 시연한다.

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md`

- [ ] **단계 1: 도입부와 섹션 1 제목 작성**

포스트 시작 부분에 시리즈 소개 + 독자가 왜 이 글을 읽어야 하는지 (1~2 문단). 그리고:

```markdown
## MVC의 문제점 — 데이터 중심 프로그래밍의 한계
```

- [ ] **단계 2: MVC 코드 예제 작성 — TaskService**

태스크 상태 변경 로직이 Service에 분산된 전형적인 MVC 코드를 보여줌.

핵심 코드 예제 (포스트에 삽입할 TypeScript 코드):

```typescript
// MVC 방식: TaskService.ts
class TaskService {
  async changeStatus(taskId: string, newStatus: string) {
    const task = await this.taskRepository.findById(taskId);

    // 상태 전이 검증 로직이 Service에 흩어짐
    if (task.status === 'done' && newStatus === 'in-progress') {
      throw new Error('완료된 태스크는 다시 진행할 수 없습니다');
    }
    if (task.status === 'cancelled') {
      throw new Error('취소된 태스크는 상태를 변경할 수 없습니다');
    }

    task.status = newStatus;
    task.updatedAt = new Date();

    // 담당자 알림 로직도 여기에...
    if (newStatus === 'done') {
      await this.notificationService.notify(task.assigneeId, '태스크 완료');
    }

    await this.taskRepository.save(task);
  }
}
```

- [ ] **단계 3: MVC 코드 예제 작성 — TaskController**

Controller에도 비즈니스 로직이 새어나오는 예시:

```typescript
// MVC 방식: TaskController.ts
class TaskController {
  async assignTask(req: Request) {
    const { taskId, assigneeId } = req.body;
    const task = await this.taskRepository.findById(taskId);

    // 여기서도 비즈니스 룰 검증...
    if (task.status === 'done' || task.status === 'cancelled') {
      return res.status(400).json({ error: '완료/취소된 태스크에 담당자를 배정할 수 없습니다' });
    }

    // 최대 담당자 수 검증도 Controller에서...
    const project = await this.projectRepository.findById(task.projectId);
    const activeTasks = project.tasks.filter(t => t.assigneeId === assigneeId && t.status === 'in-progress');
    if (activeTasks.length >= 5) {
      return res.status(400).json({ error: '한 사람당 동시 진행 태스크는 5개까지입니다' });
    }

    task.assigneeId = assigneeId;
    await this.taskRepository.save(task);
  }
}
```

- [ ] **단계 4: 문제점 분석 작성**

코드 예제 이후 문제점 분석 (글로 설명):

1. **비즈니스 로직 분산**: 상태 검증이 Service, Controller 양쪽에 중복
2. **빈약한 도메인 모델**: Task는 그저 데이터 덩어리 (`task.status = newStatus` — 외부에서 직접 수정)
3. **테스트 어려움**: Service를 테스트하려면 Repository, NotificationService 등 모든 의존성을 mock해야 함
4. **"이 로직 어디서 수정하지?"**: 새로운 상태 전이 규칙 추가 시 여러 파일을 찾아다녀야 함

- [ ] **단계 5: 섹션 1 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
git commit -m "feat(ch01): 섹션 1 - MVC 문제점과 코드 예제 추가"
```

---

### 태스크 3: 섹션 2 작성 — DDD라는 대안

이 섹션의 목표: 같은 문제를 DDD로 풀면 어떻게 달라지는지 미리보기. 아직 DDD 용어를 깊이 설명하지 않고, "이렇게 바뀌면 좋지 않겠어?" 수준으로 보여준다.

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md`

- [ ] **단계 1: 섹션 2 제목과 도입부 작성**

```markdown
## DDD라는 대안 — 도메인 중심으로 전환하면
```

MVC 코드의 근본 문제가 "데이터 중심 사고"에 있음을 짚고, "도메인 중심"으로 전환하면 어떻게 되는지 보여주겠다는 브릿지 문단.

- [ ] **단계 2: DDD 코드 예제 작성 — Task 엔티티 (풍부한 모델)**

MVC의 빈약한 Task를 풍부한 도메인 모델 Task로 변환:

```typescript
// DDD 방식: Task.ts (도메인 모델)
class Task {
  private constructor(
    private readonly id: TaskId,
    private title: TaskTitle,
    private status: TaskStatus,
    private assigneeId: MemberId | null,
    private readonly createdAt: Date,
  ) {}

  static create(title: TaskTitle): Task {
    return new Task(
      TaskId.generate(),
      title,
      TaskStatus.TODO,
      null,
      new Date(),
    );
  }

  startProgress(): void {
    if (!this.status.canTransitionTo(TaskStatus.IN_PROGRESS)) {
      throw new InvalidStatusTransitionError(this.status, TaskStatus.IN_PROGRESS);
    }
    this.status = TaskStatus.IN_PROGRESS;
  }

  complete(): void {
    if (!this.status.canTransitionTo(TaskStatus.DONE)) {
      throw new InvalidStatusTransitionError(this.status, TaskStatus.DONE);
    }
    this.status = TaskStatus.DONE;
  }

  assignTo(memberId: MemberId): void {
    if (this.status.isTerminal()) {
      throw new Error('완료/취소된 태스크에 담당자를 배정할 수 없습니다');
    }
    this.assigneeId = memberId;
  }
}
```

- [ ] **단계 3: 대비 분석 작성**

MVC vs DDD 비교:

| MVC | DDD |
|-----|-----|
| `task.status = newStatus` (외부에서 직접 변경) | `task.startProgress()` (객체가 스스로 상태 관리) |
| 상태 검증이 Service/Controller에 분산 | 모든 비즈니스 룰이 Task 안에 응집 |
| 테스트하려면 DB, 외부 서비스 mock 필요 | `Task.create()` 하고 메서드 호출하면 끝 |
| "이 룰 어디에 있지?" | "Task.ts만 보면 됨" |

- [ ] **단계 4: Building Block 미리보기 작성**

DDD의 핵심 Building Block 미리보기 (상세 설명은 Part 2에서):
- **Value Object**: TaskTitle, TaskStatus, Priority — 의미 있는 값
- **Entity**: Task — 고유 ID를 가진 생명주기 객체
- **Aggregate**: Project — 일관성의 경계
- **도메인 서비스**: 여러 엔티티에 걸친 비즈니스 로직
- **리포지토리**: 저장소 인터페이스 (구현은 나중에)

각 Building Block을 간략히 1~2줄로 설명하고, 이 시리즈에서 하나씩 만들어갈 것임을 예고.

- [ ] **단계 5: 섹션 2 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
git commit -m "feat(ch01): 섹션 2 - DDD 대안과 풍부한 도메인 모델 추가"
```

---

### 태스크 4: 섹션 3 작성 — AI 시대에 딱이었다

이 섹션의 목표: 이 시리즈의 핵심 테제를 선언. "Spec + TDD + DDD가 AI 시대 개발에 왜 최적인가"를 논증한다. 시리즈 전체의 훅(hook)이 되는 섹션.

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md`

- [ ] **단계 1: 섹션 3 제목과 테제 작성**

```markdown
## 알고 보니, AI 시대에 딱이었다 — Spec + TDD + DDD의 시너지
```

핵심 선언: "처음엔 MVC 한계 때문에 DDD를 찾았는데, AI와 함께 개발하다 보니 Spec+TDD+DDD 조합이 AI 시대에 최적이었다."

- [ ] **단계 2: 3가지 축 논증 작성**

3가지 축을 각각 설명:

**Spec 정의 → AI가 이해하기 좋은 명확한 요구사항**
- MVC 방식으로 AI에게 "태스크 관리 기능 만들어줘" → 결과가 불명확
- DDD Building Block별 Spec으로 AI에게 요청 → 명확한 입출력, 제약조건
- Spec 예시 스니펫:

```markdown
## TaskStatus Value Object Spec

- 가능한 값: TODO, IN_PROGRESS, DONE, CANCELLED
- 상태 전이 규칙:
  - TODO → IN_PROGRESS (가능)
  - IN_PROGRESS → DONE (가능)
  - IN_PROGRESS → CANCELLED (가능)
  - DONE → * (불가)
  - CANCELLED → * (불가)
- 불변 객체 (immutable)
- canTransitionTo(target): boolean 메서드 제공
```

**TDD → AI가 생성한 코드의 자동 검증 장치**
- AI가 코드를 생성해도 "맞는지" 확인이 필요
- Spec에서 TDD 테스트케이스가 자연스럽게 도출:

```typescript
describe('TaskStatus', () => {
  it('TODO에서 IN_PROGRESS로 전이 가능', () => {
    const status = TaskStatus.TODO;
    expect(status.canTransitionTo(TaskStatus.IN_PROGRESS)).toBe(true);
  });

  it('DONE에서는 어디로도 전이 불가', () => {
    const status = TaskStatus.DONE;
    expect(status.canTransitionTo(TaskStatus.TODO)).toBe(false);
    expect(status.canTransitionTo(TaskStatus.IN_PROGRESS)).toBe(false);
  });
});
```

- 테스트가 먼저 존재하므로, AI가 어떤 코드를 생성하든 검증 가능

**DDD → 프레임워크에 의존하지 않는 도메인**
- 도메인 코드에 NestJS, Express, Prisma 등 프레임워크 코드가 0줄
- AI/프레임워크가 바뀌어도 도메인 로직은 그대로
- "도메인은 사람이 책임, 프레임워크 연동은 AI가 보조" 역할 분리

- [ ] **단계 3: 워크플로우 다이어그램 작성 (텍스트 기반)**

전체 워크플로우를 텍스트로 표현:

```
사람의 영역                    AI의 영역
─────────────              ─────────────
도메인 지식                 프레임워크 코드
     │                          │
     ▼                          │
Spec 문서 작성                   │
     │                          │
     ▼                          │
TDD 테스트 도출 ◄────────────── AI 보조
     │                          │
     ▼                          │
도메인 구현  ◄─────────────── AI 보조
     │                          │
     ▼                          ▼
     └──────── 프레임워크 연동 (AI 담당) ──────┘
```

- [ ] **단계 4: 시리즈 로드맵과 마무리 작성**

이 시리즈에서 무엇을 만들지 로드맵:
- Part 1 (Ch.1~2): 왜 DDD인가 + Before/After 증명
- Part 2 (Ch.3~8): 도메인 Building Blocks를 Spec→TDD→구현 사이클로
- Part 3 (Ch.9~11): NestJS/Next.js 연동 + 프론트엔드 DDD 단계별 적용
- Part 4 (Ch.12): 워크플로우 총정리

마무리: "다음 글에서는 MVC와 DDD를 동일한 요구사항으로 나란히 구현하여 코드로 직접 비교해봅니다."

- [ ] **단계 5: 섹션 3 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
git commit -m "feat(ch01): 섹션 3 - AI 시대 Spec+TDD+DDD 시너지와 시리즈 로드맵 추가"
```

---

### 태스크 5: 최종 검토 및 다듬기

**파일:**
- 수정: `src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md`

- [ ] **단계 1: 전체 포스트 흐름과 일관성 검토**

전체 포스트를 처음부터 끝까지 읽으며 확인:
- 서사 흐름이 자연스러운가 (MVC 고통 → DDD 대안 → AI 시대 발견)
- 코드 예제가 일관성 있는가 (같은 도메인, 같은 변수명)
- 한국어/영어 혼용이 자연스러운가
- 불필요하게 긴 부분 축약

- [ ] **단계 2: 개발 서버에서 렌더링 확인**

실행: `cd /Users/tkhwang/.superset/worktrees/tkhwang.github.io/feat/update-design-local && pnpm dev`
- 브라우저에서 포스트 확인
- 코드 블록 렌더링 확인
- 태그 링크 동작 확인

- [ ] **단계 3: 프로덕션 빌드 확인**

실행: `cd /Users/tkhwang/.superset/worktrees/tkhwang.github.io/feat/update-design-local && pnpm build`
기대 결과: 에러 없이 빌드 성공

- [ ] **단계 4: 최종 커밋**

```bash
git add src/content/posts/typescript-ddd-ch01-mvc-to-ddd-ai-era.md
git commit -m "feat: Ch.1 완성 - MVC에서 DDD로, 그리고 AI 시대의 발견"
```
