# Phase 2 — Private Team Foundation

## Purpose

Phase 2 creates a **separate, signed-in team workspace foundation** for a small shared universe. The existing public no-login writing demo remains local-first and does not expose its browser archive to team members.

## Access Rules

| Area | Rule |
|---|---|
| Public demo | Continues to open without sign-in and keeps its archive in that browser only. |
| Team workspace | Requires an authenticated account and an accepted membership record. |
| Owner | Creates a team, creates/revokes invitations, and manages members. |
| Writer | Joins only through an invitation addressed to the same signed-in email address. |
| Visibility | New team content will default to **Private**. Future records may be marked **Team** or **Restricted** by an explicit author choice. |
| Local data | Browser-local chapters, Dump Book items, files, and notes are never imported, synced, or shared automatically. |

## Invitation Safety

The owner creates an invitation for a specific email address. The server stores only a **SHA-256 hash** of the random link token. The raw link is returned once to the owner for copying. Acceptance checks all of the following: the visitor is signed in, the signed-in email matches the invited email, the invitation is pending, and it has not expired or been revoked.

## Deliberate Deferral

This phase does **not** create shared canon records, cloud chapter sync, shared files, comments, live simultaneous editing, automated backup, or AI access to team material. Those remain later phases and require separate approval.
