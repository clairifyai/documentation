# Feature Matrix

!!! Warning

    This page is under construction, I'll remove it when the page is g2g.

<!--
Toggle implementation:
- Each feature cell has `.feat`; numeric ones add `data-value`.
- Default view = Availability → show ✔ / ✘.
- Values view → icons hidden only if `data-value` exists, replaced by number.
- Binary-only cells (no `data-value`) always stay ✔ / ✘.
- User can switch via Material button group; mode persisted in localStorage.

Supporting files:
- docs/assets/view-toggle.js → handles button clicks, swaps icon ↔ value, saves mode in localStorage.
- docs/assets/view-toggle.css → ensures icons/values show/hide correctly in each mode, aligns numbers.
-->

<div class="md-typeset">
  <div class="md-button-group" role="group">
    <button id="view-checks" class="md-button md-button--primary">Availablility</button>
    <button id="view-values" class="md-button">Usage Limits</button>
  </div>
</div>

<!--
Table constraints & maintenance:

- Snippets must be on their own line → Markdown tables not viable (leading | breaks).
- Use an HTML <table> with the md_in_html extension enabled.

Rules:
  A. Any HTML element containing Markdown, and all ancestors, must include markdown="1".
  B. <tr markdown="1"> elements must be flush-left (no indentation).
  C. Snippets must remain on their own line inside <td markdown="1">.

Tooltips:
- Feature names and descriptions are defined in includes/feature-tooltips.md.
- Each feature has 2 regions: <id>_name and <id>_description.
- The description snippet is injected into a hidden <span> inside the table cell.
- The <feat-tip> custom element displays the info icon and, via JS, reads the hidden description to set a tooltip (Material tooltips style if enabled).

Adding a new row:
1. Create or update the name & description regions in includes/feature-tooltips.md.
2. Add a new <tr markdown="1">.
   - In the first <td markdown="1">:
     • Include the name snippet.
     • Add <feat-tip id="<id>" markdown="1">:material-information-outline:</feat-tip>
     • Add a hidden <span id="tip-src-<id>"> with the description snippet inside.
   - In subsequent cells, add :material-check:{ .feat } or :material-close:{ .feat }.
   - If the feature has a numeric value, add it via data-value="N" on the :material-check:.

Single source of truth:
- Only maintain names and descriptions in includes/feature-tooltips.md.
- The table pulls both from snippets + renders tooltips automatically.
-->

<table markdown="1">
<tr markdown="1">
  <th>Feature</th>
  <th>Personal</th>
  <th>Professional</th>
  <th>Executive</th>
</tr>

<!-- BYOK -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:byok_name"
<feat-tip id="byok" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-byok" hidden>
--8<-- "feature-tooltips.md:byok_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
</tr>

<!-- PRIMARY EMAIL -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:primary_email_name"
<feat-tip id="primary_email" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-primary_email" hidden>
--8<-- "feature-tooltips.md:primary_email_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
</tr>

<!-- MULTIPLE SUMMARIZATION PROMPTS  -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:system_formats_name"
<feat-tip id="system_formats" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-system_formats" hidden>
--8<-- "feature-tooltips.md:system_formats_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
</tr>

<!-- CUSTOM SUMMARIZATION PROMPTS -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:custom_prompts_name"
<feat-tip id="custom_prompts" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-custom_prompts" hidden>
--8<-- "feature-tooltips.md:custom_prompts_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>

<!-- CUSTOM EMAIL CLASSES -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:custom_categories_name"
<feat-tip id="custom_categories" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-custom_categories" hidden>
--8<-- "feature-tooltips.md:custom_categories_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>

<!-- SECONDARY EMAILS -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:secondary_emails_name"
<feat-tip id="secondary_emails" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-secondary_emails" hidden>
--8<-- "feature-tooltips.md:secondary_emails_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>

<!-- BRIEFINGS -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:briefing_name"
<feat-tip id="briefing" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-briefing" hidden>
--8<-- "feature-tooltips.md:briefing_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>

<!-- ON-DEMAND SYNCING -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:on_demand_sync_name"
<feat-tip id="on_demand_sync" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-on_demand_sync" hidden>
--8<-- "feature-tooltips.md:on_demand_sync_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
  <td markdown="1">:material-check:{ .feat data-value="14" }</td>
</tr>

<!-- ON-DEMAND RE-SUMMARIZATION -->

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:resummarization_name"
<feat-tip id="resummarization" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-resummarization" hidden>
--8<-- "feature-tooltips.md:resummarization_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>


<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:email_groups_name"
<feat-tip id="email_groups" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-email_groups" hidden>
--8<-- "feature-tooltips.md:email_groups_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
  <td markdown="1">:material-check:{ .feat data-value="14" }</td>
</tr>

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:user_channels_name"
<feat-tip id="user_channels" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-user_channels" hidden>
--8<-- "feature-tooltips.md:user_channels_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
  <td markdown="1">:material-check:{ .feat data-value="14" }</td>
</tr>

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:vendor_channels_name"
<feat-tip id="vendor_channels" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-vendor_channels" hidden>
--8<-- "feature-tooltips.md:vendor_channels_description"
</span>
  </td>
  <td markdown="1">:material-check:{ .feat data-value="1" }</td>
  <td markdown="1">:material-check:{ .feat data-value="3" }</td>
  <td markdown="1">:material-check:{ .feat data-value="7" }</td>
</tr>

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:tts_name"
<feat-tip id="tts" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-tts" hidden>
--8<-- "feature-tooltips.md:tts_description"
</span>
  </td>
  <td markdown="1">:material-close:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
</tr>

<tr markdown="1">
  <td markdown="1">
--8<-- "feature-tooltips.md:multi_user_name"
<feat-tip id="multi_user" markdown="1">:material-information-outline:</feat-tip>
<span id="tip-src-multi_user" hidden>
--8<-- "feature-tooltips.md:multi_user_description"
</span>
  </td>
  <td markdown="1">:material-close:{ .feat }</td>
  <td markdown="1">:material-close:{ .feat }</td>
  <td markdown="1">:material-check:{ .feat }</td>
</tr>

</table>
