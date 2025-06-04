# Can You Trust Clairify?

Our platform is built to protect your data with the same vigilance you bring to your clients' systems. We've done our homework—but we also know that MSPs do this for a living. That's why we aim to be completely transparent about where we are and what’s next when it comes to security.

---

## CASA Tier 2 Certified

We are **CASA Tier 2 certified**, a benchmark created by the App Defense Alliance that evaluates the security posture of cloud applications. The Tier 2 audit covers application architecture, data protection, and deployment security.

---

## Zero Trust Enforcement

Clairify follows a **Zero Trust** approach. Here's what that looks like in practice:

- **External identity verification.** Users log in via trusted providers (Google or Microsoft SSO), ensuring that credentials and permissions are verified outside Clairify itself.
- **Authenticate every request.** Every request to the backend is accompanied by a secure, time-limited token that proves who the user is.
- **Authorize every action.** Once we know who you are, we check what you're allowed to do, so even if you're authenticated, you can only access what your role permits.
- **Locked down data access.** Our backend has its own secure identity when talking to the database. It uses the same strict checks we apply for user access.
- **Server side enforcement.** We keep all critical security checks on our servers—never inside the app—so attackers can't tamper with them.

---

## Data Protection

Our security model includes protecting your privacy at every point in the data lifecycle.

- **Encrypted in transit.** Any time data travels, it’s encrypted using industry-standard TLS. This means no one can intercept and read what’s being sent.
- **Encrypted at rest.** Once the data reaches our servers, it’s stored using AES-256 encryption. Even if someone accessed our storage, they’d only see scrambled, unreadable code.
- **Payment Data.** We don’t handle sensitive payment data. Clairify never stores or sees full credit card numbers, CVVs, or other sensitive payment details. That data stays entirely with Lemon Squeezy and Stripe—two trusted providers with strict security controls.
- **Data retention.** Clairify gives you full control over deleting your data. In addition, we regularly sync to your inbox so that if you delete messages in Outlook or Gmail, we also delete it. Finally, each service tier defines a time to live for your messages after which we delete them.

---

## Platform Hardening & Reliability

Clairify is built on current, widely-trusted technologies.

- **Secured by iOS.** Because Clairify is built as a native iOS application, we inherit strong infrastructure security from Apple's platform—reducing risks like DNS vulnerabilities, outdated components, and unmanaged external dependencies.
- **Maintained by Meta.** React (Web) and React Native (Mobile) form the foundation of our frontends. Both are open-source, widely adopted, and maintained by Meta, ensuring rapid response to emerging threats.
- **Trusted BaaS.** Our backend runs on Supabase’s SOC 2–certified infrastructure, featuring encrypted daily backups and a managed vulnerability program.

---

## What's Next?

Security is never finished—we are pursuing **CASA Tier 3** certification. Here's what it entails:

- **Continuous monitoring.** Ongoing vulnerability scanning and monitoring.
- **3rd-party validations.** More frequent independent audits by authorized security labs.
- **Incident response plan.** Documented, tested, and rapidly executable incident response plan.
- **Proactive threat detection.** Add systems that watch for threats in real-time and alert us early.
