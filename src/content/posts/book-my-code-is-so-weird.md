---
title: "[book] '내 코드가 그렇게 이상한가요?' 에서 배우는 좋은 코드 설계 입문"
pubDate: 2025-11-01
description: "데이터 클래스의 한계를 짚고 생성자 유효성, 불변 값 객체, 팩토리 메서드로 응집도를 높이는 설계 원칙을 정리"
author: "tkhwang"
featured: false
image:
  url: ""
  alt: ""
tags: ["design"]
---

예전에 읽었던 책 [내 코드가 그렇게 이상한가요?](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=317906454&start=pcsearch_recen)인데, 생각한 것보다 내용이 좋아서 다시 읽어 보면서 내용을 정리해 보았습니다. <br />
전체 내용을 정리하기보다 저에게 새롭고 울림이 있었던 내용을 중심으로 정리해 보았습니다.



## 1장: 잘못된 구조의 문제 깨닫기

### 1.3 수많은 악마를 만들어 내는 데이터 클래스

데이터를 갖고 있기만 하는 `데이터 클래스` 정의

```java
public class ContractAmount {
    public int amountIncludingTax;
    public BigDecimal salesTaxRate;
}
```

이 책에서는 이러한 데이터만 있는 클래스에 의존하면 많은 문제점을 유발한다고 지적하며, 제대로 된 객체 지향 설계를 향해 나아가도록 차근차근 설명하고 있습니다.

## 3장: 클래스 설계: 모든 것과 연결되는 설계 기반

### 3.1 클래스 단위로 잘 동작하도록 설계하기

클래스 단위로 잘 동작하게 설계해야 한다. 클래스 하나로도 잘 동작할 수 있도록 설계해야 한다.

* 인스턴스 `변수`
* 인스턴스 변수에 잘못된 값이 할당되지 않게 막고, 정상적으로 조작하는 `메서드`

앞의 데이터 클래스의 폐해들

* 인스턴스 변수를 조작하는 로직이 다른 클래스에 구현됨.
* 인스턴스를 생성하더라도 인스턴스 변수들은 아직 유효하지 않은 상태
* 인스턴스 변수에 잘못된 값이 쉽게 들어갈 수 있는 문제

데이터 클래스에 **자기 방어 임무**를 부여하여 다른 클래스에 맡기던 일을 **스스로 할 수 있게 설계**해야 한다.

### 3.2 성숙한 클래스로 성장시키는 설계 기법

`Money` 라는 미성숙한 데이터 클래스

```java
class Money {
    int amount;
    Currency currency;
}
```

#### 3.2.1 생성자로 확실하게 정상적인 값 설정하기

클래스 인스턴스를 생성하는 시점에 인스턴스 변수가 **정상적인 값**을 갖도록 해야 한다.

```java
class Money {
    int amount;
    Currency currency;

    public Money(int amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }
}
```

잘못된 값이 유입되지 못하게 **유효성 검사**를 생성자 내부에서 수행해야 한다.

```java
class Money {
    int amount;
    Currency currency;

    public Money(int amount, Currency currency) {
        if (amount < 0) {
            throw new IllegalArgumentException("금액은 0 이상의 값을 지정해주세요.");
        }
        if (currency == null) {
            throw new NullPointerException("통화 단위를 지정해주세요.");
        }

        this.amount = amount;
        this.currency = currency;
    }
}
```

#### 3.2.2 계산 로직도 데이터를 가진 쪽에서 구현하기

데이터 클래스를 이용해 외부에서 계산하던 로직을 클래스 메서드에 구현하자.

```java
  void add(int other) {
    amount += other;
  }
```

#### 3.2.3 불변 변수로 만들어서 예상하지 못한 동작 막기

final 수식자를 이용해서 값을 한 번 할당하면 다시 변경할 수 없도록 하자.
 
```java
class Money {
    final int amount;
    final Currency currency;

    // guard : validation logic
    ...

    public Money(int amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }
}
```

#### 3.2.4 변경하고 싶다면 새로운 인스턴스 만들기

```java
class Money {
    // ...
    Money add(int other) {
        int added = amount + other;
        return new Money(added, currency);
    }
}
```

