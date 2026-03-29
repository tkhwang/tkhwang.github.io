---
title: "[SDD+TDD+DDD] Ch.4: DDD란 무엇인가 (2) — 저장과 협력 구조"
pubDate: 2026-03-27
description: "Domain Service, Repository, Mapper, Domain Event를 중심으로 DDD의 두 번째 핵심 개념을 정리합니다"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["ddd", "typescript", "ai", "architecture", "sdd"]
---

이 글은 **[SDD+TDD+DDD] 시리즈**의 네 번째 글입니다. <br />

Ch.3에서는 DDD의 첫 번째 묶음으로 `Bounded Context`, `Ubiquitous Language`, `Value Object`, `Entity`, `Aggregate`를 정리했습니다. 이제 남은 질문은 이것입니다. **그 객체들은 저장 구조와 다른 모듈과의 협력 안에서 어떻게 이어질까?**

이번 글에서는 DDD 이론의 두 번째 묶음으로 `Domain Service`, `Repository`, `Mapper`, `Domain Event`를 설명하겠습니다. 이 개념들은 실제 설계와 구현으로 들어갈 때 특히 많이 부딪히는 부분입니다. 아직 이 글에 넣지 않은 주제들은 뒤 챕터에서 실제 예제와 함께 더 추가할 예정입니다.

## Domain Service — 한 객체에 넣기 애매한 규칙

모든 비즈니스 규칙이 Entity나 Value Object 안에 깔끔하게 들어가지는 않습니다.

예를 들어 이런 경우가 있습니다.

- 두 고객 간 포인트를 이전할 때, 보내는 쪽의 잔액과 받는 쪽의 한도를 함께 판단해야 한다
- 고객 등급 산정 시 주문 이력, 포인트, 가입 기간 등 여러 Entity의 정보를 종합해야 한다
- 한 객체의 책임으로 보기 어려운 정책 판단이 있다

이럴 때는 `Domain Service`를 씁니다. 중요한 점은 이름보다 역할입니다. `Domain Service`는 **도메인 규칙을 담지만, 특정 Entity 하나의 책임으로 귀속시키기 어려운 로직**을 맡습니다.

다만 `Domain Service`를 남용하면 주의해야 합니다. 결국 모든 비즈니스 로직이 Service에 몰리면서 Entity와 Value Object가 다시 빈약한 모델로 돌아갈 수 있기 때문입니다. `Domain Service`는 도메인 모델을 대체하는 것이 아니라, 한 객체의 책임으로 넣기 어려운 규칙만 보조적으로 맡아야 합니다.

여기서 `Application Service`와도 구분할 필요가 있습니다. `Domain Service`가 도메인 규칙 자체를 다루는 반면, `Application Service`는 유스케이스의 흐름을 조율합니다. 이 둘의 차이는 뒤에서 Command, Usecase, Application Service를 설명할 때 더 분명해집니다.

## Repository — 저장 기술이 아니라 도메인 관점의 입구

Repository도 자주 오해되는 개념입니다. DDD에서 Repository는 단순한 DB 유틸리티가 아닙니다. **도메인 객체를 저장하고 다시 불러오는 통로**입니다.

중요한 것은 보통 두 가지입니다.

- 인터페이스는 도메인 쪽에 둔다
- 실제 구현은 인프라 쪽에 둔다

왜 이렇게 나눌까요? 그대로 두면 도메인 코드가 Prisma, TypeORM, SQL 같은 인프라 기술에 직접 의존하기 쉽기 때문입니다. 그렇게 되면 가장 오래 살아남아야 할 도메인 레이어가, 가장 자주 바뀌는 하위 레이어에 끌려가게 됩니다.

그래서 DDD에서는 의존성 역전(DIP)을 적용합니다. 도메인이 필요한 저장 계약을 인터페이스로 정의하고, 실제 구현은 인프라 레이어에서 그 계약을 구현합니다.

예를 들어 도메인에서는 이렇게 생각합니다.

- `CustomerRepository`가 고객을 저장하고 조회한다
- `ContentRepository`가 콘텐츠 Aggregate를 저장하고 조회한다

하지만 이것이 Prisma인지, TypeORM인지, SQL인지, 메모리 저장소인지는 도메인이 알 필요가 없습니다. Repository는 저장 기술을 감추는 추상화이기도 하지만, 더 본질적으로는 **도메인 모델이 세상과 연결되는 입구**입니다.

## Mapper — 서로 다른 모델 사이를 번역하는 역할

Repository 바로 옆에서 자주 함께 등장하는 개념이 `Mapper`입니다. Mapper는 도메인 모델, DB 모델, DTO처럼 **서로 다른 형태의 모델 사이를 변환하는 역할**을 맡습니다.

예를 들어 DB에서 읽어 온 `name: string`, `email: string`, `points: number`를 도메인 안에서는 `Name`, `Email`, `RewardPoints`로 바꾸고, 반대로 도메인 객체를 저장할 때는 다시 DB가 이해할 수 있는 기본형 필드로 풀어 주는 식입니다.

