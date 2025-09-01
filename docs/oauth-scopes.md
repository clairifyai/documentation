# OAuth Scopes - Gmail

!!! tip inline end

    Clairify **cannot** send email, create drafts, change Gmail settings, or permanently delete messages.

We request a small set of Google OAuth scopes to:

1. Sign you in and create your Clairify account,
1. Read your messages to summarize them, and
1. Apply lightweight user-initiated changes to your inbox

<br>


Table: Complete List of Requested Gmail Scopes {#gmail-scopes}

| Purpose | Scopes | What it allows | Example |
|--------|--------|----------------|---------|
| **Non-Sensitive** |  |  |  |
| Sign-in & account association |<nobr>`openid`<br>`userinfo.email`<br>`userinfo.profile` | Verify identity, link the correct Google account, and load basic profile details (name, avatar, email). | Sign into the app, show your name/avatar, tie your account to the right inbox. |
| Manage label definitions | `gmail.labels` | Create, read, update, and delete user labels. Applying/removing labels on messages is done via `gmail.modify`. | Create and maintain labels used by Clairify. Our labels are always prepended with 'Clairify', e.g., `ClairifyArchive`.|
| **Sensitive** |  |  |  |
| Push notifications (infrastructure) | `pubsub` | View and manage Pub/Sub topics/subscriptions used for Gmail push (watch) notifications; does not grant access to email content. | Create/verify the topic and manage the Gmail watch subscription. |
| **Restricted** |  |  |  |
| Read mail for summarization | `gmail.modify` | Read messages and attachments. | Generate summaries for new messages and newsletters. |
| Apply user-initiated mailbox changes | `gmail.modify` | Add/remove labels on messages/threads; toggle `UNREAD`; archive (remove `INBOX`); move to Trash. | Swipe right to mark as read; tap Archive to file; apply the corresponding label, e.g., `ClairifyRead`. |
| Read mail | `gmail.readonly` | View email messages and certain settings without modifying mailbox state. | Redundant when `gmail.modify` is granted. |
| Read message metadata only | `gmail.metadata` | View message metadata (labels, headers), but not the email body or attachments. | Faster inbox syncing. |

## Permission Philosophy

- **Least privilege** — We request only the scopes needed for the features above. [](#gmail-scopes) is the single source of truth for scope purposes and examples.
- **User-initiated changes only** — Any mailbox modifications happen in response to your actions in the app, e.g., mark as read, archive, labeling.
- **Content boundaries** — Only email messages and their attachments are accessed, and for no other purpose than to generate summaries.

## OAuth Consent Flow

1. Choose your Google account.  
2. Review and grant the scopes listed in [](#gmail-scopes).  
3. You’re redirected back to Clairify and a token is issued.  
4. Access tokens are used by the app; refresh happens in the background.

## Token Lifecycle & Revocation

Access tokens are short-lived; refresh tokens keep sessions active until you revoke access or sign out. Either option immediately terminates our access to your inbox and its watch notifications.

To revoke access:

- **Individual**: [Google Account](https://myaccount.google.com/) |  > Security > Third-party access, or
- **Workspace Admin**: [Google Admin Console](https://admin.google.com) > Security > Access & Data Control > API Control > Manage App Access.

## Security & Access Transparency

- **Credentials & secrets** - OAuth tokens are encrypted at rest.
- **Access controls** - We enforce role-based, least-privilege access to production systems and customer data (emails, summaries, labels/metadata), cryptographic secrets/tokens, and operational tooling (databases, storage, Pub/Sub, logs, admin consoles).
- **Accountability** - All privileged access&mdash;including use of administrative tooling for technical support and debugging&mdash;is logged and auditable.

## Scope Change Policy

Any addition or elevation of scopes requires renewed user consent. Per Google, any time we add a sensitive or restricted scope, we must submit for verification before using that scope in production.

## Additional Resources

- [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [Google OAuth 2.0 scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Google Gmail labels](https://developers.google.com/gmail/api/reference/rest/v1/users.labels)
- [Google restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification?utm_source=chatgpt.com)