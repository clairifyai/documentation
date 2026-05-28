# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **MkDocs documentation site** for [Clairify](https://docs.clairify.ai) — an AI-powered platform for executives that consolidates inbound communications. Documentation is deployed to GitHub Pages with a custom domain.

## Environment Setup

Uses Conda for environment management. Dependencies are not tracked in a requirements file — install manually:

```bash
conda create --name docs
conda activate docs
pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin mkdocs-git-latest-changes-plugin mkdocs-caption mkdocs-exclude
```

## Common Commands

```bash
mkdocs serve       # Local development server (live reload)
mkdocs build       # Build static site to /site
mkdocs gh-deploy   # Deploy to GitHub Pages (docs.clairify.ai)
```

## Architecture

```
docs/              # All documentation content (Markdown)
  assets/          # Custom JS/CSS and images
  release-notes/   # Versioned release notes
includes/          # Reusable snippets (referenced via pymdownx.snippets)
mkdocs.yml         # Site config, nav structure, plugins, extensions
site/              # Generated output — do not edit, not committed
```

**Key configuration** (`mkdocs.yml`):
- Theme: Material with `content.tooltips` feature
- Snippets base path: `/includes` — use `--8<-- "filename.md"` syntax to embed
- Excluded from build (WIP): `slack.md`, `executive-producers.md`
- `git-latest-changes` plugin powers the "Recent Changes" section on the homepage

**Custom assets** (`docs/assets/`):
- `feature-matrix.js` / `feature-matrix.css` — toggleable pricing/limits table
- `feat-tip.js` — custom `<feat-tip>` web component for feature tooltips; tooltip content comes from `/includes/feature-tooltips.md`

## Content Conventions

- **Admonitions**: Use `!!! note`, `!!! tip`, `!!! warning` etc. (via `admonition` extension)
- **Collapsible sections**: Use `??? note` (via `pymdownx.details`)
- **Abbreviations**: Defined in snippets and auto-applied via `abbr` extension
- **Icons**: Use Material icon syntax `:material-icon-name:`

## Git Workflow

Make **separate commits per file change** — commit history serves as public release notes and is surfaced on the homepage via the `git-latest-changes` plugin. Write descriptive commit messages as they are user-facing.

Deployment is manual: run `mkdocs gh-deploy` from the main branch after changes are ready.


<!-- >>> claude-agents toolkit (DO NOT EDIT THIS BLOCK) >>> -->
<!-- version: 1.0.38 -->
## Engineering Principles (MANDATORY — applies to ALL work)

### Research Before Fixing
- **Never guess.** Before changing code, read the relevant source files, docs, and configs.
- Understand WHY something is broken before attempting a fix.
- If your first fix doesn't work, STOP. Don't try another guess. Re-read the code.
- Use explore-light (Haiku, 1x cost) to scan the codebase before expensive agents investigate.

### No Over-Engineering
- **Do exactly what's needed.** Don't add abstractions, utilities, or frameworks unless the code already uses them.
- Match existing patterns — run explore-light to find how similar code is structured before writing new code.
- A bug fix touches the minimum files possible. A feature matches the existing architecture.
- If you're creating a new class/helper/utility that nothing else in the codebase uses, you're over-engineering.

### Test Before Shipping
- **Run tests locally before pushing.** Never push untested code.
- If the project has `/precheck`, run it. If it has `/qa`, run it in commit mode.
- After fixing a bug, verify the fix AND verify nothing else broke (differential testing).
- If 3+ consecutive fix attempts fail, STOP. Step back and reassess the root cause from scratch.

### Deployment Safety
- **Never modify production systems without explicit confirmation.**
- Don't change deploy targets, CI pipeline structure, or infrastructure config silently.
- Don't overwrite existing files during deployment without asking.
- If a deployment breaks something, investigate before attempting to fix. Don't cascade.

## Toolkit Awareness (MANDATORY — READ THIS FIRST)

You have a **claude-agents toolkit** installed in this project. It provides specialized
agents, skills, and hooks that handle domain-specific work better and cheaper.

**You are the ORCHESTRATOR.** The triage router fires on every message with a routing
table and SPEED score. Use it to decide: toolkit or you?

### When to use the toolkit (SPEED score 2+):
- **Multi-step workflows**: `/pr`, `/deploy`, `/planning`, `/implement`, `/qa`, `/ci-fix`
  encode battle-tested sequences you'd otherwise do manually and forget steps