#### 3.2.5 메서드 매개변수와 지역 변수도 불변으로 만들기

```java
void doSomething(final int value) {
    value = 100; // error
}
```

```java
class Money {
    ...
    Money add(final int other) {
        final int added = amount + other;
        return new Money(added, currency);
    }
}
```

#### 3.2.6 엉뚱한 값을 전달하지 않도록 하기 

기본 자료형 대신에 좀 더 의미 있는 독자적인 자료형을 사용할 것

```java
class Money {
    ...
    Money add(final Money other) {
        final int added = amount + other.amount;
        return new Money(added, currency);
    }
}
```

### 3.4 프로그램 구조의 문제 해결에 도움을 주는 디자인 패턴

* 완전 생성자
* 값 객체
* 전략
* 정책
* 일급 컬렉션
* 스프라우트 클래스

향후 각각에 대해서 자세하게 설명 예정

## 5장 응집도: 흩어져 있는 것들

### 5.1 `static` 메서드 오용

static 메서드 오용으로 응집도가 낮아지는 경우가 있음. <br />
static 메서드는 데이터 클래스와 함께 사용하는 경우가 꽤 많음.

#### 5.1.4 왜 static 메서드를 사용할까 ?

객체 지향 언어를 사용할 때, 절차 지향 언어의 접근 방법을 사용하려 하기 때문.

#### 5.1.5 어떠한 상황에서 static 메서드를 사용해야 좋을까 ?

응집도의 영향을 받지 않는 경우에는 static 메서드를 사용해도 괜찮습니다. <br />
**팩토리 메서드**도 static 메서드로 설계하는 것이 좋습니다.

### 5.2 초기화 로직 분산

온라인 쇼핑몰 또는 결제 서비스에서는 신규 가입 시 무료로 포인트를 제공하는 경우가 있는데, 이를 위해 기프트 포인트를 값 객체로 설계한 예입니다.

```java
class GiftPoint {
    private static final int MIN_POINT = 0;
    final int value;

    GiftPoint(final int point) {
        if (point < MIN_POINT) throw new IllegalArgumentException();

        value = point;
    }

    GiftPoint add(final GiftPoint other) {
        return new GiftPoint(value + other.value);
    }

    boolean isEnough(final ConsumptionPoint point) {
        return point.value <= value;
    }

    GiftPoint consume(final ConsumptionPoint point) {
        if (!isEnough(point)) throw new IllegalArgumentException();

        return new GiftPoint(value - point.value);
    }
}
```

표준 회원으로 가입 시 3000 포인트를 제공하는 코드

```java
GiftPoint standardMembershipPoint = new GiftPoint(3000);
```

프리미엄 회원으로 신규 가입했을 때 10000 포인트를 부여하는 코드 

```java
GiftPoint premiumMembershipPoint = new GiftPoint(10000);
```

생성자를 `public` 으로 만들면 의도하지 않은 용도로 사용될 수 있고, 결과적으로 관련된 로직이 분산되기 때문에 유지 보수가 힘들어진다. <br />
회원 가입 포인트를 변경할 때 소스 코드 전체를 확인해야 함.

#### 5.2.1 private 생성자 + 팩토리 메서드를 사용해 목적에 따라 초기화하기

```java
class GiftPoint {
    private static final int MIN_POINT = 0;
    private static final int STANDARD_MEMBERSHIP_POINT = 3000;
    private static final int PREMIUM_MEMBERSHIP_POINT = 10000;
    final int value;

    private GiftPoint(final int point) {
        if (point < MIN_POINT) throw new IllegalArgumentException("포인트는 0 이상이어야 합니다.");

        value = point;
    }

    static GiftPoint forStandardMembership() {
        return new GiftPoint(STANDARD_MEMBERSHIP_POINT);
    }

    static GiftPoint forPremiumMembership() {
        return new GiftPoint(PREMIUM_MEMBERSHIP_POINT);
    }
}
```

신규 가입 포인트와 관련된 로직이 GiftPoint 클래스에 응집됩니다.

```java
GiftPoint standardMembershipPoint = GiftPoint.forStandardMembership();
GiftPoint premiumMembershipPoint = GiftPoint.forPremiumMembership();
```

