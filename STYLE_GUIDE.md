# Clairify Docs — Style Guide

Authoring conventions for the Clairify documentation site. This file is for
contributors; it is **not** published to docs.clairify.ai. When a rule here and
`CLAUDE.md` disagree, update both so they stay in sync.

## Voice & Tone

- Write for a busy executive: Calm, plain, reassuring. Lead with the answer.
- Second person ("you"), present tense.
- Prefer short sentences. Cut filler and hype.

## Capitalization

### After a colon or a definition dash

When a word or phrase is followed by a **colon** (`:`) or a **keyword-then-dash**
(as in a definition or gloss), **capitalize the first word that follows.**

This applies to em dashes (`—`), en dashes (`–`), and hyphens (`-`) used to
introduce a definition or explanation.

**Do:**

- `**Swipe right — Mark as read.** Your email is marked read...`
- `A Personal Channel works like folders: It's a personal categorization system.`
- `- **Organize** — Split messages by any topic so you're not overwhelmed.`
- `Write for a busy executive: Calm, plain, reassuring.`

**Don't:**

- `**Swipe right — mark as read.**`
- `A Personal Channel works like folders: it's a personal categorization system.`
- `- **Organize** — split messages by any topic.`

## Callouts (Admonitions)

- Use `!!! note`, `!!! tip`, `!!! warning`, `!!! danger` for asides
  (via the `admonition` extension).
- Use `??? note` for collapsible sections (via `pymdownx.details`).
- Callout headers render **bold**, tinted to match the callout's accent color,
  with an emoji cue automatically prepended by the theme:
  note ℹ️ · tip 💡 · warning ⚠️ · danger 🚨 · question ❓ · bug 🐛
- Give a custom title only when it adds signal; otherwise let the type's default
  title stand.

## Icons

- Use Material icon syntax inline: `:material-icon-name:` (e.g.
  `:material-view-dashboard-outline:`).
- Icons render at emoji size, inline with the text. Reserve them for UI cues
  (buttons, menu items), not decoration.

## Reusable Content (Snippets)

- Shared blurbs live in `/includes` and embed via `--8<-- "filename.md"`.
- Put anything repeated across pages (FAQs, comparisons) in a snippet rather
  than copy-pasting.

## Links & Cross-References

- Link related pages by relative path: `[Troubleshooting](troubleshooting.md)`.
- When you introduce a concept covered elsewhere, link to it on first mention.

## Commits

- **One commit per file change** — commit history is public and surfaces on the
  homepage via the `git-latest-changes` plugin.
- Write descriptive, user-facing commit messages.
