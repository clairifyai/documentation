---
name: mkdocs-callout-css
description: How to correctly style admonition callouts (!!! note/tip/warning) and their icons in this site's custom saas_theme, without repeating the specificity/caching mistakes made while building the "Zero-operator access" callout on ai-safety.md.
---

This site does NOT use the mkdocs-material theme — it uses a custom theme at
`saas_theme/` (`mkdocs.yml` sets `theme.name: null`, `theme.custom_dir: saas_theme/`).
None of mkdocs-material's built-in CSS ships with it. Only `saas_theme/css/theme.css`
(plus `syntax.css`, `annotations.css`, `search.css`) styles the page. This means
admonitions, icons, and images have almost no default styling — you are responsible
for all of it, and this theme's own CSS has traps that will silently eat your changes
if you don't account for them.

## The two specificity traps in `theme.css`

`theme.css` has generic, high-reach content rules that will beat a naive override:

```css
.md-content p { margin-bottom: 1.25em; }
.md-content img { margin: 1.5em 0; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); }
img, svg { display: block; max-width: 100%; }
```

- `.md-content p` and `.md-content img` both have specificity `(0,1,1)` — one class,
  one element. A bare `.admonition-title { margin: ... }` or `img.twemoji { margin: ... }`
  is also `(0,1,1)`, so **whichever rule comes later in the file wins**, not whichever
  you just wrote. This is exactly how repeated attempts to shrink the gap under an
  admonition title, and to zero out an icon's margin, silently did nothing for several
  iterations in this session — the fix was in the file but a later, equal-specificity
  rule was winning on source order.
- The fix: give your override a selector with **strictly higher specificity**, by
  prefixing it with `.md-content` too — e.g. `.md-content .admonition-title` `(0,2,0)`
  beats `.md-content p` `(0,1,1)`; `.md-content img.twemoji` `(0,2,1)` beats
  `.md-content img` `(0,1,1)`. Don't rely on rule order in the file to win a tie.
- The blanket `img, svg { display: block; max-width: 100%; }` rule exists for
  full-width content images (screenshots, diagrams). Any inline icon markup needs an
  explicit override (`display`, `width`, `height`, `max-width: none`) or it will try
  to fill its container width — this is why a bare Material icon SVG (no intrinsic
  size, just a `viewBox`) rendered enormous the first time it was added.

## Icon shortcodes render as two different DOM shapes

`pymdownx.emoji` is configured with `emoji_index: twemoji` + `emoji_generator: to_svg`
(see `mkdocs-base.yml`). A `:shortcode:` can resolve two different ways, and your CSS
must cover both:

- A plain unicode emoji (`:bulb:`) renders as a bare `<img class="twemoji" src="https://cdn.jsdelivr.net/.../twemoji/...svg">` — an **external network request** on every page load.
- A Material/FontAwesome/Octicon icon (`:material-lightbulb:`) renders as
  `<span class="twemoji"><svg>...</svg></span>` — an **inline SVG bundled locally**
  from the `material` pip package (`site-packages/material/templates/.icons/`), no
  network request. Prefer this for anything that should render identically offline
  and not depend on a third-party CDN staying up — the user in this session chose the
  plain emoji anyway for the friendlier look, which is a valid tradeoff, just know
  which one you're picking and why.

Because of the two shapes, a selector like `.twemoji img` (descendant combinator)
**will not match** the bare-`<img class="twemoji">` case — there is no separate
wrapper element to be a descendant of. You need the class-on-self case too:
`img.twemoji`. Always write overrides that hit all three: `.twemoji svg`,
`.twemoji img`, and `img.twemoji`.

## Don't hand-tune `vertical-align` to line up an icon with text

A fixed `vertical-align: -0.125em` (or any magic number) only lines up an icon with
text at one specific icon size — change the icon's `width`/`height` later and it goes
out of alignment again, and the fix looks like it "isn't working" when really the old
offset is just wrong for the new size. Make the icon's container (`.admonition-title`)
a flex row instead — this centers arbitrary children against each other by actual
rendered height, with no offset math to maintain:

```css
.md-content .admonition-title { display: flex; align-items: center; gap: 0.35em; margin: 0 0 0.5em; }
```

## The known-good block (as of this session)

```css
img, svg { display: block; max-width: 100%; }

.twemoji { display: inline-flex; vertical-align: -0.125em; }
.md-content .twemoji svg,
.md-content .twemoji img,
.md-content img.twemoji {
  display: inline;
  width: 1.2em;
  height: 1.2em;
  max-width: none;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}

.md-content .admonition-title { display: flex; align-items: center; gap: 0.35em; margin: 0 0 0.5em; }
.md-content .admonition-title .twemoji svg,
.md-content .admonition-title .twemoji img,
.md-content .admonition-title img.twemoji { width: 1.8em; height: 1.8em; }
```

Bump the title-icon size by changing only the `1.8em` values — the flex alignment
adapts automatically, no offset to re-tune.

## Markdown syntax for a callout with an icon

The `admonition` extension parses inline markdown (bold, icon shortcodes) inside the
quoted title string:

```markdown
!!! tip ":bulb: **Zero-operator access**"

    Body text goes here, indented 4 spaces.
```

## Workflow gotcha: `mkdocs serve` will NOT pick up theme changes live

The dev server's live-reload watcher only tracks `docs/` and `mkdocs.yml`
(confirmed in its own startup log: `Watching paths for changes: 'docs', 'mkdocs.yml'`).
It does **not** watch `saas_theme/` or `mkdocs-base.yml` (which `mkdocs.yml` inherits
from via `INHERIT:`). After editing theme CSS, plugin config, or nav structure, you
must kill and restart `mkdocs serve` — a normal browser refresh (even hard-refresh)
on an already-open tab will not show the change until the server itself restarts,
and the tab's live-reload websocket may also need a manual reload after the restart
since the old connection dies with the old process.

## Don't debug CSS by guessing — look at the computed styles

Repeatedly changing a CSS value and asking the user "does this look right now?"
without checking is how this session's fix took far more iterations than it should
have. Instead, use the `/browse` skill to load the actual running page and read
`getComputedStyle()` on the real element:

```js
const el = document.querySelector('.admonition.tip .admonition-title img.twemoji');
JSON.stringify({
  display: getComputedStyle(el).display,
  margin: getComputedStyle(el).margin,
  width: getComputedStyle(el).width,
})
```

This tells you immediately which rule is actually winning, instead of re-guessing
values against a mental model of the cascade that may be wrong (as happened twice in
this session with the `.md-content` specificity traps above). Take a real screenshot
and crop to the element in question before declaring anything fixed.