#### 5.2.2 생성 로직이 너무 많아지면 팩토리 클래스를 고려해보자

많은 생성 로직으로 해당 클래스가 하는 일이 불분명해지는 경우에는 **생성 전용 팩토리 클래스**를 분리하는 방법을 고려할 것

### 5.3 범용 처리 클래스 (Common/Util)

static 메서드를 빈번하게 볼 수 있는 클래스로 **범용 처리**를 위한 클래스가 있습니다. 일반적으로 `Common`, `Util`이란 이름을 갖습니다.

```java
class Common {
    static BigDecimal calcAmountIncludingTax(BigDecimal amount, BigDecimal taxRate) {
        return amount.add(amount.multiply(taxRate));
    }
}
```

#### 5.3.1 너무 많은 로직이 한 클래스에 모이는 문제

이렇게 범용 처리 클래스에 너무 많은 메서드가 있는 경우, 근본적인 원인은 **범용의 의미와 재사용성**을 잘못 이해하고 있기 때문입니다. 재사용성은 설계의 응집도를 높이면 저절로 높아집니다.

```java
class Common {
    static BigDecimal calcAmountIncludingTax(BigDecimal amount, BigDecimal taxRate) { ... }

    static boolean hasResigned(User user) { ... }

    static void createOrder(Product product) { ... }

    static boolean isValidPhoneNumber(String phoneNumber) { ... }
    ...
}
```

#### 5.3.2 객체 지향 설계의 기본으로 돌아가기

꼭 필요한 경우가 아니면, 범용 처리 클래스를 만들지 않는 것이 좋습니다.

```java
class AmountIncludingTax {
    final BigDecimal value;

    AmountIncludingTax(final AmountExcludingTax amountExcludingTax, final TaxRate taxRate) {
        value = amountExcludingTax.value.multiply(taxRate.value);
    }
}
```

#### 5.3.3 횡단 관심사

로그 출력, 오류 확인과 같이 다양한 상황에서 넓게 활용되는 기능인 **횡단 관심사**에 해당하는 기능이라면 범용 코드로 만들어도 괜찮습니다.

* 로그 출력
* 오류 확인
* 디버깅
* 예외 처리
* 캐시
* 동기화
* 분산 처리

### 5.4 결과를 리턴하는 데 매개변수를 사용하지 않기

`shift` 메서드는 게임 캐릭터의 위치를 이동시키는 메서드입니다. 이동 대상 인스턴스를 매개변수 `location`으로 전달받고 이를 변경하고 있음. 이렇게 출력으로 사용되는 매개변수를 **출력 매개변수**라고 합니다.

이 경우 데이터 조작 대상은 `Location`, 조작 로직은 `ActorManager`로 나뉘어 응집도가 낮은 구조입니다.

```java
class ActorManager {
    ...
    void shift(Location location, int shiftX, int shiftY) {
        location.x += shiftX;
        location.y += shiftY;
    }
}
```

출력 매개변수를 설계하지 말고, 객체 지향 설계의 기본으로 돌아가서 데이터와 데이터를 조작하는 논리를 갖는 클래스에 배치합시다.

```java
class Location {
    final int x;
    final int y;

    Location(final int x, final int y) {
        this.x = x;
        this.y = y;
    }

    Location shift(final int shiftX, final int shiftY) {
        final int newX = x + shiftX;
        final int newY = y + shiftY;
        return new Location(newX, newY);
    }
}
```

#### 5.5.1 기본 자료형에 대한 집착

프로그래밍 언어가 표준적으로 제공하는 자료형인 **기본 자료형**을 남용하는 현상을 **기본 자료형 집착**이라고 합니다.
기본 자료형만을 써온 개발자는 클래스 설계를 고려하지 않은 경우가 많습니다. 

기본 자료형으로만 구현하면 검증 로직 등이 중복 코드로 많이 생기고, 계산 로직이 분산되기 쉽습니다.
또한, 관련 있는 데이터와 로직을 집약하기 힘듭니다.

### 5.5.2 의미있는 단위는 모두 클래스로 만들기

