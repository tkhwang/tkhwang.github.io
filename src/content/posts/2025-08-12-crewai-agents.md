---
title: "[CrewAI] CrewAI를 활용한 역할 기반 에이전트 시스템 구축"
description: "CrewAI 프레임워크를 사용하여 에이전트들의 협업 시스템을 구축하는 방법과 특징들을 살펴봅니다."
date: "Aug 12 2025"
tags: ["ai", "crewai"]
---

LangChain과 langgraph 와 함께 에이전트 개발에 많이 보이는 프레임워크 중의 하나가 [CrewAI](https://www.crewai.com/) 입니다. <br />
간단한 예제이지만 어떤 특징이 있는지 보기 위해서 정리해봅니다.

### TL; DR

- LangChain에 비해서 특정 role을 갖는 agent 의 연동을 손쉽게 설정할 수 있다.
- Character chatbot 처럼 role, goal 에 의해서 agent 정의를 손쉽게 할 수 있음.
- Memory, tool 등의 기능을 손쉽게 정의할 수 있음.
- 간단한 경우에는 편리할 듯 한데, 복잡한 경우에는 어떻게 ?
- Code 자체보다 prompt 로 role, goal 등을 specific 하게 적는 작업이 대부분이 될 듯.

## 1. Simple version

### Import

```python
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv

load_dotenv()
```

### Agent 정의

```python
joke_researcher = Agent(
    role="Joke Researcher",
    goal="{topic}에 관해 웃음을 유발하는 요소들을 연구한다.",
    verbose=True,
    memory=True,
    backstory=(
        "슬랩스틱 유머에 열정을 가진 당신은 숙력된 유머 연구원입니다. "
        "일상적인 상황에서 웃음을 유발하는 요수를 찾아내는 데 능숙하며, "
        "지루한 순간도 폭소로 바꿀 수 있는 능력을 갖추고 있습니다."
    ),
    allow_delegation=True,
)

joke_writer = Agent(
    role="Joke Writer",
    goal="{topic}에 관한 우스꽝스럽고 재미있는 농담을 작성한다.",
    verbose=True,
    memory=True,
    backstory=(
        "당신은 유머 감각이 뛰어난 농담 작가입니다. 간단한 아이디어도 "
        "폭소를 유발하는 농담으로 바꿀 수 있으며, 몇 줄의 문장만으로도 "
        "사람들을 웃게 만드는 재능을 가지고 있습니다."
    ),
    allow_delegation=True,
)
```

### Task 정의

```python
research_task = Task(
    description=(
        "다음 주제가 왜 재미있는지 파악한다: {topic}. "
        "유머러스한 핵심 요소들을 반드시 포함해야 한다. "
        "또한, 현재 사회적 트렌트에 대한 분석과 "
        "이것이 유머 인식에 미치는 영향도 제공해야 한다."
    ),
    expected_output=(
        "최신 유머에 관한 포괄적인 3문단 분량의 보고서"
    ),
    agent=joke_researcher,
)

write_task = Task(
    description=(
        "{topic}에 관한 통찰력 있고 유머러스하며 사회의식을 "
        "포함한 농담을 작성한다. "
        "이 주제를 재미있게 만드는 핵심 요소와 현재 사회적 "
        "트렌트에 대한 분석을 포함해야 한다."
    ),
    expected_output=(
        "주제에 대한 유머러스한 농담"
    ),
    agent=joke_writer,
    async_execution=True,
    output_file="the_best_joke.md"
)
```

### Crew 정의

```python
crew = Crew(
    agents=[joke_researcher, joke_writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    memory=True,
    verbose=True,
    cache=True,
    max_rpm=100,
    share_crew=True
)
```

### 실행

```python
result = crew.kickoff(
    inputs={"topic": "AI 엔지니어 농담"}
)
print(result)
```

### 실행 결과

```markdown
Here are some AI engineer jokes that humorously capture the challenges faced in the field, while reflecting current societal trends and perceptions about technology:

1. **The Job Listing**: Why did the AI engineer break up with their partner?
   Because they had too many “unmet expectations”! Turns out, all the algorithms predicted a "low compatibility score".

2. **The Meeting**: How many AI engineers does it take to change a light bulb?
   None, they just make a dark room "smart" enough to figure it out on its own! But don’t worry, they’ll hold a two-hour meeting about how to prepare the room for the task!

3. **The Training Data**: Why are AI engineers so good at parties?
   Because they can always find the nearest exit – they’ve trained their models on “how to escape awkward social interactions"!

4. **The Upgrade**: An AI engineer walks into a bar...
   They don't order a drink, they just upgraded the bartender's algorithms and now he remembers everyone's name and order, but still gets everyone's wine wrong! Classic model drift!

5. **Working from Home**: Why do AI engineers love remote work?
   Because every time they hear “Can you hear me?”, they just pretend the network latency is active and blame it on the connection—no one really knows when the system will respond!

6. **The AI Assistant**: What did the frustrated AI engineer say to their virtual assistant?
   "You know, I've called you 'Assistant' long enough. How about a raise, or at least some personality upgrades? It’s getting really boring around here!"

7. **The Debugging Process**: Why do AI engineers always bring a ladder when debugging?
   Because they heard they need to "raise their performance"!

These jokes highlight the irony and absurdity often encountered in the tech world, along with relatable experiences that AI engineers face, all while tapping into sociocultural themes of misunderstanding technology and the challenges of bridging human-computer interactions.
```

## 2. Class style

### Env

```python
import dotenv

dotenv.load_dotenv()
```

### Config

설정을 code 와 분리해서 config 아래에 yaml file 로 정의

config/agents.yaml

```yaml
translator_agent:
  role: >
    Translator to translate from English to Italian
  goal: >
    To be a good and useful translator to avoid misunderstandings.
  backstory: >
    You grew up between New York and Palermo, you can speak two languages fluently, and you can detect the cultural differences.
```

config/tasks.yaml

```yaml
translate_task:
  description: >
    Translate {sentence} from English to Italian without making mistakes.
  expected_output: >
    A well formatted translation from English to Italian using proper capitalization of names and places.
  agent: translator_agent

retranslate_task:
  description: >
    Translate {sentence} from Italian to Greek without making mistakes.
  expected_output: >
    A well formatted translation from Italian to Greek using proper capitalization of names and places.
  agent: translator_agent
```

### Class 정의

Class 에서 decorator 이용해서 정의를 하고, config에 yaml 로 정의한 설정값을 불러와서 사용함.

- `config/agents.yaml` : `self.agents_config["XXX"]`
- `config/tasks.yaml` : `self.tasks_config["XXX]`

```python
from crewai import Crew, Agent, Task
from crewai.project import CrewBase, agent, task, crew

@CrewBase
class TranslatorCrew:

    @agent
    def translator_agent(self):
        return Agent(
            config=self.agents_config["translator_agent"],
        )

    @task
    def translate_task(self):
        return Task(
            config=self.tasks_config["translate_task"],
        )

    @task
    def retranslate_task(self):
        return Task(
            config=self.tasks_config["retranslate_task"],
        )

    @crew
    def assemble_crew(self):
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            verbose=True,
        )
```

### 실행

```python
TranslatorCrew().assemble_crew().kickoff(
    inputs={
        "sentence": "I'm Michael and I like to ride my bicicle in Napoli",
    }
)
```

### Reference

- [AI 에이전트 인 액션 - 설계와 구현, 배포까지, 그동안 궁금했던 AI 에이전트 개발의 모든 것](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=367102442&start=slayer)
