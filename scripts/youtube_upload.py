#!/usr/bin/env python3
"""Upload a video to YouTube via the YouTube Data API v3.

One-time setup (see scripts/README.md):
  1. Create OAuth client credentials (Desktop app) in Google Cloud Console.
  2. Save the downloaded JSON as scripts/client_secret.json.
  3. Run this script once — it opens a browser for consent and caches
     scripts/token.json for future headless runs.
"""
import argparse
import os
import pickle

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_SECRET_FILE = os.path.join(SCRIPT_DIR, "client_secret.json")
TOKEN_FILE = os.path.join(SCRIPT_DIR, "token.json")


def get_authenticated_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET_FILE):
                raise SystemExit(
                    f"Missing {CLIENT_SECRET_FILE} — see scripts/README.md for setup."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)

    return build("youtube", "v3", credentials=creds)


def upload_video(file_path, title, description, privacy_status):
    youtube = get_authenticated_service()
    body = {
        "snippet": {"title": title, "description": description},
        "status": {"privacyStatus": privacy_status},
    }
    media = MediaFileUpload(file_path, chunksize=-1, resumable=True)
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploaded {int(status.progress() * 100)}%")

    return response["id"]


def main():
    parser = argparse.ArgumentParser(description="Upload a video to YouTube")
    parser.add_argument("file", help="Path to the video file")
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", default="")
    parser.add_argument(
        "--privacy", default="unlisted", choices=["public", "unlisted", "private"]
    )
    args = parser.parse_args()

    video_id = upload_video(args.file, args.title, args.description, args.privacy)
    print(f"Uploaded. Video ID: {video_id}")
    print(f"Embed URL: https://www.youtube-nocookie.com/embed/{video_id}")


if __name__ == "__main__":
    main()