예전에는 이런 매핑 코드가 반복적이고 귀찮게 느껴져서, "그냥 모델을 하나로 통일하면 안 되나?"라는 생각으로 다시 DB 중심 구조로 돌아가기 쉽기도 했습니다. 실제로 많은 사람이 DDD를 어렵게 느끼는 이유 중 하나가 바로 이 변환 비용입니다.

하지만 AI 시대에는 이 지점의 부담이 예전보다 훨씬 줄었습니다. Mapper는 창의적인 비즈니스 규칙보다는, 이미 정해진 도메인 구조를 다른 형태로 옮기는 반복 작업에 가깝습니다. 이런 종류의 코드는 AI가 비교적 안정적으로 초안을 만들기 좋습니다.

그래서 지금은 매핑 코드가 귀찮다는 이유만으로 도메인 모델링을 포기해야 할 이유가 예전보다 작아졌습니다. 오히려 **도메인 규칙은 사람과 도메인 모델에 남기고, 반복적인 변환 작업은 AI의 도움을 받는 구조**가 훨씬 자연스러워졌습니다.

## Command, Usecase, Application Service — 외부 요청에서 도메인 실행까지

지금까지 설명한 Domain Service, Repository, Mapper는 모두 도메인 내부의 역할입니다. 그렇다면 **외부에서 들어오는 요청은 어디서 받아서, 어떻게 도메인까지 전달될까요?**

이 흐름을 이해하려면 세 가지 개념을 함께 보는 것이 좋습니다.

### Command — 상태를 바꾸는 요청

사용자가 "이 콘텐츠를 완료 처리해줘"라고 요청한다면, 그 의도를 데이터로 표현한 것이 `Command`입니다. 예를 들어 `CompleteContent { contentId: "abc-123" }` 같은 형태입니다.

Command는 도메인 로직 자체가 아니라, **"무엇을 바꿔달라"는 요청**입니다. 콘텐츠를 북마크하거나, 소비를 완료하거나, 평가를 남기는 것처럼 **도메인의 상태를 변경하는 의도**를 담습니다.

### Query — 상태를 읽기만 하는 요청

반면 "북마크한 콘텐츠 목록을 보여줘", "이번 주 소비 통계를 알려줘" 같은 요청은 `Query`입니다. 상태를 바꾸지 않고 **현재 상태를 조회만 하는 요청**입니다.

Command와 Query를 구분하는 이유는, 둘의 흐름이 다르기 때문입니다. Command는 도메인 규칙을 실행하고 Domain Event를 발행하지만, Query는 데이터를 읽어서 돌려줄 뿐입니다. 이 둘을 명확히 나누는 설계(CQRS)는 Ch.19에서 더 자세히 다룹니다. 

### Usecase — 하나의 비즈니스 작업 단위

Command가 "무엇을 해달라"는 의도라면, Usecase는 **"그 의도를 완수하기 위해 필요한 작업의 단위"** 입니다. 예를 들어 "콘텐츠 소비 완료하기"는 하나의 Usecase입니다.

Usecase 안에는 보통 이런 절차가 있습니다.

- Repository에서 Aggregate를 꺼낸다
- 도메인 객체에게 규칙 실행을 위임한다
- 결과를 저장한다
- 필요하면 Domain Event를 발행한다

### Application Service — Usecase를 구현하는 곳

Application Service는 이 Usecase를 실제로 구현하는 레이어입니다. 즉 Command를 받아서 위의 절차를 순서대로 조율합니다.

여기서 중요한 점은, Application Service가 **도메인 규칙을 직접 실행하지 않는다**는 것입니다. 상태 전이가 가능한지, 평가를 줄 수 있는지 같은 판단은 Entity나 Value Object, Domain Service가 맡습니다. Application Service는 그 객체들을 꺼내고, 호출하고, 저장하는 **조율자** 역할만 합니다.

### 흐름을 이어서 보면

이 세 개념을 합치면, 외부 요청이 도메인을 거쳐 결과로 이어지는 전체 흐름이 보입니다.

1. **Command**가 외부 의도를 전달한다
2. **Application Service**가 그 의도를 받아 **Usecase**를 실행한다
3. Repository에서 Aggregate를 꺼내고, 도메인 객체에게 규칙 실행을 위임한다
4. 결과를 저장하고, **Domain Event**를 발행한다

즉 Command가 입력이고, Domain Event가 출력입니다. 그리고 그 사이를 Application Service가 조율합니다. 이 흐름을 알면 바로 다음에 설명할 Domain Event가 **왜 필요한지**도 더 분명해집니다.

## Domain Event — 분리된 Aggregate를 느슨하게 연결하는 신호

DDD를 조금 더 진행하다 보면, 하나의 Aggregate 안의 규칙만으로는 끝나지 않는 순간이 옵니다. 어떤 Aggregate에서 일어난 중요한 변화가 다른 Aggregate나 다른 기능에도 영향을 주기 때문입니다. 이럴 때 자주 사용하는 것이 `Domain Event`입니다.

