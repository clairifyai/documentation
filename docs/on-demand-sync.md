# Inbox Sync

Clairify keeps your inbox data up to date through three sync mechanisms.

## What sync does

A sync job fetches emails from your connected inboxes and updates the Clairify database:

- Syncs **read and unread** labels to match your email client
- Syncs **deleted status** — if an email is deleted in your email client, it is removed from Clairify

## On-demand sync

Manually trigger a sync for any connected inbox. Fetches the last 3 days of email.

Use this to restore continuity if:

- You logged out (Clairify loses authorization to fetch emails while logged out)
- The service experienced downtime

## Nightly sync

The same sync job runs automatically every night at midnight UTC, covering the last 3 days of email.

## Initial sync

When you create your account or connect an additional inbox, Clairify ingests 7 days of email.