- **Domain expertise**: SRE, QA, frontend, backend agents have project context baked in
- **Cost savings**: Haiku/Sonnet agents handle 80% of tasks at 1/60th the cost of Opus
- **Parallelism**: Team skills spawn multiple agents working simultaneously

### When to use YOU directly (SPEED score 0-1):
- **Quick lookups**: Read/Grep/Glob for finding a file, checking a value, reading code
- **Small targeted edits**: 1-2 file changes where you already know what to do
- **Complex reasoning**: Architecture decisions, debugging novel problems, nuanced tradeoffs
- **Conversation flow**: Follow-up questions, clarifications, explaining code
- **Creative problem-solving**: When the task doesn't fit any existing pattern
- **Judgment calls**: Security reviews, design decisions, "should we even do this?"

### The balance:
The toolkit handles **process** (repeatable workflows, domain-specific checks, multi-step
sequences). You handle **judgment** (reasoning, creativity, novel problems, architecture).

A senior engineer doesn't do everything themselves — they delegate routine work and focus
their expertise where it matters most. That's you. The toolkit is your team.

**Don't over-delegate**: If it's faster to just Read a file and answer, do it.
**Don't under-delegate**: If it's a 5-step workflow the toolkit has a skill for, use it.

### Project Knowledge System

If this project has been calibrated (`/calibrate`), deep context is available:

- **`.claude/project-profile.md`** — Architecture patterns, coding conventions, domain model,
  testing style. Read this before writing any code to match the project's patterns.
- **`.claude/knowledge/`** — The toolkit's long-term memory for this project:
  - `shared/conventions.md` — Coding rules learned from corrections. **Read before writing code.**
  - `shared/domain.md` — Business rules beyond what's in the code. **Read before domain decisions.**
  - `shared/vocabulary.md` — What the team calls things. **Use these terms.**
  - `shared/patterns.md` — Architecture patterns. **Follow these when adding new code.**
  - `agents/{your-name}.md` — Your past learning. **Read on session start.**
  - **Write back** when you learn something new — corrections, discoveries, decisions.
  - See `knowledge/README.md` for the full protocol.
- **`.claude/knowledge/external/sources.md`** — Where team knowledge lives outside code
  (Notion, Linear, Figma, etc.). Check before making decisions that might already be documented.

## Session Start Behavior (MANDATORY)

On your FIRST response in every new session, ALWAYS start with a brief status line
using context from the SessionStart hook. Include:
- Current branch + uncommitted file count
- Docker/infra status (if problems detected)
- Open PRs or assigned issues (if any)
- Any red flags (pending migrations, expired tokens)

Format: 1-3 compact lines before addressing the user's request. Example:
```
📋 project — main | 5 uncommitted | Docker: postgres ✓ redis ✓ | 2 open PRs
```
Then proceed with the user's actual request.

**CRITICAL — Greetings and vague first messages**: If the user's first message is a
greeting ("hey", "hi", "hello", "yo", "sup") or vague ("help", "what's up",
"what should I work on") or ANY message under 5 words with no specific task —
**ALWAYS use the `/onboard` skill**. Never respond to greetings yourself. The
bootstrap hook status line is a quick snapshot — `/onboard` gives the real briefing
with open PRs, issues, priorities, and actionable next steps.

## Routing Trace (MANDATORY)

On EVERY response, show a compact routing trace so the user understands the decision
path. Place it at the end of your response in a dimmed block:

```
🔀 Routing: [what triage decided] → [agent/skill/tool used] ([cost tier])
   Why: [1-line reason for this routing choice]
```

Examples:
```
🔀 Routing: backend bug fix → python-backend agent (Sonnet, 10x)
   Why: touches backend/app/services/, needs CLAUDE.md context, SPEED=4
```
```
🔀 Routing: file lookup → Grep (built-in, 0x)
   Why: single-file search, no project context needed, SPEED=0
```

Rules:
- Always show the SPEED score breakdown if score >= 2
- Show which hook provided the context (triage-router, bootstrap, etc.)
- If you chose NOT to use the triage router's suggestion, explain why
- Skip the trace only for simple follow-up messages in an ongoing conversation
<!-- <<< claude-agents toolkit <<< -->
