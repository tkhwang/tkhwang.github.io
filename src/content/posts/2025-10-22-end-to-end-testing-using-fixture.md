---
title: "[TDD] 멱등성 보장 및 사전 데이터 구축하여 복잡한 시나리오 E2E 테스트 방법"
pubDate: 2025-10-22
description: "AAA 패턴을 거꾸로 설계하고, 4계층 인수 테스트 아키텍처 사용, 멱등성 보장과 Fixture/Builder를 이용해 데이터를 확보하는 E2E 테스트 전략 정리"
author: "tkhwang"
featured: true
image:
  url: ""
  alt: ""
tags: ["tdd", "e2e-test"]
---

* 테스팅이 중요하다
* TDD 해야한다.

매번 해야지... 해야한다... 생각하지만 단위 테스트까지는 해보고 있는데, 단위 테스트를 넘어서는 순간 기술적으로 테스트를 어떻게 구성해야하는지 매번 어려움을 느끼고 있다.
마치 건강해지기 위해서는 달리기를 하면 좋다는 느낌이다. 좋은 것은 알겠는데, 어떻게 하는지 잘 모르겠다.

몇년전에 신청한 이후에 제대로 보지 않았던 [essentialist.dev](https://www.essentialist.dev) 강좌에 TDD 내용이 많이 있어서 정리해봅니다.

## 테스트 케이스 작성은 AAA (Arrange-Act-Assert) 패턴. 작성순서는 반대로

이 패턴은 많이 사용하는 방법입니다. 

TDD 로서 테스트를 작성하는 경우에는 실제 구현이 없이 테스트를 먼저 작성하게 됩니다.<br />
이때 강조하는 것이 **Assert 부터 반대로 작성** 하라고 하는 것입니다. 

이 경우 최종 Assert 를 먼저 작성함으로써 해당 메서드의 최종 결과가 어떤 모양을 갖게 되는지를 <br />
외부 입장에서, 일종의 interface 로 정의되는 contract 관점에서 생각을 해라는 것입니다.

Outside-in 방식으로 최종 contract 이 되는 interface shape 을 정리한 이후에 내부로 들어오면서 세부 사항을 생각하라는 것입니다.

## 4계층 인수 테스트 아키텍처

#### (1) The acceptance test

`test/features/create-class-room.feature`

인수 테스트의 판단 근거로 사용할 시나리오를 `feature` 파일로 작성
테스트를 작성하기 이전에 명시적으로 테스트 스펙을 작성. 실제로 이 파일의 내용을 테스트에서 활용하게 됩니다.

```
Feature: Create Class Room

    As an administrator
    I want to create a class
    So that I can add students to it

Scenario: Sucessfully create a class room
        Given I want to create a class room named "Math"
        When I request to create a class room
        Then the class room should be successfully created
```


#### (2) The executable specification

`feature` 를 AAA 패턴으로 작성

```typescript
const feature = loadFeature(path.join(__dirname, '../features/create-class-room.feature'));

defineFeature(feature, (test) => {
    afterEach(async () => {
        await resetDatabase();
    });

    test("Sucessfully create a class room", ({ given, when, then }) => {
        given(/^I want to create a class room named "(.*)"$/, (name) => {

        });

        when("I request to create a class room", async () => {

        });

        then("the class room should be successfully created", () => {

        });
    });
});
```


#### (3) The domain specific language layer

사실, 빌더에 대한 그 내용은 도메인 특화 언어의 일부이며 <br />
이는 우리가 가능한 한 인간이 읽기 쉬운 언어로 원하는 바를 더 잘 표현하기 위해 사용하는 코드 계층입니다.

#### (4) The protocol driver

프로토콜 드라이버는 실제로 경계를 넘어, 우리를 한 시스템(테스트 환경)에서 실제 시스템(이 경우 백엔드)으로 이동시키는 역할을 합니다.
`supertest` 패키지를 프로토콜 드라이버로 사용할 것입니다

```typescript
        when("I request to create a class room", async () => {
            response = await request(app).post("/classes").send(requestBody);
        });
```

## 테스트 시 주로 발생하는 문제 

### 여러번 수행 시에는 동일한 결과가 나오지 않는 경우

오로지 테스트 직접 입력/출력에만 의존에는 테스트의 경우에는 상관없지만 테스트를 실행 한 이후에 database 에 data create 하는 경우와 같이 간접 출력/간접 입력이 있는 경우에는 동일한 직접 입력으로 테스트를 다시 실행 시에 간접 입력/출력 때문에 동일한 결과가 나오지 않는 경우가 많다.

#### 해결책: 멱등성을 보장하라.

언제 테스트가 수행이 되더라도 같은 결과가 나오도록 테스트를 만들어야 한다.

* (1) Name 에 unique 한 조건이 있는 경우에는 테스트에서 random value generate 하여 사용한다.
* (2) 테스트 완료 전/후에 초기화 및 재구성을 하여 다시 실행 시에 문제가 없도록 한다. 즉, 쉽게 말하면 데이터베이스 테스트 이후에 데이터베이스를 초기화 등을 해서 정리하는 것과 같습니다.

```typescript
const feature = loadFeature(path.join(__dirname, '../features/create-class-room.feature'));

defineFeature(feature, (test) => {
    afterEach(async () => {
        await resetDatabase();
    });
...    
```

### 테스트를 위하여 사전에 데이터가 구축되어야 하는 케이스

E2E 테스트를 하는 경우에 사전에 데이터가 준비가 되어야 테스트가 가능한 시나리오가 있습니다.
가령, 최초 class 생성 테스트라면 임의의 이름으로 class 생성 테스트를 할 수 있습니다.

하지만, 특정 이름을 갖는 class 를 중복으로 생성하는 경우에 실패하는 테스트 케이스의 경우에 동일한 이름을 갖는 class 를 어떻게 만들 것인가 ?
물론 이 경우는 간단한 경우이니깐 그나마 쉬운데 아주 복잡한 경우에 대한 테스트의 경우라면 그런 환경의 데이터를 사전에 만들어야 하는데, 이를 어떻게 만들것인가 ?

개인적으로 이를 어떻게 처리해야하는지 잘 몰라서 테스트를 구성하는데 어려움이 있었습니다.

#### Fixture/Builder 를 이용해서 필요한 데이터를 사전에 손쉽게 만들어서 재활용하자

테스트 케이스에서 필요로 하는 데이터를 Data Model Tree 로 이를 손쉽게 만드는 방법으로 표현력이 좋은 빌더 패턴을 사용하자는 것입니다.

* Math 이름을 갖는 class 를 미리 만들기

```typescript
export function aClassRoom() {
    return new ClassRoomBuilder();
}

classRoom = await aClassRoom().withName('Math').build();
```

* Math 이름의 class 를 만들고
* 해당 class 에서 Khalil 학생 assign 하기

```typescript
            const classRoomBuilder = await aClassRoom().withName("Math");

            studentAssignment = await aStudentAssignemt()
                .from(anAssignment().from(classRoomBuilder))
                .and(anEnrolledStudent()
                    .from(classRoomBuilder)
                    .and(aStudent().withName("Khalil"))
                )
                .build();
```

OOP 식의 좋은 표현력으로 알기 쉽게 코드 이해하도록 builder pattern 추천하네요.

## 간단한 서버 로직에 E2E acceptance test 구성하는 예제

예제를 위하여 layer 구분없이 구현된 backend server 레거시 코드에 E2E acceptance test 붙이는 과정 소개

### `POST /classes` create class

```typescript
// POST class created
app.post("/classes", async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["name"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { name } = req.body;

    const classroomExists = await prisma.class.findUnique({ where: { name }})

    if (classroomExists) {
      return res
      .status(409)
      .json({ error: Errors.ClassAlreadyExists, data: undefined, success: false });
    }

    const cls = await prisma.class.create({
      data: {
        name,
      },
    });

    res
      .status(201)
      .json({ error: undefined, data: parseForResponse(cls), success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
});
```

### Testcase #1 : Sucessfully create a class room

#### `tests/features/create-class-room.feature`

* 고유한 이름을 갖는 수업 생성 케이스

```
Feature: Create Class Room

    As an administrator
    I want to create a class
    So that I can add students to it

Scenario: Sucessfully create a class room
        Given I want to create a class room named "Math"
        When I request to create a class room
        Then the class room should be successfully created
```

#### `tests/acceptance/create-class-room.test.ts`

```typescript
const feature = loadFeature(path.join(__dirname, '../features/create-class-room.feature'));

defineFeature(feature, (test) => {
    afterEach(async () => {
        await resetDatabase();
    });

    test("Sucessfully create a class room", ({ given, when, then }) => {
        let requestBody: any = {};
        let response: any = {};

        given(/^I want to create a class room named "(.*)"$/, (name) => {
            requestBody = {
                name,
            };
        });

        when("I request to create a class room", async () => {
            response = await request(app).post("/classes").send(requestBody);
        });

        then("the class room should be successfully created", () => {
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(requestBody.name);
        });
    });
});
```

### Testcase #2 : Fail to create a class room with duplicate name

#### `tests/features/create-class-room.feature`

* 고유한 이름을 갖는 수업 생성 케이스
    - 테스트 케이스에서 동일한 이름을 사용할 경우, 한 번 수행 시 이후에 다시 실행시에는 동일함 수업이 있어서 실패하게 됨.
```
Scenario: Fail to create a class room with duplicate name
        Given there is already a class room named "Math"
        When I send a request to create a class room
        Then the class room should not be created
```

#### `tests/acceptance/create-class-room.test.ts`

테스트에 필요한 데이터를 사전에 손쉽게 만들수 있도록 builder pattern 이용해서 빌더를 만들어서 표현력 좋게 해당 데이터를 만드는 방법이다.

```typescript
classRoom = await aClassRoom().withName(name).build();
```

#### `ClassRoomBuilder`

```typescript
import { Class } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export class ClassRoomBuilder {
    private classRoom: Partial<Class>

    constructor() {
        this.classRoom = {
            name: faker.company.buzzNoun()
        }
    }

    withName(name: string): this {
        this.classRoom.name = name;
        return this;
    }

    async build(): Promise<Class> {
        let classRoom = await prisma.class.upsert({
            create: {
                name: this.classRoom.name as string
            },
            update: {
                name: this.classRoom.name as string
            },
            where: {
                name: this.classRoom.name as string
            }
        });

        return classRoom as Class;
    }
}
```

#### `tests/acceptance/create-class-room.test.ts`

```typescript
    test("Fail to create a class room with duplicate name", ({ given, when, then }) => {
        let classRoom: Class;
        let requestBody: any = {};
        let response: any = {};

        given(/^there is already a class room named "(.*)"$/, async (name) => {
            classRoom = await aClassRoom().withName(name).build();
            requestBody = { name };
        });

        when("I send a request to create a class room", async () => {
            response = await request(app).post("/classes").send(requestBody);
        });

        then("the class room should not be created", () => {
            expect(response.status).toBe(409)
            expect(response.body.success).toBeFalsy()
            expect(response.body.error).toBe(Errors.ClassAlreadyExists)
        })

    });
```


### Testcase #3 : `/class-enrollment` Class enrollment 테스트케이스

좀더 복잡한 경우

#### `POST /class-enrollments` router

```typescript
// POST student assigned to class
app.post("/class-enrollments", async (req: Request, res: Response) => {
  try {
    if (isMissingKeys(req.body, ["studentId", "classId"])) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    const { studentId, classId } = req.body;

    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        error: Errors.StudentNotFound,
        data: undefined,
        success: false,
      });
    }

    // check if class exists
    const cls = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    // check if student is already enrolled in class
    const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });

    if (duplicatedClassEnrollment) {
      return res.status(409).json({
        error: Errors.StudentAlreadyEnrolled,
        data: undefined,
        success: false,
      });
    }

    if (!cls) {
      return res
        .status(404)
        .json({ error: Errors.ClassNotFound, data: undefined, success: false });
    }

    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });

    res.status(201).json({
      error: undefined,
      data: parseForResponse(classEnrollment),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
});
```

#### `test/features/create-enrollment.feature`


```
Feature: Enroll a student to a class

    As an administrator
    I want to enroll a student to a class
    So that the student can attend the class

    Scenario: Successfully enroll a student to a class
        Given there is a class and a student
        When I enroll the student to the class
        Then the student should be enrolled to the class successfully
```


#### `tests/features/create-enrollment.test.ts`

Class 를 enrollment 하기 위해서는 사전에

* class 가 만들어져 있어야 함.
* student 가 만들어져 있어야 함.

```typescript
    test("Successfully enroll a student to a class", ({ given, when, then }) => {
        let response: any = {};
        let student: Student;
        let classRoom: Class;

        given("There is a class and a student", async () => {
            student = await aStudent().build()
            classRoom = await aClassRoom().build()
        });
```

####  `StudentBuilder`

```typescript
import { Student } from "@prisma/client"
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export class StudentBuilder {
    private student: Partial<Student>

    constructor() {
        this.student = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
        }
    }

    withRandomDetails() {
        this.student.email = faker.internet.email();
        this.student.name = faker.person.fullName();
        return this;
    }

    withName(name: string) {
        this.student.name = name;
        return this;
    }

    withEmail(email: string) {
        this.student.email = email;
        return this;
    }

    async build() {

        let student = await prisma.student.upsert({
            where: {
                email: this.student.email as string,
            },
            create: {
                name: this.student.name as string,
                email: this.student.email as string
            },
            update: {
                name: this.student.name as string,
                email: this.student.email as string
            }
        });

        return student as Student;
    }
}
```

#### `ClassRoomBuilder`

```typescript
import { Class } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

export class ClassRoomBuilder {
    private classRoom: Partial<Class>

    constructor() {
        this.classRoom = {
            name: faker.company.buzzNoun()
        }
    }

    withName(name: string): this {
        this.classRoom.name = name;
        return this;
    }

    async build(): Promise<Class> {
        let classRoom = await prisma.class.upsert({
            create: {
                name: this.classRoom.name as string
            },
            update: {
                name: this.classRoom.name as string
            },
            where: {
                name: this.classRoom.name as string
            }
        });

        return classRoom as Class;
    }
}

```

#### `tests/acceptance/create-enrollment.test.ts`


```typescript
import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import request from 'supertest';
import { app } from '../../src';
import { resetDatabase } from '../fixtures/reset';
import { aClassRoom, anEnrolledStudent, aStudent } from '../fixtures';
import { Class, Student } from '@prisma/client';
import { kMaxLength } from 'buffer';
import { EnrolledStudent } from '../fixtures/types';

const feature = loadFeature(path.join(__dirname, '../features/create-enrollment.feature'));

defineFeature(feature, (test) => {
    afterEach(async () => {
        await resetDatabase();
    });

    test("Successfully enroll a student to a class", ({ given, when, then }) => {
        let response: any = {};
        let student: Student;
        let classRoom: Class;

        given("There is a class and a student", async () => {
            student = await aStudent().build()
            classRoom = await aClassRoom().build()
        });

        when("I enroll the student to the class", async () => {
            response = await request(app).post("/class-enrollments").send({
                studentId: student.id,
                classId: classRoom.id,
            });
        });

        then("the student should be enrolled to the class successfully", async () => {
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.studentId).toBe(student.id);
            expect(response.body.data.classId).toBe(classRoom.id);
        });
    });

    test("Enroll a student to a class that doesn't exist", ({ given, when, then }) => {
        let response: any = {};
        let student: Student;

        given("There is a student", async () => {
            student = await aStudent().build()
        });

        when("I enroll the student to a class that doesn't exist", async () => {
            const wrongClassIdWhichDoesNotExist = "123";
            response = await request(app).post("/class-enrollments").send({
                studentId: student.id,
                classId: wrongClassIdWhichDoesNotExist,
            });
        });

        then("the student should not be enrolled to the class", async () => {
            expect(response.status).toBe(404);
        });
    })


    test("Already enrolled", ({ given, when, then }) => {
        let response: any = {};
        let requestBody: any = {};
        let enrolledStudent: EnrolledStudent;
        let classRoom: Class;

        given("a student is already enrolled to a class", async () => {
            let builderResult = await anEnrolledStudent()
                .from(aClassRoom().withName("Math"))
                .and(aStudent().withEmail("khalil@essentialist.dev").withName("Khalil"))
                .build();

            enrolledStudent = builderResult.enrolledStudent;
            classRoom = builderResult.classRoom;
        });

        when("I enroll the student to the class again", async () => {
            requestBody = {
                studentId: enrolledStudent.studentId,
                classId: enrolledStudent.classId,
            }
            response = await request(app).post("/class-enrollments").send(requestBody);
        });

        then("I should see an error message", async () => {
            expect(response.status).toBe(409);
            expect(response.body.error).toBe("StudentAlreadyEnrolled");
        });
    });
});
```


## Reference

* [How to Improve Legacy Code w/ Characterization Tests](https://khalilstemmler.com/articles/legacy-code/)
* [(lecture) essentialist.dev](https://www.essentialist.dev)
