!!! Warning "Comming Soon"

    This page is under construction, and the feature is still in development.

# How We Handle PII

Sometimes, even though we know we shouldn't, we share sensitive data via email or instant message. 
From a policy perspective, we don't want to be able see your sensitive data, and we want minimize the leakage of PII in the event of a security incident. This means we need to employ one or more de-identification techniques, e.g., masking, redaction and abstraction. But, we need to do so in a way that maintains speed, clarity, and usability of the app. To ensure the protection of PII while supporting functional requirements such as summarization and recall, we apply a sensitivity-based, context-aware approach to PII.

## PII Collection

PII is any information that could identify an individual—like names, phone numbers, or email addresses.
We don’t actively request PII although we do handle business card information (e.g., name, title, work email) that we obtain via SSO. Therefore the primary target of this policy is to protect against PII that is incidentally captured in the process of handling your communciations.

## Classification and Protection

Following established guidelines such as NIST SP 800‑122, we classify PII based on the potential impact to individuals or the organization if that data were improperly accessed or disclosed. We then apply protection measures proportionate to the associated risk. To implement this, we use a combination of modern machine learning and large language models (LLMs) to identify and evaluate sensitive content. This approach ensures that context is taken into account before any de-identification techniques such as redaction, masking, or abstraction are applied.  


| **Risk Level**                   | **Examples**                            | **How We Handle It** |
|----------------------------------|------------------------------------------|------------------------|
|  **Low Sensitivity (Preserved)** | Names, job titles, company, work email   | Retained for clarity; secure access controls and encryption applied |
|  **Moderate Sensitivity (Conditional)** | Personal email, mobile number, home address | Retained only if clearly shared and contextually needed; masked or abstracted on escalation |
|  **High Sensitivity (Redacted)** | SSNs, credit card numbers, passwords, PHI | Immediately redacted upon detection; never stored or summarized, only abstracted in outputs |

## Contextual Escalation

If a low- or moderate-sensitivity detail appears alongside more sensitive subject matter—like medical or financial information—the LLM interprets the overall message as requiring greater protection. In these cases:

- The sensitive content is abstracted or redacted.
- The resulting summary preserves intent but does not expose high-risk data.
- Low-sensitivity elements (like names) may still appear, provided they don’t increase the risk.

### Example

> Original Message: “Here’s my number—(555) 678‑9101—I’ll be out next week for surgery.”
Summary: “The user shared a personal contact number along with health-related information affecting their availability.”