매개변수가 많으면 하나하나를 매개변수로 다루지 말고, 그 데이터를 인스턴스 변수로 갖는 클래스를 만들고 활용하는 설계로 변경해보세요.

```java
class MagicPoint {
    // 현재 잔량
    int currentAmount;

    // 원래 최댓값
    int originalMaxAmount;

    // 장비 착용에 따른 최대값 증가량
    List<Integer> maxIncrements;
}
```

매직포인트 최댓값 계산과 회복 메서드를 클래스 안에서 정의하여 응집도를 높입니다.

```java
void recover(final int recoveryAmount) {
    currentAmount = Math.min(currentAmount + recoveryAmount, originalMaxAmount);
}

void consume(final int consumeAmount) { ... }
```

매개변수가 많으면 데이터 하나하나를 매개변수로 다루지 말고, 그 데이터를 인스턴스 변수로 갖는 클래스를 만들고 활용하는 설계로 변경해보세요.

#### 5.6.1 묻지 말고 명령하기

소프트웨어 설계에는 `묻지 말고, 명령하기`라는 유명한 격언이 있습니다. 이는 다른 객체의 내부 상태(변수)를 기반으로 판단하거나 제어하려고 하지 말고, **메서드로 명령**해서 **객체가 알아서 판단하고 제어하도록 설계**하라는 의미입니다.


## 6장: 조건 분기: 미궁처럼 복잡한 분기 처리를 무너뜨리는 방법

### 6.1 조건 분기가 중첩되어 낮아지는 가독성

RPG 마법 발동을 예로 **조건 분기 중첩**에 대해 설명 <br />
중첩을 하면 코드의 가독성이 크게 떨어지는 문제가 있음.

```java
if (0 < member.hitPoint) {
    if (member.canAct()) {
        if (magic.costMagicPoint <= member.magicPoint) {
            member.consumeMagicPoint(magic.costMagicPoint);
            member.chant(magic);
        }
    }
}
```

### 6.1.1 조기 리턴으로 중첩 제거하기

중첩 악마를 퇴치하는 방법 중 하나로 **조기 리턴**이 있습니다.<br />
조건 로직과 실행 로직을 분리할 수 있습니다.

```java
if (member.hitPoint <= 0) return;
if (!member.canAct()) return;
if (member.magicPoint < magic.costMagicPoint) return;

member.consumeMagicPoint(magic.costMagicPoint);
member.chant(magic);
```

### 6.2 switch 조건문 중복

switch 조건문은 악마를 불러들이기 굉장히 쉬운 제어 구문임.

#### 6.2.5 조건 분기 모으기

switch 조건문 중복을 해소하려면 **단일 책임 선택의 원칙**을 생각해 봐야 합니다.<br />
소프트웨어 시스템이 선택지를 제공해야 한다면, 그 시스템 내부의 어떤 한 모듈만으로 모든 선택지를 파악할 수 있어야 함.

switch 조건문 하나로 이름, 매직포인트 소비량, 공격력, 테크니컬 포인트 소비량을 모두 전환하고 있음.

```java
class Magic {
    final String name;
    final int costMagicPoint;
    final int attackPower;
    final int costTechnicalPoint;

    Magic(final MagicType magicType, final Member member) {
        switch (magicType) {
            case fire:
                name = "파이어";
                costMagicPoint = 2;
                attackPower = 20 + (int)(member.level * 0.5);
                costTechnicalPoint = 0;
                break;
            case lightning:
                name = "라이트닝";
                costMagicPoint = 5 + (int)(member.level * 0.2);
                attackPower = 50 + (int)(member.level * 1.5);
                costTechnicalPoint = 5;
                break;
            case hellFire:
                name = "헬파이어";
                costMagicPoint = 16;
                attackPower = 200 + (int)(member.magicAttack * 0.5 + member.vitality * 2);
                costTechnicalPoint = 20 + (int)(member.level * 0.4);
                break;
            default:
                throw new IllegalArgumentException("지원하지 않는 마법입니다.");
        }
    }
}
```

#### 6.2.6 인터페이스로 switch 조건문 중복 해소하기

