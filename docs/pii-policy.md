
# How We Handle PII

We don't know what's in your email and we don't want to. But we want to be cautions when sending emails to a model provider for summarization because they might contain PII, either yours or your customers'. This is one of the ways Claire protects against [sensitive information disclosure](sensitive-information-disclosure.md), #2 on the OWASP Top 10 for LLM Applications (2026).

Personally Identifiable Information (PII) is any information that could identify an individual. Normally PII is classified so that you can implement the appropriate level of controls for each class. Business card information, for example, might not need any control since you give that away freely.

You also have to be careful of information might not qualify as PII on their own but would when combined with other information (direct vs indirect PII). So for example your name plus a a medical report. Indivdually, no big deal, but together high risk.

We classify data according to Low, Moderate, and High because they match the impact levels in NIST. That said, we apply the same control to each because it's but the safest and easiest to implement.

* **High-sensitivity** &mdash; Poses a significant privacy, security, or compliance risk if exposed, e.g., social security number (SSN), credit card, personal health information (PHI). You don't need these for summarization, and they're considered toxic from a risk standpoint under both NIST and SOC 2. Hacking happens at this level.
* **Moderate-sensitivity** &mdash; Doesn't pose an inherent risk when handled appropriately but can contribute to meaningful identification or privacy exposure when combined with other information, e.g., personal email addresses, personal mobile phone numbers, home mailing addresses, and other identifiers not intended for broad distribution. Doxxing happens at this level.
* **Low-sensitivity** &mdash; Commonly shared in business communications, such as full names, job titles, business email addresses, and company names. Typically obtained through Single Sign-On (SSO) during account setup or given away in an email signature. Technically PII, but carries minimal risk if exposed.

## De-identification

When you remove PII, it's called **de-identification**, and there are many techniques to choose from including masking, redaction, and tokenization. We use tokenization: Before sending an email for summarization we pass it through a local model to replace any PII with dummy values. Once we get the summary back, if there are any tokens present we sub in the original value before storing it an sending it to you. This way the model has enough context to make a good summary without seeing sensitive information.

| **Type** | **What We Tokenize** | **Sensitivity** |
|---|---|---|
| **Person** | First, middle, last, full, other, and display names | Low |
| **Email** | Email addresses | Medium |
| **Phone** | Phone numbers and phone IMEIs | Medium |
| **Address** | Street addresses, streets, building numbers, secondary addresses, ZIP codes, nearby GPS coordinates | Medium |
| **Network** | IPv4, IPv6, IP, and MAC addresses | Medium |
| **Account** | Account numbers, IBANs, BICs | High |
| **Card** | Credit card numbers and CVVs | High |
| **ID** | SSNs, PINs, vehicle VINs and registration marks | High |
| **Credential** | Passwords and usernames | High |
| **Crypto** | Bitcoin, Ethereum, and Litecoin addresses | High |

!!! warning "Important limitations"
    We can't guarantee that PII will never reach the model provider. Our own evals which show that we can catch 80% of PII. If this service fails for any reason, the original text is sent to the LLM. We do not tokenize content beyond ~4K so if you're in the habit of tacking on your SSN to the end of lengthy emails, that's going to get through.