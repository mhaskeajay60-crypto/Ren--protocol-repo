# Evaluation of the Supplied 5-Hour App Plan

## Verdict

The supplied plan has a **good instinct**: protect the three things that can hurt an author most—PDF import, saved writing, and phone navigation—before adding something shiny. However, it was written for a much earlier, less-tested version of the app. **Two of its three “critical fixes” are already largely present**, and its fourth task conflicts with its own request not to touch save logic.

The safest approach is therefore not to apply the plan word-for-word. Use its five-hour window for **focused proof, only fix a reproduced failure, and add one much smaller read-only quality-of-life detail only if the core checks pass.** Nothing has been changed by this evaluation.

| Plan item | Current app status | Evaluation |
| --- | --- | --- |
| PDF import crash fix | The app already has a 10 MB limit, loading message, extracted-text preview, empty-text explanation, and protected/damaged-file error card. It creates a separate First Draft only after approval.[1] | **Test first; do not rebuild.** Improve wording only if a real test reveals a confusing failure. |
| Autosave and draft switching | The editor updates in-memory draft state while typing, switches save the current draft through the existing chapter workflow, and autosave persists every 30 seconds.[1] | **Worth testing.** The only meaningful open risk is closing or refreshing before the 30-second timer. |
| Phone navigation trap | Phone Feature Map already uses a height cap and scrollable modal, while the footer stays visible and sticky.[1] | **Test first; do not blindly add CSS.** The proposed CSS duplicates current behavior. |
| Quick Chapter Dashboard | Several parts already exist in the chapter inspector, saved timestamps, chapter metadata, continuity review, and private Masterbook-link review.[1] | **Not the best first micro-feature.** A small “last saved” display is safer than another modal. |

## What the original plan got right

The original note correctly prioritizes reliability over a large redesign. It also understands that a read-only feature is lower risk than a new system that changes chapters or world facts. Testing a near-limit PDF, switching chapters, and opening a long phone modal are all sensible author-facing checks.

The note also correctly says that a failure should show a clear message instead of leaving the author guessing. That principle already matches The Ren Protocol’s current local-only PDF messages and review-first safeguards.[1]

## Important issues in the original plan

**Flaw 1 — It assumes the PDF importer has no safety handling.**

**Problem:** The note asks for a new “File too large or unreadable” branch as though parsing errors fail silently. The current importer already blocks files over 10 MB, warns when the PDF reader is still loading, explains image-only PDFs, and gives a protected/damaged-format message after a caught error.[1]

**Why it matters:** Rebuilding a working safety path in a five-hour window can introduce a real regression.

**Suggested solution:** Run two tests first: one readable PDF near the 10 MB limit and one image-only or intentionally unreadable PDF. Change the message only if a test shows that the current wording is unclear. **Not applied.**

**Your opinion:** ______________________________

**Flaw 2 — “No save-logic changes” conflicts with adding a 10-second force-save and a page-close save.**

**Problem:** The note says not to touch the core save logic, then asks for a new storage write every ten seconds and an unload-time write. Those are direct changes to the core saving behavior.

**Why it matters:** Autosave is sensitive. More writes may be fine, but changing it without reproducing a loss can create duplicated activity, unexpected word-count effects, or confusing save times.

**Suggested solution:** First test writing 100 words, switching chapters, switching draft versions, reloading, and closing/reopening the page in a test-only browser archive. If a failure occurs only on close before the 30-second timer, make the smallest isolated change: a `pagehide` save using the existing `saveDraft(false)` path. Do not add both a ten-second timer and a new unload system. **Not applied.**

**Your opinion:** ______________________________

**Flaw 3 — The phone-modal fix is probably already in the app.**

**Problem:** The plan proposes `max-height: 80vh` and `overflow-y: auto`. The current modal already has scroll overflow, a phone-safe dynamic viewport height cap, and a sticky action footer.[1]

**Why it matters:** Adding another broad rule may make other forms scroll awkwardly or cover fields behind the sticky footer.

**Suggested solution:** On a 375-pixel phone layout, open **More → All tools**, scroll to the separate Team entry, and tap outside the map. If everything is reachable and closes, do nothing. If not, target only the Feature Map list or modal body, not all modals. **Not applied.**

**Your opinion:** ______________________________

**Flaw 4 — The Quick Chapter Dashboard overlaps existing tools.**

**Problem:** The proposed pop-up repeats several existing ideas: word count is visible in Write, chapter metadata is already stored, continuity review scans local story information, and Possible Masterbook Updates already safely finds known records for explicit review.[1]

**Why it matters:** A second “dashboard” can make the writing screen look busy and give two different answers for the same chapter.

**Suggested solution:** If a micro-feature is wanted after testing, use a small read-only **Saved just now / Saved at 10:42** label beside Save chapter. It improves confidence without another modal. A later Chapter Context Tray remains a better larger feature because it joins information instead of repeating it. **Not applied.**

**Your opinion:** ______________________________

**Flaw 5 — “Do not write tests or documentation” is the wrong shortcut for a stability session.**

**Problem:** The note asks to skip tests and documentation while the purpose is to make the app survivable.

**Why it matters:** A quick change without a small repeatable check can bring back a bug later, especially after future UI work.

**Suggested solution:** Keep testing short, not absent. Save one tiny test for any new pure helper and record which exact manual checks passed. The app’s earlier releases have used this approach successfully.[2] **Not applied.**

**Your opinion:** ______________________________

## A safer five-hour session

This plan fits exactly **300 minutes**. It assumes no large feature is started until the reliability checks finish.

| Time | Task | Stop condition |
| --- | --- | --- |
| 15 min | Protect the session | Export the current local archive and use a clean test browser state. |
| 65 min | PDF proof | Test one readable near-limit PDF, one image-only PDF, and one oversize PDF. Fix only a reproduced confusing error. |
| 60 min | Save-and-switch proof | Type test words, switch chapter and version, reload, and test a close/reopen case. Fix only a reproduced loss. |
| 35 min | Phone Feature Map proof | Open More → All tools, reach Private Team, close map, and confirm the dock stays usable. Fix only a reproduced trap. |
| 45 min | Regression check | Repeat Write, PDF, Feature Map, and Relationship Web smoke checks. |
| 50 min | One small win | Only if all checks pass: add a small visible last-saved label, not a new dashboard modal. |
| 30 min | Final validation | Run the existing checks, record results, and checkpoint. |

## Recommended decision

**Keep the reliability-first idea. Replace the “four changes in five hours” idea with “three focused tests, repair only real failures, then one tiny non-duplicated improvement.”** That gives the author a more stable app and avoids breaking the privacy-first, review-first systems already in place.

No code, story records, Masterbook entries, relationship bonds, or Team canon were changed during this evaluation.

## References

[1]: ./client/index.html "Current browser-local author app implementation"
[2]: ./validation-notes.md "The Ren Protocol validation record"
