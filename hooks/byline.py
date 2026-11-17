"""Medium-style byline (avatar, author, read time, date) under a page's title.

Opt in per page with front matter:

    ---
    byline: true
    ---

Author and date come from the commit that first added the page (names are
normalized by .mailmap). Avatars live in docs/assets/images/authors/<first-last>.jpg;
without one, the author's initial is shown instead.
"""

import html
import math
import os
import re
import subprocess
from datetime import datetime

from mkdocs.utils import get_relative_url

WORDS_PER_MINUTE = 265  # Medium's reading speed


def _git(*args):
    return subprocess.run(
        ["git", *args], capture_output=True, text=True, check=False
    ).stdout.strip()


def _first_commit(path):
    """Author name and date of the commit that added the file."""
    log = _git("log", "--use-mailmap", "--follow", "--diff-filter=A",
               "--format=%aN|%aI", "--", path)
    if log:
        name, date = log.splitlines()[-1].split("|", 1)
        return name, datetime.fromisoformat(date)
    # Not committed yet
    return _git("config", "user.name") or "Unknown", datetime.now()


def _read_minutes(content):
    """Medium's formula: words at 265 wpm, plus 12s for the first image, 11s for the next, down to 3s each."""
    text = re.sub(r"<[^>]+>", " ", content)
    seconds = len(text.split()) / WORDS_PER_MINUTE * 60
    images = len(re.findall(r"<(img|video)\b", content))
    seconds += sum(max(12 - i, 3) for i in range(images))
    return max(1, math.ceil(seconds / 60))


def _avatar(name, page, config):
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    for ext in ("jpg", "png"):
        rel = f"assets/images/authors/{slug}.{ext}"
        if os.path.exists(os.path.join(config["docs_dir"], rel)):
            src = get_relative_url(rel, page.url)
            return f'<img class="byline-avatar" src="{src}" alt="" width="60" height="60">'
    return f'<span class="byline-avatar byline-initial" aria-hidden="true">{html.escape(name[:1].upper())}</span>'


def on_page_content(content, page, config, files):
    if not page.meta.get("byline"):
        return content

    name, date = _first_commit(page.file.abs_src_path)
    byline = (
        '<div class="byline">'
        f"{_avatar(name, page, config)}"
        '<div class="byline-text">'
        f'<span class="byline-author">{html.escape(name)}</span>'
        f'<span class="byline-meta">{_read_minutes(content)} min read · '
        f'<time datetime="{date:%Y-%m-%d}">{date:%b} {date.day}, {date.year}</time></span>'
        "</div></div>"
    )

    # Directly under the page title, or at the top if there is none
    head, sep, rest = content.partition("</h1>")
    return head + sep + byline + rest if sep else byline + content
