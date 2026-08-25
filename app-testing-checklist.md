# The Ren Protocol — Private Web-App Test Checklist

This is a **browser-based personal writing workspace**, not a native iOS or Android application. The practical release path is therefore an internal browser walkthrough first, followed only by optional trusted-reader feedback. The core archive remains browser-local; no public analytics, crash tracker, login requirement, or external beta service is needed for normal writing.

## 1. Internal Alpha Walkthrough

| Area | Test case | Expected result | Status |
|---|---|---|---|
| Primary writing flow | Open Home, open Writing desk, save a draft, return with Back | Prose remains local and Back returns to the actual prior workspace | Passed |
| Capture flow | Open Dump Book from Home, main navigation, and the feature tabs | The same local capture desk is easy to reach from all three places | Passed |
| Navigation trail | Go Home → Story planning → AI Studio → Back | Back names and returns to the real previous workspace instead of always sending the author to Write | Passed |
| Local validation | Attempt to save an empty note and an invalid link | No blank item is created; helpful messages explain what is needed | Passed |
| Local persistence | Save one temporary tagged note, reload, then remove it | The note survives reload and can be deleted; temporary validation material was cleared afterward | Passed |
| Creature review | Scan a temporary line containing `grinned` and `shrugged` | Both configured terms are flagged locally with copyable author-choice alternatives | Passed |
| Co-writer | Open the preflight, submit an approved temporary original seed, and discard the result | The prompt shows the exact seed and disclosure; Claude returns a separate editable proposal; no text merges until the author chooses it | Passed |
| Focused rewrite | Select a temporary passage, choose Darker, submit, then discard | The rewrite appears as a separate editable proposal with copy, discard, and explicit replace controls; the source passage does not change on its own | Passed |
| AI privacy | Open helpers without submitting | Typing or opening a preflight makes no request; each helper offers a private exit | Passed |

## 2. Safe Boundary and Interruption Checks

The current release checks browser-relevant boundaries rather than mobile-app-only cases such as phone calls or battery events. Empty capture, invalid-link rejection, repeated navigation, a full route reload, local persistence, and cleanup of temporary material were tested. The personal archive does not depend on a network connection for normal writing, local organization, or local creature-rule scans; only an explicit AI request needs connectivity.

During focused rewrite testing, the first Darker request was correctly stopped by server validation because the new client-side choice had not yet been added to the secure request contract. The contract was synchronized, automated checks and the production build passed again, and the retry returned the expected separate proposal. This was a safe failure: it sent no text to the model before validation succeeded.

## 3. Browser Compatibility Check

Desktop and 375-pixel phone layouts were reviewed for Home, Chapter Stream, Dump Book, and AI Studio. The feature tabs stack into two columns on a phone, capture controls remain readable, and the archive navigation stays available in a compact dark rail. Type checking, 17 automated tests, and the production build also passed.

## 4. Optional Trusted Beta Feedback

If you want a second opinion, ask one trusted reader or writing friend to use a **copy** of the workspace with non-sensitive sample material. Give them this short task: find Dump Book, save one note, return to Home, open Story Book, and tell you which label felt unclear. Ask for a screenshot only if they are comfortable sharing it. Do not ask them to upload your manuscript or turn on public tracking.

## 5. Privacy-First Diagnostic Approach

No user-behaviour analytics or third-party crash reporting was added because this is a personal local-first tool. During development, errors are checked through the local browser console and application logs. If a future published version needs diagnostics, add them only with a clear author opt-in and an explanation of exactly what leaves the browser.
