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