Domain Event는 말 그대로 **도메인에서 의미 있는 일이 일어났다는 사실**을 표현하는 이벤트입니다. 예를 들어 `Content` Aggregate에서 소비 완료가 일어났다면 `ContentCompleted` 같은 이벤트를 발행할 수 있습니다.

이 방식의 장점은, 서로 분리된 Aggregate들이 직접 서로를 호출하지 않고도 협업할 수 있다는 점입니다. 데이터 중심 구조에서는 이런 후속 작업이 보통 Service 레이어에 모입니다. 예를 들어 `contentService.complete()` 안에서 통계 서비스도 호출하고, 추천 서비스도 호출하고, 알림 서비스도 직접 호출하는 식입니다.

처음에는 단순해 보이지만, 시간이 지나면 하나의 Service가 여러 기능을 알고 있어야 하고, 변경이 생길 때마다 연쇄적으로 수정이 퍼지면서 코드가 강하게 결합되기 쉽습니다.

반면 Domain Event를 사용하면 `Content` Aggregate는 "콘텐츠가 완료되었다"는 사실만 알리고, 그 이후 무엇을 할지는 바깥의 다른 모듈이 이벤트를 받아 스스로 결정하게 만들 수 있습니다. 이렇게 하면 Aggregate 사이의 결합은 느슨해지고, 각 모듈은 자기 책임 안에 더 잘 머물 수 있습니다.

즉 도메인 이벤트는 **분리된 Aggregate가 loosely coupled하게 협업하게 만드는 수단**이라고 볼 수 있습니다.

물론 모든 것을 이벤트로 풀어야 한다는 뜻은 아닙니다. 같은 Aggregate 안에서 즉시 함께 지켜야 하는 규칙은 여전히 Aggregate 내부에서 처리해야 합니다. Domain Event는 그 경계 안의 규칙을 지킨 뒤, 그 결과를 경계 밖에 알리고 다른 모듈이 반응하게 만들 때 특히 힘을 발휘합니다.

## DDD가 처음에는 어려운 이유

여기까지 읽으면 한편으로는 이런 생각이 들 수 있습니다. "결국 예전에는 Service 레이어에서 하던 일을, Value Object, Entity, Aggregate, Repository, Mapper 같은 더 많은 개념과 파일로 나누는 것 아닌가?" 어느 정도는 맞는 느낌입니다.

데이터 중심 구조에서는 많은 규칙이 Service 레이어에 모여 있었지만, DDD에서는 그것들이 **주체적인 작은 Building Block**으로 분리됩니다. 그 결과 소스 코드 파일도 더 작은 단위로 나뉘고, 처음에는 오히려 장황하거나 복잡하게 느껴질 수 있습니다.

실제로 이 러닝 커브는 DDD를 적용할 때 많은 사람이 겪는 큰 어려움 중 하나입니다. 이런 개념이 아직 손에 익지 않은 상태에서는, Value Object, Entity, Aggregate, Repository, Mapper 같은 분리가 오히려 소스를 더 보기 어렵게 만들 수도 있습니다.

하지만 이 분리는 그냥 쪼개기 위한 분리가 아닙니다. **서로 연관되지 않아야 할 것들이 섞이지 않도록, 응집력이 높아지게 분리한 결과**입니다. 처음에는 낯설고 번거롭게 느껴질 수 있지만, 익숙해지고 나면 변경이 생겼을 때 어디를 봐야 하는지가 오히려 더 분명해집니다.

## 여기까지가 DDD 두 번째 묶음이다

정리하면 이번 글에서 소개한 DDD의 두 번째 핵심 어휘는 다음과 같습니다.

- **Domain Service**: 특정 객체 하나로 귀속시키기 어려운 도메인 규칙
- **Repository**: 도메인 객체를 저장하고 불러오는 입구
- **Mapper**: 도메인 모델과 DB/DTO 모델 사이를 변환하는 역할
- **Command / Usecase / Application Service**: 외부 요청을 받아 도메인 실행을 조율하는 흐름
- **Domain Event**: 도메인에서 일어난 중요한 변화를 바깥에 알리는 신호

이제 DDD 기본 어휘는 한 번 훑었습니다. 다음 단계는 이 개념을 실제 서비스 요구사항에 적용해 보는 것입니다.

## 다음 글에서는

다음 글(Ch.5)에서는 실제 서비스의 문제를 정의하고 요구사항을 PRD로 정리합니다. 그리고 Ch.6에서 그 PRD를 `Bounded Context -> Aggregate -> Entity -> Value Object` 순서로 top-down 분해합니다.

즉 흐름은 이렇게 이어집니다.

1. 이번 글: 더 큰 경계와 협력 구조를 이해한다
2. 다음 글: 실제 요구사항을 top-down으로 분해한다
3. 그다음 글: 작은 객체의 규칙을 Spec으로 정리한다
4. 그다음 글: 그 Spec을 TDD로 구현한다
