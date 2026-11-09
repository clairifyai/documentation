# Model Routing

Each Claire instance runs on an AI model your organization chooses. *Model routing* is how Claire decides which model each request goes to. That model receives your question and any context retrieved to answer it, after the context has passed [prompt injection screening](prompt-injection.md#direct-and-indirect-injection).

## Choose Claire's AI Engine

* **Clairify's built-in engine** — Get started immediately, with nothing to configure and no keys to manage.
* **Bring your own engine** — Use your organization's own OpenAI, Anthropic, or Google Gemini key, or a model you host yourself, such as a local Llama model running on your own hardware.

## Primary and Fallback Models

You designate a primary model and an optional fallback. If the primary model's provider has an outage, chat and scheduled jobs keep running on the fallback.

For each turn, Claire logs the model and provider, the model route, and whether the turn fell back. See [what Claire logs](sensitive-information-disclosure.md#logging).

## Keys and Cost

All engine and add-on keys are encrypted and held only in Claire's memory. They are never written to the instance's files or install package. A new, withdrawn, or blocked key takes effect on the running instance immediately.

You can record each model's token pricing and review usage and cost by provider in the admin console.
