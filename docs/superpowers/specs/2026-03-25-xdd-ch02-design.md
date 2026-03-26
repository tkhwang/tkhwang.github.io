# SDD+TDD+DDD Ch.2 설계: 사고방식 비교 — 데이터 위주 vs 객체 위주

## 개요

Ch.2는 시리즈의 **사고방식 전환 챕터**. Ch.1에서 서사로 논증한 "프레임워크 중심 → 도메인 중심" 전환을, 두 가지 사고방식의 모델링 차이로 구체적으로 보여준다. 기본형 vs Value Object 비교로 시작해서, 주문 관리 도메인의 Before/After로 확장.

## 핵심 테제

**"같은 요구사항, 다른 사고방식. 모델링이 코드의 모든 것을 바꾼다."**

- 데이터 위주 사고방식: 기본형 사용, DB 우선, Service에 로직 분산
- 객체 위주 사고방식: Value Object + Entity, 도메인 우선, 객체에 로직 응집

## 출력 파일

- **파일명**: `src/content/posts/xdd-ch02-same-requirements-different-code.md`
- **Frontmatter**:

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

## Non-Goals

- 실행 가능한 코드 제공 (의사코드 수준으로 제한)
- DDD Building Block의 상세 설명 (Part 2에서)
- 프레임워크 연동 코드 (Part 3에서)
- SDD 워크플로우 실전 시연 (Ch.8에서)

## 예제 도메인

**주문 관리**: 주문 상태 변경 + VIP 환불 정책

### 비즈니스 규칙

1. **주문 상태 전이**: `생성됨 → 결제완료 → 배송중 → 배송완료`
2. **환불 규칙**:
   - `결제완료` 상태에서만 환불 가능
   - `배송중` 이후에는 환불 불가
   - VIP 고객은 `배송완료` 후에도 7일 이내 환불 가능
3. **주문 금액 계산**: 상품 금액 + 배송비 (VIP는 배송비 무료)

### 이 예제를 선택한 이유

- 상태 전이 → Value Object(OrderStatus)와 Entity(Order)의 필요성을 자연스럽게 보여줌
- VIP 환불 정책 → 비즈니스 로직의 위치(Service vs 도메인 객체)가 핵심 차이를 만듦
- Part 2의 Building Block(Value Object, Entity)으로 직결

## 서사 구조: 5막

**섹션 비중**: 모델링 도입 15% / 요구사항 10% / Before 25% / After 25% / 비교+마무리 25%

### 1막: 모델링이 왜 중요한가 (~15%)

기본형 vs Value Object 비교로 사고방식의 차이를 먼저 보여줌.

- Customer 클래스 한눈에 비교: `string/number` vs `Name/Email/Money`
- **Name**: 빈 문자열 불가, 최대 길이, 자동 트리밍
- **Money**: 음수 불가, 통화 단위, 안전한 연산
- **Email**: 형식 검증, 자동 정규화
- 비교표: 유효성 검증, 비즈니스 규칙, 잘못된 값, 의미

### 2막: 요구사항 정의 (~10%)

주문 관리 도메인으로 본격 비교 시작.

### 3막: Before — 데이터 위주 사고방식 (~25%)

3단계로 문제점을 드러냄:

#### 3-1. 데이터 모델 — 기본형 + DB 우선

- Order는 DB 테이블과 1:1 매핑된 interface — 행위 없음
- status는 `string`, price는 `number` — 기본형 그대로
- 빈혈 도메인 모델(Anemic Domain Model)

#### 3-2. 비즈니스 로직 — Service에 분산

- OrderService, PaymentService에 환불 규칙 중복
- 절차적 if/else로 비즈니스 규칙 나열

#### 3-3. 테스트 — Mock이 절반

- 인프라 의존성 때문에 mock 필수
- 비즈니스 규칙 검증이 mock 설정에 묻힘

### 4막: After — 객체 위주 사고방식 (~25%)

Before와 1:1 대응:

#### 4-1. 도메인 모델 — Value Object + Entity

- OrderStatus Value Object: 상태 전이 규칙을 스스로 판단
- Order Entity: 데이터 + 행위를 함께 가짐

#### 4-2. 비즈니스 로직 — 도메인에 응집

- Application Service는 오케스트레이션만 담당
- 비즈니스 규칙 코드 zero

#### 4-3. 테스트 — Mock 없이 바로 검증

- POJO라서 외부 의존성 zero
- 테스트 코드가 곧 비즈니스 규칙의 문서

### 5막: 비교 정리 + 다음 단계 (~25%)

#### 5-1. 핵심 차이 요약표

| 관점 | 데이터 위주 사고방식 | 객체 위주 사고방식 |
|------|---------------------|-------------------|
| 모델링 | 기본형 (string, number) | Value Object + Entity |
| 설계 출발점 | DB 스키마 우선 | 도메인 규칙 우선 |
| 비즈니스 로직 | Service에 분산 | 도메인 객체에 응집 |
| 테스트 | Mock 필수 | POJO라서 Mock 불필요 |
| 프레임워크 의존성 | 강결합 | 독립 (Framework Agnostic) |

#### 5-2. SDD 워크플로우 미리보기

Spec → Test → Implementation 사이클 소개.

#### 5-3. 시리즈 다음 단계

"다음 글(Ch.3)에서는 이 객체 위주 사고방식을 SDD로 실천하는 방법을 보여드립니다."

## 코드 예제 정책

- **의사코드 수준**: TypeScript 문법을 따르되 실행 불가해도 무방
- 핵심 개념 전달에 집중, 보일러플레이트 생략
- Before/After 코드는 동일한 형식으로 1:1 대응

## 메타데이터

| 항목 | 내용 |
|------|------|
| 독자 | 주니어~미드 개발자 (MVC 경험, DDD 입문) |
| 톤 | Ch.1의 공감 서사 이어가되, 코드와 균형 |
| 분량 | 중간 (읽는 데 10~15분) |
| 코드 | 의사코드 수준 (Before/After 대응) |
| 언어 | 한국어 기본, 기술 용어는 영문 |
