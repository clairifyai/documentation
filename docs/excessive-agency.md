---
byline: True
---

# How Claire Protects Against Excessive Agency

!!! tip "Go to the source"

    Excessive agency is #3 on the OWASP Top 10 for LLM Applications (2026). See [LLM03: Excessive Agency](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) for vulnerability examples, attack scenarios, and mitigations.

We call Claire and AI _assistant_, but that refers to the app you interact with as a user. In engineering parlance, Claire is an _agent_. [Langchain](https://www.langchain.com/blog/what-is-an-agent) defines an agent as a system that uses a LLM to decide the control flow of an application. So rather than producing only text, the model chooses the next step. 

So how is the agent able to choose the next step? Let's walk through an example:

1. You ask Claire a question: "Will it rain today?"
1. Before Claire sends your question to the model, Claire prepares a list of things the model can optionally do (its _tools_) and how to use them (its _skills_). In this example, the model gets a skill called "weather" which says, "If you need to answer a question about the weather ask for the weather report." The models also gets a tool list which includes "weather_report."
1. Claire sends your question, the skills, and tools to the model.
1. The model reads the weather skill and determines that it needs the weather report before it can answer the question, so it returns "weather_report" instead. This is _tool call_.
1. Claire maps this response to a hardcoded function that calls weather.com.
1. Claire sends the weather report back to the model.
1. The model uses the weather report to generate its final answer.

Important to note is that Claire get the weather report with it's *own* code. The model's job is only to choose the right tool. Sometimes we talk as if the model is taking action on it's own, but it's really not.

## Excessive Agency

With background out of the way, now we get to the part about excessive agency. We have to treat the model just like any other employee and that involves applying the concept of _least privilege_. Normally, every employee should have only the minimum permissions required to do their job. When this concept is applied to the model, it means that if model needs to send an email, it shouldn't also have the ability to delete email.

!!! tip "Who cares?"
    The reason any of this is important is that in the case that the model makes stuff up, or a prompt injection attack, the following safeguards minimize the blast radius.

## Excessive Functionality

Excessive functionality is when the agent can do more than it needs to. We control this on a per-turn basis using a concept called _tool gating_. From [Sanity.io](https://www.sanity.io/glossary/tool-gating):

> **Tool gating** is a control step between an AI agent and the actions it can take. It answers two questions: which tools should this agent be shown right now, and should this specific proposed action be allowed to run.

A _turn_ is one opportunity for the model to respond. On every turn, the agent could potentially have excessive functionality more ways than one:

1. The agent has access to tools it doesn't need.
2. An individual tool bundles permissions the agent doesn't need, e.g. read and write.
3. The permission given by the tool is open ended, e.g. shell access.

### Excess Tools

To prevent extraneous tools from being presented to the model, we use two-step gate called 
_catalog filtering_ to whittle down the list. Again from [Sanity.io](https://www.sanity.io/glossary/tool-gating): 

> **Catalog filtering** is a control that "looks at the task and the current context, then exposes only the handful of tools that are plausibly relevant. A request about a billing question does not need the document deletion tool in scope."

First we bind every tool to its corresponding skill. On each turn, we deterimine which skills are most relevant and only those skills and their corresponding tools are fully presented. For example, create_event is bound to the calendar-write tool. If you're not asking to add an event to the calendar, then calendar-write is not inserted into in the prompt and create_event is not offered in the tool list. 

One of the ways Claire knows which skills to include is if you specify one or more slash commands. If you don't specify a slash command, Claire will attempt to identify the one best skill to include automatically as a hint to the model. But sometimes there isn't enough information to make a guess. Take the user question, "What's the latest on Acme, Inc?" In this case, Claire doesn't know whether the relevant information is stored. Should it check it's own memory or Gmail?

To plan for these cases we use _progressive disclosure_. All available skills are partially presented, meaning only the skill name and the description inserted into the prompt. There's a special tool offered where the model can choose to load any of thoses skills fully. In this way, the model becomes aware that capability exists but without offering the tools in advance.

!!! warning "Turn off unused skills"
    Excessive agency is a concern in part due to the risk of prompt injection. There is no way to guarantee defense against this attack. Tool minimization is OWASP's first recommended mitigation. So turn off any skills that are not being used. We're working on a feature to report on tool usage.

## Excess Functions

The second excessive functionality is solved in the way tools are defined: We don't bundle permisssions. Read is separated from write. Draft is separated from send.

![Tools Don't Bundle Permissions](assets/images/calendar-read-write-skills.png){width="80%" class="no-caption on-glb"}

!!! tip "Coming Soon!"
    You can inspect every enabled tool in the tool library to see the endpoints they hit.

## Excess Scope

The third excessive functionality is solved in that Claire interacts with all downstream systems through API/MCP endpoints. Most importantly, Claire treats _itself_ as a downstream system. Therefore it could never access its own shell to directly execute a command.

System defined tools are keyed to the identity of the current user, never to the model or another user. So whenever interacting with a downstream system, Claire can perform actions according to the user's permissions on that system. For example, if a developer asks Claire to merge a pull request, Claire can use the merge tool, but Github will still block if the merge protection rules aren't met. See [Claire only has the access you give it](ai-safety.md#claire-only-has-the-access-you-give-it).

Each 3rd-party defines their RBAC differently. For example, Trello uses bearer tokens to API access gives the same permissions as the user, while Notion sets permissions on the API key, effectively creating an app identity. Therefore you may not want a single Notion connector to be generally available. At the same time Personal Access tTokens (PAT) are not a scalable solution.

## Excessive Aautonomy

Once a tool has been called, whether or not it can run is a differet matter. Tool calls are subject to an _action gate_. Specifically, all write operations (create, modify, delete) require the user's explicit approval. This is also called the _human-in-the-loop_ control.