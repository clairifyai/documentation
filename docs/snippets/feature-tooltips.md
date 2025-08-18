<!--
feature-tooltips.md syntax:
- Each feature has 2 regions: one for the name, one for the description.
- Use mkdocs-snippets syntax: --8<-- [start:<id>] … --8<-- [end:<id>]
- Naming convention:
  • <feature>_name → human-readable label shown in table.
  • <feature>_description → text shown in tooltip (:material-information-outline:{ title="…" }).
- Example:

--eight<-- [start:byok_name]
Bring Your Own Key (BYOK)
--eight<-- [end:byok_name]

--eight<-- [start:byok_description]
BYOK lets you manage your own encryption keys for data at rest.
--eight<-- [end:byok_description]

- Keep snippet markers at start of line (no indent).
- Descriptions may span multiple lines; line breaks are preserved in tooltips.
- Documentation: https://facelessuser.github.io/pymdown-extensions/extensions/snippets/#snippets
-->

--8<-- [start:byok_name]
Bring Your Own Key (BYOK)
--8<-- [end:byok_name]

--8<-- [start:byok_description]
Fall back to your own OpenAI tokens after your plaform tokens run out.
--8<-- [end:byok_description]

--8<-- [start:primary_email_name]
Primary Email Support
--8<-- [end:primary_email_name]

--8<-- [start:primary_email_description]
Link one Gmail or Outlook account create your account and begin using Clairify.
--8<-- [end:primary_email_description]

--8<-- [start:system_formats_name]
Multiple Summarization Prompts
--8<-- [end:system_formats_name]

--8<-- [start:system_formats_description]
Different built-in prompts are applied per email class, so summaries fit the type of message.
--8<-- [end:system_formats_description]

--8<-- [start:custom_categories_name]
Custom Email Classes
--8<-- [end:custom_categories_name]

--8<-- [start:custom_categories_description]
Define your own classes in addition to the defaults to better reflect your inbox.
--8<-- [end:custom_categories_description]

--8<-- [start:custom_prompts_name]
Custom Summarization Prompts
--8<-- [end:custom_prompts_name]

--8<-- [start:custom_prompts_description]
Create or edit prompts and map them to any class for personalized summarization.
--8<-- [end:custom_prompts_description]

--8<-- [start:secondary_emails_name]
Secondary Email
--8<-- [end:secondary_emails_name]

--8<-- [start:secondary_emails_description]
Additional Gmail or Outlook email accounts can be connected beyond the primary inbox.
--8<-- [end:secondary_emails_description]

--8<-- [start:briefing_name]
Briefings
--8<-- [end:briefing_name]

--8<-- [start:briefing_description]
Digest unread emails of any class so you can catch up on missed messages quickly.
--8<-- [end:briefing_description]

--8<-- [start:on_demand_sync_name]
On-Demand Inbox Syncing
--8<-- [end:on_demand_sync_name]

--8<-- [start:on_demand_sync_description]
Fetch email history from a connected inbox.
--8<-- [end:on_demand_sync_description]

--8<-- [start:resummarization_name]
On-Demand Re-summarization
--8<-- [end:resummarization_name]

--8<-- [start:resummarization_description]
Re-generate summaries immediately after a summarization prompt update.
--8<-- [end:resummarization_description]

--8<-- [start:email_groups_name]
Topics
--8<-- [end:email_groups_name]

--8<-- [start:email_groups_description]
Group multiple classes by topic and apply view permissions.
--8<-- [end:email_groups_description]

--8<-- [start:user_channels_name]
Channels
--8<-- [end:user_channels_name]

--8<-- [start:user_channels_description]
Publish one or more topics to across your organization.
--8<-- [end:user_channels_description]

--8<-- [start:vendor_channels_name]
Vendor Channels
--8<-- [end:vendor_channels_name]

--8<-- [start:vendor_channels_description]
Receive directly published content from select vendors.
--8<-- [end:vendor_channels_description]

--8<-- [start:tts_name]
Text-to-Speech
--8<-- [end:tts_name]

--8<-- [start:tts_description]
Enable audio playback of stories and briefings.
--8<-- [end:tts_description]

--8<-- [start:multi_user_name]
Organizations
--8<-- [end:multi_user_name]

--8<-- [start:multi_user_description]
Add team members to your account to drive organizational alignment.
--8<-- [end:multi_user_description]


