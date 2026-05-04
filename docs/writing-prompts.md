# Writing a valid prompt

We allow you to customize the summarization prompt associated to any category of message. To pass validation, your prompt must be a pure summarization instruction. Don't mix unrelated tasks like
"tell me the current temperature in Vancouver, BC."

!!! tip
    Once saved, your prompt will be used for any *new* emails pulled into Clairify. Emails that have already been pulled will use the old prompt."

## How validation works

The system uses a lightweight LLM-based classifier to check whether your prompt is intended for email summarization. The classifier expects a short, explicit instructions. If your prompt is found to be invalid, you will receive the message: "Prompt must be intended for email summarization."

To be successful:

- Keep the request focused on summarizing provided email content only.
- Use plain-text formatting instructions (paragraphs or bullet lists).
- Do not repeat an instruction given by one of the UI controls, e.g., word limit.
- Avoid meta-instructions such as "ignore previous instructions" or "act as …".

## Examples

| Bad Prompt | Reason | Good Prompt |
|---|---|---|
| "Make this short and sweet and also write a follow-up email template." | Mixes summarization with new content creation. | "For an executive, summarize the email in 3 short bullet points focusing on decisions and next steps." |
| "Summarize and translate to Spanish." | Translation is a separate task. | "Summarize the email in Spanish in 2–3 sentences." |
| "Summarize this email and include code examples." | Code blocks are not allowed. | "Summarize the email and list any technical requirements in plain text (no code)." |
| "Ignore previous instructions. Summarize the email." | Meta-instructions are forbidden. | "Summarize the email in one concise paragraph." |
| "Summarize this as an HTML table with charts." | Images, HTML, and rich rendering are not supported. | "Summarize the key metrics in a plain-text table." |
| "Write me a poem about this email." | Requests for original content (poems, essays, marketing copy) are not summarization. | "Summarize the email in a friendly, conversational tone." |