단일 책임 선택의 원칙으로 switch 조건문을 하나만 사용하면 점차 클래스가 거대해지므로 관심사에 따라 작은 클래스로 분할하는 것이 중요합니다. <br />
이러한 문제를 해결할 때는 **인터페이스**를 사용합니다. 인터페이스를 사용하면 분기 로직을 작성하지 않고도 분기와 같은 기능을 구현할 수 있습니다.

```java
class Rectangle {
    private final double width;
    private final double height;

    ...

    double area() {
        return width * height;
    }
}
```

```java
class Circle {
    private final double radius;

    ...

    double area() {
        return radius * radius * Math.PI;
    }
}
```

Rectangle과 Circle 각각의 면적을 구하려면, area 메서드를 호출하여 계산 가능.

```java
rectangle.area();
circle.area();
```

메서드 이름 `area()`는 동일하지만 클래스가 서로 달라서 할당할 수 없음.

```java
void showArea(Object shape) {
    if (shape instanceof Rectangle) {
        ((Rectangle) shape).area();
    } else if (shape instanceof Circle) {
        ((Circle) shape).area();
    }
}
```

인터페이스를 사용하면 서로 다른 자료형을 같은 자료형처럼 사용할 수 있습니다.

```java
interface Shape {
    double area();
}
```

Rectangle과 Circle을 Shape 인터페이스 구현체로 만들어 봅시다.

```java
class Rectangle implements Shape {
    private final double width;
    private final double height;

    ...

    double area() {
        return width * height;
    }
}
```

```java
class Circle implements Shape {
    private final double radius;

    ...

    double area() {
        return radius * radius * Math.PI;
    }
}
```

이렇게 하면 Rectangle과 Circle을 **다형성** 덕분에 동일한 Shape 자료형으로 다룰 수 있습니다.

```java
Shape shape = new Circle(8);
shape.area();

shape = new Rectangle(8, 10);
shape.area();
```

면적을 구하는 코드는 Rectangle, Circle 클래스가 서로 다르지만 인터페이스를 사용하여 조건 분기를 따로 작성하지 않고 각각의 코드를 적절하게 실행할 수 있습니다.

```java
void showArea(Shape shape) {
    shape.area();
}

Rectangle rectangle = new Rectangle(8, 12);
showArea(rectangle);
```

#### 6.2.7 인터페이스를 switch 조건문 중복에 응용하기 (전략 패턴)

종류별로 다르게 처리해야 하는 기능을 인터페이스의 메서드로 정의하기

인터페이스의 큰 장점 중의 하나는 다른 로직을 같은 방식으로 처리할 수 있다는 점이다.<br />
각 클래스마다 다르게 처리하고 싶은 기능을 인터페이스 메서드로 정의합니다.

```java
interface Magic {
    String name();
    int costMagicPoint();
    int attackPower();
    int costTechnicalPoint();
}
```

마법 종류를 각각 클래스로 만듭니다.

```java
class Fire implements Magic {
    private final Member member;

    Fire(final Member member) {
        this.member = member;
    }

    public String name() {
        return "파이어";
    }

    public int costMagicPoint() {
        return 2;
    }

    public int attackPower() {
        return 20 + (int)(member.level * 0.5);
    }

    public int costTechnicalPoint() {
        return 0;
    }
}
```

```java
class Lightning implements Magic {
    private final Member member;

    Lightning(final Member member) {
        this.member = member;
    }

    public String name() {
        return "라이트닝";
    }

    public int costMagicPoint() {
        return 5 + (int)(member.level * 0.2);
    }

    public int attackPower() {
        return 50 + (int)(member.level * 1.5);
    }

    public int costTechnicalPoint() {
        return 5;
    }
}
```

```java
class HellFire implements Magic {
    private final Member member;

    HellFire(final Member member) {
        this.member = member;
    }

    public String name() {
        return "헬파이어";
    }

    public int costMagicPoint() {
        return 16;
    }

    public int attackPower() {
        return 200 + (int)(member.magicAttack * 0.5 + member.vitality * 2);
    }

    public int costTechnicalPoint() {
        return 20 + (int)(member.level * 0.4);
    }
}
```

