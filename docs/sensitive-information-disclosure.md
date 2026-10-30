# How Claire Protects Against Sensitive Information Disclosure

!!! tip "Go to the source"

    Sensitive information disclosure is #2 on the OWASP Top 10 for LLM Applications (2025). See [LLM02: Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/) for vulnerability examples, attack scenarios, and mitigations.

Sensitive information disclosure is when an LLM reveals something it shouldn't — personal data, financial or health records, confidential business information, or credentials. Disclosure is often the goal of a [prompt injection](prompt-injection.md) attack. Those attacks can work when sensitive information: 

1. Appears in model training data (and then that info gets baked in).
1. Appears in a knowledge base that is used by the model for question answering.
1. Appears or is baked into derivative artifacts like synthetic data (#1 is root cause).
1. Can be inferred by observing the model from outside a session, e.g., logs, packet sniffing.

We are not concerned with training or derivative artifacts. Those is not part of Clairify functionality, infrastructure, or development activities. Our primary concern is inference time and system logging. Specifically, during question answering, we do not want a user to see information beyond their privilege level. And during logging, we don't want to expose users' private information.

## Inference time

When the model is given a question or a goal, it will draw on anything in its context to answer it. If sensitive data is in the context, there's no reliable way to make the model keep it to itself. So the access check can't live inside the model. It has to happen before the data ever reaches it.

Here's how it works:

Claire a 1 to 1 relationship with each user despite its multi-tenant architecture. This means that sensitive information cannot leak from one session user to another at inference time. 

There are two types of context that can be retrived during question answering: text from emails and text from uploaded documents. Emails are stored in a per-user relational database - meaning each user has their own database; files are uploaded to a folder dedicated and keyed to the user. 

For context retrieval (RAG), emails and files are chunked, vectorized, and stored in a per-user vector database. When a user asks a question, context retrieval is performed using a tool call. Tools are determinisitic code, and the tool called is keyed to the current user. Meaning, the answer can only be generated from context belonging to the user. 





* **Credentials never enter the context** — Keys and passwords are injected at the moment of use, outside the model, so there is nothing for Claire to disclose. See [Claire never sees your passwords or keys](ai-safety.md#claire-never-sees-your-passwords-or-keys).
* **No human at Clairify sees your data** — See [zero-operator access](ai-safety.md#what-can-claire-actually-reach).

<!-- TODO: PII detection and redaction (see pii-policy.md, currently marked "Coming Soon"), what is sent to the model provider, and any output filtering. -->
