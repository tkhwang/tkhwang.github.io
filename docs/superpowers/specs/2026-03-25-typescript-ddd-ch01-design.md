# TypeScript DDD Ch.1 설계: Framework에서 Domain으로, AI 시대의 개발 방법론

## 개요

Ch.1은 시리즈 전체의 **동기 부여 챕터**. 코드 예제를 최소화하고 서사와 개념 중심으로, "왜 SDD/DDD + TDD가 AI 시대의 개발 방법론인가"를 논증한다.

## 핵심 테제

**"AI 시대에 개발자는 Domain, AI는 Framework"**

- Framework 중심 + 데이터 중심 개발의 한계를 인식
- AI가 framework을 더 잘 다루는 시대, 개발자는 도메인에 집중
- SDD(Spec-Driven Development) + TDD + DDD 조합이 AI 시대 최적의 개발 방법론

## 출력 파일

- **파일명**: `src/content/posts/typescript-ddd-ch01-framework-to-domain.md`
- **Frontmatter**:

```yaml
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
```

## Non-Goals

- 이 챕터에서 태스크 관리 도메인 예제를 도입하지 않음 (Ch.2에서)
- 코드 비교 (Before/After)를 하지 않음 (Ch.2에서)
- DDD Building Block을 상세히 설명하지 않음 (Part 2에서)

## 서사 구조: 3막

**섹션 비중**: 1막 30% / 2막 30% / 3막 30% / 로드맵 10%

### 1막: Framework 중심 + 데이터 중심 개발의 한계

**목표**: 독자가 "나도 이런 경험 있어" 공감

다루는 문제:

1. **Framework 중심 학습의 반복**
   - Backend: Spring → NestJS, Frontend: React → Next.js
   - 새 프레임워크 나올 때마다 학습 비용 발생
   - Framework version up 시 코드 대량 변경

2. **데이터 중심 프로그래밍(MVC)의 한계**
   - 비즈니스 로직이 Controller/Service에 분산
   - 도메인 객체는 데이터 덩어리 (빈약한 모델)
   - 결과: 응집성 ↓ 복잡도 ↑ 유지보수 어려움

**두 문제의 관계**: Framework 중심 학습이 자연스럽게 데이터 중심 프로그래밍(MVC)으로 이어짐. 프레임워크가 제공하는 패턴(Controller → Service → Repository)을 따르다 보면 비즈니스 로직이 프레임워크 구조에 종속되는 인과 관계.

**톤**: 개발자 공감 서사. 코드 예제 없이 경험과 상황 묘사로 전개.

### 2막: AI 시대, 역할이 뒤바뀌다

**목표**: 문제에서 기회로 전환. "그렇다면 내가 집중해야 할 것은?"

핵심 논점:

1. **AI가 Framework을 나보다 잘함**
   - AI 코드 생성 도구(Cursor, Copilot, Claude Code 등)가 framework 코드를 빠르고 정확하게 생성
   - 예: NestJS CRUD 엔드포인트, React 컴포넌트 보일러플레이트, DB 마이그레이션 등
   - 개발자가 framework 세부사항에 시간 쏟을 이유가 줄어듦

2. **내 고유한 도메인 문제는 AI가 부족**
   - 일반 지식 기반 AI는 우리 비즈니스의 특수한 규칙, 제약, 맥락을 모름
   - 도메인 지식은 여전히 사람의 영역

3. **결론: 개발자의 역할 재정의**
   - Framework → AI에게 위임
   - Domain → 개발자가 집중
   - "내가 해결해야 하는 고유한 문제"에 시간을 써야 함

### 3막: SDD/DDD + TDD — AI 시대의 개발 방법론

**목표**: 시리즈 전체의 테제 선언. "이것이 해법이다."

3가지 축:

1. **Domain 중심 OOP (DDD)**
   - 데이터 덩어리가 아닌 행위를 가진 도메인 객체
   - 비즈니스 로직이 도메인에 응집 → 응집성 ↑ 복잡도 ↓
   - Building Block 미리보기: Entity, Value Object, Aggregate 등을 **각 1~2줄 정의**로 소개 (상세는 Part 2에서)

2. **Framework Agnostic + POJO**
   - 순수 TypeScript/JavaScript 객체(POJO)로 도메인 구현
   - NestJS, Spring, React 등 어떤 framework과도 독립
   - **TDD가 자연스러움**: 외부 의존성 없는 POJO → mock 없이 단위 테스트 가능

3. **SDD (Spec-Driven Development)**
   - SDD는 이 시리즈에서 사용하는 용어로, AI와 대화하며 **Spec을 먼저 정의**하는 개발 방식
   - BDD(Behavior-Driven Development)와 유사하지만, AI를 Spec 정의의 대화 상대로 활용하는 점이 차별점
   - Spec에서 TDD 테스트케이스가 자연스럽게 도출
   - TDD로 도메인 구현 검증
   - 워크플로우: AI와 Spec 정의 → TDD 테스트 작성 → 도메인 구현 → Framework 연동 (AI 보조)
   - Ch.1에서는 SDD 개념을 소개 수준으로 언급하고, Ch.8에서 실전 시연

**SDD + TDD + DDD 삼위일체 = AI 시대의 개발 방법론**이라는 테제 선언.

### 마무리: 시리즈 로드맵

- Part 1 (Ch.1~2): 왜 SDD/DDD인가 + Before/After 코드 증명
- Part 2 (Ch.3~7, Ch.8 선택): 도메인 Building Blocks — Spec → TDD → 구현 사이클
- Part 3 (Ch.9~11): NestJS/Next.js 연동 + 프론트엔드 DDD
- Part 4 (Ch.12): 워크플로우 총정리

"다음 글에서는 같은 요구사항을 데이터 중심 vs 도메인 중심으로 나란히 구현해서 코드로 증명합니다."

## 코드 예제 정책

- Ch.1은 **코드 최소화**
- 개념 설명 시 필요하면 의사코드(pseudocode) 수준의 짧은 스니펫만 허용
- 본격 Before/After 코드 비교는 **Ch.2**에서

## 제목

```
[TypeScript DDD] Ch.1: Framework에서 Domain으로, AI 시대의 개발 방법론
```

## 메타데이터

| 항목 | 내용 |
|------|------|
| 독자 | 주니어~미드 개발자 (Framework 경험 있고, DDD 입문) |
| 톤 | 개발자 공감 서사 → 방법론 제안 |
| 분량 | 중간 (읽는 데 10~15분) |
| 코드 | 최소 (의사코드 수준) |
| 언어 | 한국어 기본, 기술 용어(SDD, DDD, TDD, POJO, Framework 등)는 영문 |

## 기존 시리즈 spec과의 관계

- 시리즈 전체 설계(`2026-03-24-typescript-ddd-blog-series-design.md`)는 유지하되, 아래 변경점을 반영 필요:
  - 시리즈 키워드: "Spec+TDD+DDD" → **"SDD/DDD + TDD"** (SDD를 정식 용어로 도입)
  - Ch.1 제목: "MVC에서 DDD로, 그리고 AI 시대의 발견" → **"Framework에서 Domain으로, AI 시대의 개발 방법론"**
  - Ch.1 문제 정의: "MVC 한계" → **"Framework 중심 + 데이터 중심 개발의 한계"**
  - Ch.1 코드 정책: 인라인 코드 예제 → **코드 최소화, 서사 중심**
- Ch.2 이후 구조는 기존 spec 유지
- 부모 spec 업데이트는 Ch.1 완성 후 일괄 반영