이와 같이 구현하면 Fire, Lightning, HellFire 모두  `Magic` 자료형으로 활용할 수 있습니다.

##### switch 조건문이 아니라 Map 으로 변경하기

```java
final Map<MagicType, Magic> magics = new HashMap<>();

final Fire fire = new Fire(member);
final Lightning lightning = new Lightning(member);
final HellFire hellFire = new HellFire(member);

magics.put(MagicType.fire, fire);
magics.put(MagicType.lightning, lightning);
magics.put(MagicType.hellFire, hellFire);
```

대미지를 계산하기 위해 마법 공격력을 확인해야 하는 경우 Magic 인터페이스를 이용해서 공통으로 계산할 수 있습니다.
Map이 switch 조건문처럼 경우에 따라서 처리를 구분하는 것입니다.

```java
void magicAttack(final MagicType magicType) {
    final Magic usingMagic = magics.get(magicType);
    usingMagic.attackPower();
}
```

이렇게 **인터페이스를 사용**해서 처리를 한꺼번에 전환하는 설계를 **전략 패턴**이라고 합니다.

##### 값 객체화하기

위에서는 전략 패턴을 사용해서 switch 조건문 중복 문제를 해소하는 방법에 대해 살펴보았습니다. 

```java
interface Magic {
    String name();
    int costMagicPoint();
    int attackPower();
    int costTechnicalPoint();
}
```

현재 인터페이스에 기본형 int를 3개나 사용하고 있는데, 이를 각각의 값 객체로 변경해 보겠습니다.

```java
interface Magic {
    String name();
    MagicPoint costMagicPoint();
    AttackPower attackPower();
    TechnicalPoint costTechnicalPoint();
}
```


```java
class Fire implements Magic {
    private final Member member;

    Fire(final Member member) {
        this.member = member;
    }

    public String name() {
        return "파이어";
    }

    public MagicPoint costMagicPoint() {
        return new MagicPoint(2);
    }

    public AttackPower attackPower() {
        final int value = 20 + (int)(member.level * 0.5);
        return new AttackPower(value);
    }

    public TechnicalPoint costTechnicalPoint() {
        return new TechnicalPoint(0);
    }
}
```

```java
class Lightning implements Magic {
    private final Member member;

    Lightning(final Member member) {
        this.member = member;
    }

    public String name() {
        return "라이트닝";
    }

    public MagicPoint costMagicPoint() {
        final int value = 5 + (int)(member.level * 0.2);
        return new MagicPoint(value);
    }

    public AttackPower attackPower() {
        final int value = 50 + (int)(member.level * 1.5);
        return new AttackPower(value);
    }

    public TechnicalPoint costTechnicalPoint() {
        return new TechnicalPoint(5);
    }
}
```

```java
class HellFire implements Magic {
    private final Member member;

    HellFire(final Member member) {
        this.member = member;
    }

    public String name() {
        return "헬파이어";
    }

    public MagicPoint costMagicPoint() {
        return new MagicPoint(16);
    }

    public AttackPower attackPower() {
        final int value = 200 + (int)(member.magicAttack * 0.5 + member.vitality * 2);
        return new AttackPower(value);
    }

    public TechnicalPoint costTechnicalPoint() {
        final int value = 20 + (int)(member.level * 0.4);
        return new TechnicalPoint(value);
    }
}
```

### 6.3 조건 분기 중복과 중첩

인터페이스는 switch 조건문의 중복을 제거할 수 있을 뿐만 아니라 다중 중첩된 복잡한 분기를 제거하는 데 활용할 수 있습니다.

쇼핑몰 우수 고객인지 판정하는 로직

* 지금까지 구매한 금액이 100만원 이상
* 한 달에 구매하는 횟수가 10회 이상
* 반품률 0.1% 이하 

```java
boolean isGoldCustomer(PurchaseHistory history) {
    if (1000000 <= history.totalAmount) {
        if (10 <= history.purchaseFrequencyPerMonth) {
            if (history.returnRate <= 0.001) {
                return true;
            }
        }
    }
    return false;
}
```

실버 회원

* 한 달에 구매하는 횟수가 10회 이상
* 반품률 0.1% 이하 

