# YouTube upload script

Uploads a video to YouTube and prints the embed URL to drop into a docs page.

## One-time setup (Google Cloud Console — do this once per Google account)

1. Go to https://console.cloud.google.com and create (or select) a project.
2. **APIs & Services > Library** — enable "YouTube Data API v3".
3. **APIs & Services > OAuth consent screen** — set User Type to "External",
   fill in the required fields, and add your own Google account under
   "Test users" (the app doesn't need to be verified for personal use).
4. **APIs & Services > Credentials > Create Credentials > OAuth client ID**
   — Application type: "Desktop app".
5. Download the credentials JSON and save it as `scripts/client_secret.json`
   (already gitignored — never commit this file).

## Install dependencies

```bash
conda activate docs
pip install -r scripts/requirements.txt
```

## Usage

```bash
python scripts/youtube_upload.py path/to/video.mp4 \
  --title "Chat with Your Calendar" \
  --description "How Claire's Google Calendar integration works." \
  --privacy unlisted
```

The first run opens a browser for one-time consent and caches the result in
`scripts/token.json` (also gitignored). Every run after that is headless.

The script prints the video ID and a ready-to-use `youtube-nocookie.com`
embed URL — paste it into the `<iframe src="...">` in the `.video-embed`
block on the relevant docs page.