```java
boolean isSilverCustomer(PurchaseHistory history) {
    if (10 <= history.purchaseFrequencyPerMonth) {
        if (history.returnRate <= 0.001) {
            return true;
        }
    }
    return false;
}
```

같은 판정 로직을 재사용하려면 어떻게 해야 할까요?

#### 6.3.1 정책 패턴으로 조건 집약하기

**정책 패턴**은 조건을 부품처럼 만들고, 부품으로 만든 조건을 조합해서 사용하는 패턴입니다.

```java
interface ExcellentCustomerRule {
    boolean ok(final PurchaseHistory history);
}
```

골드 회원이 되려면 3개의 조건을 만족해야 합니다.

```java
class GoldCustomerPurchaseAmountRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
        return 1000000 <= history.totalAmount;
    }
}
```

```java
class PurchaseFrequencyRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
        return 10 <= history.purchaseFrequencyPerMonth;
    }
}
```

```java
class ReturnRateRule implements ExcellentCustomerRule {
    public boolean ok(final PurchaseHistory history) {
        return history.returnRate <= 0.001;
    }
}
```

이어서 정책 클래스를 만듭니다. add 메서드로 규칙을 집약하고, complyWithAll 메서드 내부에서 규칙을 모두 만족하는지 판정합니다.

```java
class ExcellentCustomerPolicy {
    private final Set<ExcellentCustomerRule> rules;

    ExcellentCustomerPolicy() {
        rules = new HashSet<>();
    }

    void add(final ExcellentCustomerRule rule) {
        rules.add(rule);
    }

    boolean complyWithAll(final PurchaseHistory history) {
        for (ExcellentCustomerRule rule : rules) {
            if (!rule.ok(history)) return false;
        }
        return true;
    }
}
```

Rule과 Policy를 사용해서 골드 회원 판정 로직을 개선했습니다. goldCustomerPolicy로 골드 회원의 조건 3가지를 추가하고, complyWithAll로 골드 회원인지 판정했습니다.

```java
ExcellentCustomerPolicy goldCustomerPolicy = new ExcellentCustomerPolicy();
goldCustomerPolicy.add(new GoldCustomerPurchaseAmountRule());
goldCustomerPolicy.add(new PurchaseFrequencyRule());
goldCustomerPolicy.add(new ReturnRateRule());

goldCustomerPolicy.complyWithAll(history);
```

이렇게 코드를 클래스에서 그냥 작성하면, 골드 회원과 무관한 로직을 삽입할 가능성이 있으므로 아직 불안정한 구조입니다. 골드 회원 정책을 클래스로 만듭니다.

```java
class GoldCustomerPolicy {
    private final ExcellentCustomerPolicy policy;

    GoldCustomerPolicy() {
        policy = new ExcellentCustomerPolicy();
        policy.add(new GoldCustomerPurchaseAmountRule());
        policy.add(new PurchaseFrequencyRule());
        policy.add(new ReturnRateRule());
    }

    boolean isGoldCustomer(final PurchaseHistory history) {
        return policy.complyWithAll(history);
    }
}
```

실버 회원도 같은 방법으로 만듭니다.

```java
class SilverCustomerPolicy {
    private final ExcellentCustomerPolicy policy;

    SilverCustomerPolicy() {
        policy = new ExcellentCustomerPolicy();
        policy.add(new PurchaseFrequencyRule());
        policy.add(new ReturnRateRule());
    }

    boolean isSilverCustomer(final PurchaseHistory history) {
        return policy.complyWithAll(history);
    }
}
```

### 6.5 인터페이스 사용 능력이 중급으로 올라가는 첫걸음

인터페이스를 잘 사용하면 조건 분기를 크게 줄일 수 있습니다. 따라서 코드를 간단하게 만들 수 있습니다. 인터페이스를 잘 사용하는지가 곧 설계 능력의 전환점이라고 할 수 있습니다.

|  | 초보자 | 중급자 이상 |
|--|------|----------|
| 분기 | if 조건문과 switch 조건문만 사용 | 인터페이스 설계 사용 |
| 분기마다의 처리 | 로직을 그냥 작성 | 클래스 사용 |

조건 분기를 써야 하는 상황에는 일단 **인터페이스 설계**를 떠올리자!

## 7장: 컬렉션: 중첩을 제거하는 구조화 테크닉

### 7.2 반복 처리 내부의 조건 분기 중첩

컬렉션 내부에서 특정 조건을 만족시키는 요소에 대해서만 어떤 작업을 수행하고 싶은 경우가 있습니다.

RPG에서 독 대미지를 받는 상황을 떠올려 보면, 멤버 전원의 상태를 확인하고 중독된 상태인 경우 히트포인트를 감소시키는 로직을 따로 설계하지 않으면 다음과 같은 코드로 구현하기 쉽습니다.

```java
for (Member member : members) {
    if (0 < member.hitPoint) {
        if (member.containsState(StateType.poison)) {
            member.hitPoint -= 10;
            if (member.hitPoint <= 0) {
                member.hitPoint = 0;
                member.addState(StateType.dead);
                member.removeState(StateType.poison);
            }
        }
    }
}
```

#### 7.2.1 조기 continue로 조건 분기 중첩 제어하기

이전 `조기 리턴`을 응용한 `조기 continue`를 적용해 봅시다.

```java
for (Member member : members) {
    if (member.hitPoint == 0) continue;

    if (member.containsState(StateType.poison)) {
        member.hitPoint -= 10;
        if (member.hitPoint <= 0) {
            member.hitPoint = 0;
            member.addState(StateType.dead);
            member.removeState(StateType.poison);
        }
    }
}
```

다른 if 조건문들도 조기 continue를 적용해 봅시다.

```java
for (Member member : members) {
    if (member.hitPoint == 0) continue;
    if (!member.containsState(StateType.poison)) continue;

    member.hitPoint -= 10;

    if (0 < member.hitPoint) continue;

    member.hitPoint = 0;
    member.addState(StateType.dead);
    member.removeState(StateType.poison);
}
```

#### 7.2.2 조기 break로 중첩 제거하기

반복 처리 제어 구문에는 continue 이외에도 break가 있습니다.

```java
int totalDamage = 0;
for (Member member : members) {
    if (!member.hasTeamAttackSucceeded()) break;

    int damage = (int) (member.attack() * 1.1);

    if (damage < 30) break;

    totalDamage += damage;
}
```

반복문 처리 내부에서 if 조건문이 중첩될 경우, **조기 continue**와 **조기 break**를 활용할 수 있는지 검토해 보기 바랍니다.

#### 7.3.1 컬렉션 처리를 캡슐화하기

컬렉션과 관련된 응집도가 낮아지는 문제는 일급 컬렉션 패턴을 사용해 해결할 수 있습니다. **일급 컬렉션(First Class Collection)**이란 컬렉션과 관련된 로직을 캡슐화하는 디자인 패턴입니다.

클래스 설계 원리를 반영하면 일급 컬렉션은 다음과 같이 구성됩니다.

* 컬렉션 자료형의 **인스턴스 변수**
* 컬렉션 자료형의 인스턴스 변수에 잘못된 값이 할당되지 않게 막고, 정상적으로 조작하는 **메서드**


멤버 컬렉션 `List<Member>`를 인스턴스 변수로 가지는 클래스를 설계해 봅시다.

```java
class Party {
    private final List<Member> members;

    Party() {
        members = new ArrayList<Member>();
    }

    private Party(final List<Member> members) {
        this.members = members;
    }

    void add(final Member member) {
        members.add(member);
    }
}
```

부수 효과를 막기 위해 새로운 리스트를 생성하고 해당 리스트에 요소를 추가하는 형태로 구현하겠습니다.
이렇게 하면 원래 members를 변화시키지 않아 부수 효과를 막을 수 있습니다.

```java
class Party {
    ...

    Party add(final Member newMember) {
        List<Member> adding = new ArrayList<Member>(members);
        adding.add(newMember);
        return new Party(adding);
    }
}
```


## Reference

* [내 코드가 그렇게 이상한가요? - 좋은 코드/나쁜 코드로 배우는 설계 입문](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=317906454&start=pcsearch_recen)
