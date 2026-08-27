# Validation Notes

## Modern Noir Codex Visual Refresh

The author workspace now has one cohesive dark-and-gold **Noir Codex** visual system rather than the earlier mix of pale purple, teal, and generic dashboard panels. The persistent archive rail is deep indigo with an antique-gold protocol line; the working surface uses warm parchment; active actions, markers, and progress signals use gold; and major story titles use the editorial serif already embedded in the app. Form fields and manuscript text stay on calm, high-contrast paper planes for long writing sessions.

Desk, Write, World, Plan, Vault, and Critic were refreshed without changing their data or routes. Desk now reads as an author command center; Write keeps a spacious manuscript plane and clear imported-PDF card; World keeps its visual atlas but uses the shared archive palette; Plan has a dark story-lane hero and gold active lane; Vault uses a matching private-intake surface; and Critic has a calmer reader-guidance entry. Native 375-pixel captures confirmed that headers, Back to Home, dock controls, cards, active lane, and buttons remain readable and touch-accessible. Desktop captures confirmed the rail, working surface, writing desk, atlas, planner, vault, and critic retain clear hierarchy.

No author prose, Masterbook entry, Story Vault item, review, imported file, chapter version, saved report, Team record, or privacy boundary changed. `pnpm run check`, `pnpm test` (**59 tests**), `pnpm run build`, and `git diff --check` passed. The existing runtime-resolved storage-path and large PDF/team bundle warnings remain non-blocking.

## High-Contrast Critic Report Card

The saved Critic report is now styled as a dedicated dark story-review card instead of the pale generic form shown in the author’s phone screenshot. It uses a deep indigo reading surface, white and pale-lilac text with high contrast, larger mobile body text, spaced evidence cards, an independent scroll area, and an anchored action bar. The surrounding Critic screen also uses the less judgmental heading **See what a reader may notice**.

The report action bar now shows only two immediate choices: **Save to Notes** and **Done**. Less frequent actions—**My saved reports**, **Make fix-it list**, and **Delete report**—sit under one short **More report actions** expander. The original report, its scores or non-scored reader reaction, saved note behavior, local report shelf, local fix-it action, deletion action, and return action are retained. No report contents, chapter prose, Masterbook entry, or privacy setting is changed by this visual repair.

The scoped styles and action bindings were audited in the source; `pnpm run check`, `pnpm test` (**59 tests**), `pnpm run build`, and `git diff --check` passed. The updated phone Critic entry was captured at 375 pixels and shows the supportive feedback-mode explanation above the review button. The known runtime-resolved asset-path and large PDF/team bundle warnings remain non-blocking.

## Casual Reader, Strict Critic, and Private Saved Reports

The chapter feedback tool now asks the author to choose a feedback style. **Casual Reader** is the default: it returns a kind, specific reader reaction with no numerical score. **Strict Critic** is the opt-in craft review: it keeps the detailed eight-area scores and evidence-based improvement suggestions. Both prompts state that they assess the draft, not the author, must cite the supplied chapter rather than invent quotations or reader reactions, and cannot revise manuscript text.

Each new result is saved privately in the browser as a distinct report. Before requesting a new result, the app computes a local fingerprint from the exact chapter text, selected draft, focus, style, and author goal. Repeating the same request reopens the existing saved report instead of generating another changing score. A changed chapter, feedback style, focus, or goal is treated as a different deliberate request. Existing reports remain readable as Strict Critic reports.

The report view now identifies the feedback style, explains that a Strict Critic score is one AI reading rather than a grade, and renames harsh phrasing to **Craft concerns to consider** or **What a reader may want more of**. It includes **Save report to Notes**, which creates one separate private Notes Desk record of the report, and **My saved reports**, which opens the local report shelf. Neither action edits chapter prose or Masterbook records.

The Critic form was inspected in the running app and exposes both styles, with Casual Reader selected by default. The Critic home screen and native 375-pixel phone capture show the supportive style explanation above the review action. Structured response parser tests cover both an eight-score Strict Critic response and a non-scored Casual Reader response. `pnpm run check`, `pnpm test` (**59 tests**), and `git diff --check` passed. The project build had already passed after the mode implementation; its known runtime-resolved asset-path and large PDF/team bundle warnings remain non-blocking.

## Chapter Draft, Final Draft, and PDF Import Repair

The author-facing chapter workspace now uses exactly two visible versions: **Chapter Draft** and **Final Draft**. Existing local archives migrate safely on load: the former Main Draft becomes Chapter Draft, the former Final Draft remains Final Draft, and an older First Try becomes Chapter Draft only when no Main Draft exists. If an archive contains both different First Try and Main Draft text, the former First Try is retained in local recovery metadata rather than silently discarded. No Final Draft is overwritten during that migration.

An author-approved chapter PDF now creates a new chapter with its extracted text in **Chapter Draft**. The importer remains local-only, has the existing 10 MB limit and private preview, does not keep the original PDF, and never replaces any existing chapter or Final Draft. The writing desk includes an explicit **Copy to Final Draft** action. It preserves Chapter Draft and asks before replacing an existing Final Draft.

The test preview imported the safe PDF fixture as a 29-word new Chapter Draft, reloaded it through the legacy-version migration, and then copied it to Final Draft with the explicit action. Imported-chapter history identified it as **Local PDF import · Chapter Draft**. Native 375-pixel phone and 1280-pixel desktop captures verified the two tabs, the import card, and the direct actions. `pnpm run check`, `pnpm test` (**58 tests**), `pnpm run build`, and `git diff --check` passed. Existing runtime-resolved asset-path and large PDF/team bundle warnings remain non-blocking.

## Chapter PDF Entry Redesign

## Compact Tool Kit and Workspace View Preference

The phone **More** control now opens a compact dark **Tool kit** drawer rather than a long, pale list. Four frequent paths—All tools, Story links, Check a chapter, and Player Backup—are visible immediately as two-by-two cards. The remaining existing actions, including restore, Scene ideas, Notes, optional AI help, and Project settings, stay reachable under one short **More tools** expander. The drawer includes a direct **Workspace view** entry, a visible close control, and a full-width Done action; no tool, chapter, or local record was removed.

Project settings now store an author-chosen local **Workspace view**: **Auto** follows the current screen; **Phone** retains the touch-focused layout; and **Desktop tools** preserves the full author navigation for wider displays. This preference is stored only inside the existing browser-local project archive and does not upload, alter, share, or delete story material. The isolated preview confirmed the selector exposes all three choices and that saving Phone rerenders cleanly.

Native 375-pixel and 1280-pixel captures confirmed the unaffected Phone and Desktop entry layouts remain legible. The compact drawer’s actions and all five expanded actions were inspected through live preview controls. `pnpm run check`, `pnpm test` (**55 tests**), `pnpm run build`, and `git diff --check` passed. The known runtime-resolved static-asset paths and large PDF/team bundle warnings remain non-blocking.

The Write header now treats existing chapter material as a story workflow rather than a technical upload. The visible card asks **Already wrote a chapter?** and explains the sequence in plain language: choose the chapter PDF, read the private preview, and add it as a safe separate First Try. Its actions are **Choose chapter PDF** and **My imported chapters**. The separate Review Masterbook Updates action remains directly below the card so the two jobs are not confused.

The existing import behavior is unchanged: the PDF remains local, stays under the existing 10 MB limit, is previewed before use, never overwrites an existing chapter, and requires the author to choose a separate First Try or Keep private. Desktop and 375-pixel phone captures confirmed the card is clearly visible, does not obscure the chapter list/editor, and remains above the phone dock. `pnpm run check`, `pnpm test` (**53 tests**), `pnpm run build`, and `git diff --check` passed; only the known non-blocking runtime-resolved static-asset and large PDF/team chunk warnings remain.

## Prominent Review Exit and Progressive Folio Details

The Review Ledger now retains the small header close control and adds a full-width **← Close review and return to story** action directly beneath **Review current folio**. The existing in-app Back action also closes Review before navigating to the earlier local workspace. These exit paths only change the review panel’s visible state; they do not run a check, save prose, or change continuity items.

Folio Details is now a three-step local form rather than one large Google-form-like screen. Step 1 is Quick facts (status, point of view, setting), Step 2 is Where it fits (story date, arc, thread), and Step 3 is What it changes (summary, purpose, emotional turn, brief). Every existing field and value is preserved; the form only writes them after the final **Save details** action. The author can use **Keep as it is** at any step without changing anything.

Desktop and 375-pixel phone Write captures remained clear after the repair; the phone view retains direct PDF actions, Masterbook review, visible chapter list, and the fixed Pocket dock. The final automated gate passed: `pnpm run check`, `pnpm test` (**53 tests**), `pnpm run build`, and `git diff --check`. Known build output remains limited to runtime-resolved static asset and large PDF/team chunk warnings.

## Review Ledger Exit and Relationship Web Discovery Repair

The Review Ledger now has two safe exits. First, the in-app **Back** action closes an open Review Ledger before navigating away from the current workspace. Second, the ledger header has an explicit **Close review** control. This prevents the desktop inspector from remaining open over a different page after the author leaves review. Neither action changes chapter prose, flags, intentions, or author data.

The Masterbook Atlas hero now has a direct **Relationship Web** button and a short plain-language line that names the new choices: Family, Love, Enemy, Killer/Target, secret knowledge, and Web / Family Tree / Circle views. The Feature Map’s World section now repeats those exact features through direct Relationship Web actions rather than only one generic link. Desktop and 375-pixel phone captures verified the Masterbook entry is visible, readable, and above the phone dock. The writing view continues to show direct PDF import/history and private Masterbook-review actions.

The final automated gate passed after these navigation and discovery repairs: `pnpm run check`, `pnpm test` (**53 tests**), `pnpm run build`, and `git diff --check`. The known runtime-resolved static-asset and large PDF/team bundle warnings remain non-blocking.

## Character Cards, Relationship Views, and Chapter Update Review

The Character Codex now displays its existing Character Dossiers as a compact card grid: each author-created card shows a personal sigil, name, role/status preview, existing optional tags, and a direct Dossier action. It does not create portraits, infer character details, or replace existing dossiers. The compact two-column phone card treatment was checked with the empty Masterbook Atlas path; saved characters continue to use the existing dossier record model.

Relationship editor choices now include Family, Love, Friend, Rival, Enemy, Killer / Target, Master / Student, Ally, Unknown, and Complicated. The author may separately select an optional Bond style, **who knows a secret**, private secret knowledge, reader reveal timing, pressure point, and story anchor. The Relationship Web supports author-chosen Relationship Web, Family Tree, and Faction Circle arrangements; these change only how existing saved bonds are viewed. Family Tree does not infer bloodlines, and Faction Circle does not create factions or group membership. Bond colors/dashed styles are only visual labels chosen locally by the author.

Explicitly saved chapters can now offer a private update only when the author writes an exact marker: `@Name dies` or `@Name gains skill: Skill name`. The review window displays the exact detected marker and requires a separate **Approve private status/skill** action. Approval changes only the selected local Character Dossier, adds a source-chapter history entry, and records the approval on that chapter. It does not react to unmarked ordinary prose, does not invoke AI or a network request, and does not change shared Team canon.

The final 375-pixel Connections capture confirmed readable Relationship Web controls, empty guidance, Bond Ledger area, and the dark Chapter Connections tile. The desktop Connections capture confirmed the visual-view picker, Focus Thread picker, legend, and layout with no overlap. The final automated gate passed: `pnpm run check`, `pnpm test` (**53 tests**), `pnpm run build`, and `git diff --check`. The only build messages are the established runtime-resolved static-asset and large PDF/team chunk warnings.

- The standalone document loads successfully in the live preview and the responsive writing workspace renders at desktop and mobile sizes.
- The Masterbook navigation and add-record modal open correctly.
- Live validation found that the generic field lookup confused the document’s description metadata with the Masterbook description control. The lookup is now scoped to the active form and safely handles optional values.

## Expansion Validation

The Author Dashboard loads with local daily and manuscript progress, revision counters, shortcuts, activity, and bookmarks. The Story Board scene form was used to create a temporary planned scene; the scene persisted locally, generated a timeline event, and appeared in the Planned lane. The temporary test content will be removed before delivery so the archive remains clean for the author’s own material.

## AI Organizer Validation

The Brain Dump Inbox presented its privacy explanation before any external request. A non-sensitive fictional sample was sent only after selecting **Organize with AI**. The server returned fourteen structured, review-first proposals covering characters, world rules, a location, lore, a faction, an artifact, a scene, plot threads, and revision issues. None had been filed automatically; every proposal remained selectable for author review.

## Chapter Composer Validation

A non-sensitive scene brief, requirements, point of view, and tone were supplied to the Chapter Composer. The service produced one editable prose section in a separate review panel, along with a craft note. The active chapter remained unchanged while the section was under review; explicit actions for discard, copy, replace, append, and insert-at-cursor were visible. Temporary sample content will be removed after merge validation.

## Tagged Organization Validation

The Brain Dump Organizer processed a non-sensitive fictional sample and returned thirteen review-first proposals. Each proposal showed an explicit review category, its local filing type, and concise tag chips. Tags and categories are now preserved when the author chooses to file selected items; they remain suggestions until that explicit action.

## Guided Writing Toolkit Validation

The new in-app **Back** control returned from the Chapter Stream to the Author Desk without relying on browser navigation. A reusable Scene Turn outline was added to a chapter brief while manuscript prose stayed empty. A non-sensitive sample passage was selected, rewritten through the explicit review request, and remained unchanged until the dedicated **Replace selected passage** action was used. A chapter-level consistency summary then returned separate strengths, watch items, and open questions without altering the manuscript or Masterbook. Temporary sample text and planning content will be cleared before delivery.

## Final Novel PDF Validation

A temporary finalized chapter was compiled through the **Final Novel PDF** workflow. The browser produced a downloadable two-page PDF containing a clean unnumbered title page, a chapter opener, readable book-style body text, a chapter divider, and conventional body-page numbering. The temporary chapter will be removed before delivery; the export capability remains entirely local to the author’s browser.

## Extended Author Toolkit Validation

The Draft Comparison panel opens from the Chapter Stream, presents both saved versions with version selectors and a non-destructive red/green change lens, and offers an explicit revision-issue action. Direct native activation verified the panel; the automated visual driver did not activate this specific control in one earlier clean-state check, although no browser error occurred.

The Chronicle exposes a dated in-world event form with event type, archive link, and consequence notes. A local focus sprint was started, showed a live countdown, and recorded a completed 25-minute session with its word gain in browser storage; the temporary session was then cleared. The Author Desk now summarizes today’s completed focus minutes and sprint count; a temporary 25-minute session displayed correctly.

The expanded Final Novel PDF was validated with a temporary two-chapter paperback sample. The corrected trim selector displayed **Letter · US manuscript**, **A5 · compact reading**, and **6×9 · paperback**. The downloaded five-page PDF contained a cover, a dedication/epigraph/copyright page, generated contents with correct body page references, two chapter openers, and numbered body pages. Temporary validation material will be removed before delivery.

## Expanded Workspace Validation

Story Map validated with a temporary arc linked to Masterbook character and location records. The arc card rendered canonical reference chips, and the linked Folio details appeared in the Chapter Stream planning compass and enhanced chapter cards. Local revision annotations and per-folio checklist items were also created and toggled without altering the manuscript prose.

Connections validated with temporary characters, a relationship record, a Masterbook location, a dated story event, a scene, a linked arc, and chapter mentions. Its combined reference card exposed navigable local chips for each actual record. All temporary story-planning, relationship, revision, and Masterbook validation data was then cleared.

The new Progress desk was checked with temporary local word counts across six dates and two completed focus sessions. It correctly showed a fourteen-day calendar, weekly-goal status, six active writing days, and sixty-five focus minutes. Markdown manuscript and readable Story package downloads were inspected; both preserved the expected project/chapter structure and prose. Helper tests cover Markdown parsing and writing-window totals. The final clean archive rendered correctly at desktop and phone sizes. `pnpm run check`, `pnpm test` (**9 tests**), and `pnpm run build` all passed.

### Final import and mobile checks

The Markdown restore flow was rechecked end to end using a temporary two-folio file through the app’s actual import action and confirmation path. The archive correctly replaced the previous local record, restored the project title, produced two Folio cards, and preserved each imported prose passage. A fallback parser was added for the brief early-load case where the optional helper module has not yet initialized. The temporary imported archive was then cleared.

A safe local `?view=` link was added for existing workspace names; it changes only the initial rendered view and does not overwrite the stored archive preference. Phone-sized screenshots verified the Story Map, Connections, Progress, and Chapter Stream—including the Revision Shelf—alongside the original dashboard. All tested layouts remained readable and usable.

## Friendly Premium Redesign Validation

The dark archive presentation was replaced with a bright white studio system using lavender accents, soft rounded cards, plain-language labels, and a reduced five-choice primary navigation. Advanced tools now stay behind **More tools**, and advanced writing controls stay behind **More writing tools**. The Home view was rebuilt around one visible writing action and simple choices for planning, story details, and ideas.

Desktop and phone-sized screenshots verified the redesigned Home, Write, Story Map, Connections, and Progress views. A mobile-height issue that left an oversized navigation gap was corrected; the workspace now begins immediately after the compact phone navigation. A plain-text action-card wrapping issue in Story Map and Progress was also corrected. The local archive remained clean. Final `pnpm run check`, `pnpm test` (**9 tests**), and `pnpm run build` all passed.

## Direct Book PDF Repair

The Home screen now shows a plainly named **Download book PDF** button beside **Start writing** and **New chapter**, so the final export is no longer hidden inside the save menu. It opens the Final Novel settings panel directly. A temporary saved Main Draft was included through the explicit fallback option and produced a three-page local PDF: title page, contents page, and a numbered chapter page containing the saved heading and prose. The temporary archive will be cleared after this validation.

## Dump Book Validation

The new **Dump Book** was opened through its local `?view=dumpbook` route and checked as a simple browser-only catch-all. A titled pasted note and a safe HTTPS link saved as separate cards, and their fields reset after saving. A compact PNG was accepted through the same file-input/`FileReader` path as the visible picker, stored as a local data URL, and rendered with its filename and size. A compact Markdown file was imported through that same input, with its extracted text visible on a Text file card. Unsupported binary formats are not accepted; the interface clearly limits images to 1 MB and TXT/Markdown files to 300 KB.

The **Help me organize** step first showed the exact material prepared for review. It states that no text has been sent yet, and it labels images as title-only so image bytes remain local. Continuing copies the reviewed material to the existing Brain Dump editor; the separate **Organize with AI** action remains the only explicit send step. An author-triggered **Make story note** copy was verified to create a Notes Desk entry while retaining the original Dump Book item. Deletion prompts name the specific item and only remove it after confirmation. Browser-local persistence survived a clean route reload; all temporary validation entries were then cleared. Desktop and 375-pixel phone screenshots showed readable stacked capture controls and an empty clean-state card list. Dump Book helper tests cover HTTP(S)-only links, supported file classification, and per-type size limits.

## Dump Book Discovery Validation

Dump Book now searches titles, pasted text, filenames, links, MIME labels, and material-type labels entirely within the browser. Four temporary local materials—one note, link, image, and Markdown file—confirmed the result count, live query matching, and independent type filters. The query `compass` returned the matching note as `1 of 4`; Links and Text files each isolated their expected card. The selected filter persisted across a route reload. A cursor-position correction preserved normal typing during live filtering. Phone-width review confirmed that the search field and five filter buttons remain clear and tappable. All temporary test material was cleared, and the final clean state retained the new discovery controls. `pnpm run check`, `pnpm test` (**13 tests**), and `pnpm run build` passed.

## Dump Book Custom Tag Validation

Dump Book now accepts comma-separated author labels when saving a note, link, compact image, or text file. A temporary note with a project label, character label, and chapter label displayed those tags on its material card and created matching local discovery chips. Clicking a tag narrowed the results without changing or sending the material. The **Tags** editor updated an existing item’s labels, and when an active tag was removed, the now-stale tag filter reset automatically so the item stayed visible. Tag normalization removes leading `#`, collapses repeated spaces, preserves a readable label, limits each item to twelve compact unique tags, and includes tags in text search. Labels persisted through a route reload; the phone layout remained usable; all temporary entries were cleared. `pnpm run check`, `pnpm test` (**14 tests**), and `pnpm run build` passed.

## Claude Critic and Feature Tour Validation

The app’s secure built-in model catalog confirmed that `claude-sonnet-4-6` is available. The new **Story Critic** has a clean dedicated workspace and a direct shortcut in Chapter Stream. It requires at least 120 words, opens a preflight panel that displays the exact active chapter text, allows a specific review focus and author standard, and states that no prose, canon, or plan is changed automatically. With explicit confirmation, a temporary original 164-word chapter was reviewed successfully. Claude returned an overall 7.1/10 score, all eight required craft scores, concrete strengths, evidence-backed weaknesses, reader-impact explanations, and practical improvement steps. The author-approved **Make local fix-it list** control copied issues into the local revision ledger while preserving the source chapter exactly. The temporary text, report, and revision items were cleared afterward.

The new **Feature Tour PDF** downloaded from the standard Export panel and was visually checked as a six-page original guide. It documents writing, Story Book, scene planning, Dump Book capture/search/tags, review-first AI tools, the Claude Critic workflow, and a safe example workflow. It explicitly explains that a PDF cannot run interactive controls. Clean desktop smoke checks confirmed Chapter Stream, Story Book, and Dump Book remained intact; a 375-pixel phone capture confirmed the Story Critic layout remains readable. `pnpm run check`, `pnpm test` (**15 tests**), and `pnpm run build` passed.

## Co-writer, Creature Rules, and Premium Navigation Validation

The author-triggered creature scan was tested locally with the temporary sentence `Ssziss grinned and shrugged at the clerk.` The configured local rules flagged both **grinned** and **shrugged**, each with copyable alternatives. Nothing was sent and the scan did not alter the chapter. The temporary sentence was later removed with the rest of the validation archive.

After explicit user approval, the same temporary original sentence was sent through the **Expand rough notes** co-writer preflight. The preflight showed the exact seed, pacing, tone, disclosure, and **Keep private** path before the final request. Claude returned a separate editable proposal, a craft note, and a labelled decision/consequence option. The chapter remained at seven words while the proposal was open; it was discarded rather than copied or added. Local creature preferences are now included as soft constraints only in future explicit AI requests, and the disclosure names that scope. No automatic writing or background request was introduced.

Navigation was then repaired and simplified. **Dump Book** is now visible in primary navigation, feature tabs, and the Home feature desk. Back records the previous local workspace: Home → Story planning → AI Studio → Back returned to Story planning, and Dump Book → Back returned to the actual previous workspace. A final clean local archive loaded with zero chapter words and no temporary Dump Book material, proposal, or test trail.

The visual pass restored a dark, premium archive treatment with charcoal surfaces, parchment author folios, restrained gold signals, editorial hierarchy, and a four-item feature-tab strip. Desktop and 375-pixel phone captures verified Home, Chapter Stream, Dump Book, and AI Studio. Boundary checks blocked empty Dump Book notes and malformed links; a temporary tagged note persisted through a reload and was removed. `pnpm run check`, `pnpm test` (**17 tests**), and `pnpm run build` passed.

The focused rewrite preflight was also checked with a temporary original passage selected in the Chapter Stream. It now offers **Darker**, **Slower and more deliberate**, **More psychological**, and **More environmental** tone directions, as well as dedicated psychological-pressure and environmental-detail revision focuses. Selecting **Darker** altered only the preflight control; no request was made and no text was replaced. The temporary passage was cleared afterward. A final `pnpm run check`, `pnpm test` (**17 tests**), and `pnpm run build` passed.

The approved end-to-end **Darker** rewrite test then exposed one input-contract mismatch: the new client-side tone value was not yet listed in the server-side validator, so the request was safely rejected before reaching Claude. The server contract was immediately synchronized with the new darker, slower, psychological, and environmental values; type checking, all **17 tests**, and the production build passed again. Retrying the same temporary request returned a separate editable rewrite proposal and craft note while the original 22-word chapter remained unchanged. The visible review offered **Discard**, **Copy proposal**, and **Replace selected passage**; only **Discard** was used. The temporary passage, proposal trace, and local archive were cleared, then reloaded to the clean zero-word state.

## Bright Interface and Legacy Tool Restoration

The prior premium-polish pass unintentionally returned the visual system to a dark archive treatment and compressed several earlier tools into a collapsed **More tools** section. No feature data or implementation had been deleted, but the resulting discoverability was poor and contradicted the requested bright, simple workspace.

The interface has now been restored to a bright white/lavender premium presentation. The left navigation visibly lists Home, Write, Dump Book, Plan story, Story Book, My progress, AI Studio, Story Critic, Scene cards, Connections, Notes, Story history, Sort my ideas, and Writing helper. The top feature strip also exposes six primary desks, while Home contains a clearly named ten-card **Your tools** shelf. Desktop and phone captures confirmed Home, Chapter Stream, AI Studio, Story history, Writing helper, Connections, Notes, Sort my ideas, and Progress all remain available and readable. `pnpm run check`, `pnpm test` (**17 tests**), and `pnpm run build` passed after the restoration.

Phone-width captures specifically rechecked every legacy workspace restored to visible navigation: Story history, Writing helper, Connections, Notes, Sort my ideas, and Progress. Each opened through its direct local view and retained the full bright navigation plus readable stacked content with no horizontal overflow.

## Mobile Usability Pass

The phone workspace was tightened without changing desktop behavior. The six everyday desks remain immediately visible, while the eight secondary author tools now sit under a clear **More author tools** expander to avoid a very tall first screen. The top feature strip becomes a swipeable row instead of adding more stacked rows, and the top bar keeps a compact visible Back arrow on non-Home pages. Phone captures confirmed the new Home, Chapter Stream, and AI Studio layouts remain readable, the writing editor stays comfortable, and advanced co-writing controls are still reachable through **More writing tools**. `pnpm run check`, `pnpm test` (**17 tests**), and `pnpm run build` passed.

## Phone and Search Bugfix

The reported backward-moving Dump Book search was reproduced in the input handler: every keystroke rebuilt the entire page, replacing the active input and forcing the cursor to the end. The fix now updates only the saved-item count and results list while retaining the original field, focus, and cursor position. A three-keystroke validation returned `n`, `ne`, then `neo`, with cursor positions 1, 2, and 3 and focus retained after each step.

The phone layout was checked again after the bugfix. Dump Book capture and search remain readable at 375 pixels, while Home and Chapter Stream keep the compact primary navigation, **More author tools** control, visible Back arrow, and horizontally swipeable feature strip. `pnpm run check`, `pnpm test` (**17 tests**), and `pnpm run build` passed.

Before the compact navigation repair, the phone shell rendered all fourteen navigation destinations and the full six-card feature strip as stacked content, producing a long, crowded first screen. The current interactive validation opened **More author tools**, navigated Home → Dump Book → Back to Home, then opened Story history and returned with Back. The live workspace reported the expected route labels for Dump Book, Chronicle timeline, and Author dashboard at each step. The repaired primary tools stay visible while legacy tools remain reachable through the explicit expander.

## Dump Book 10 MB Local File Locker and Temporary Fill Desk

Dump Book now accepts PNG, JPG, WEBP, PDF, TXT, and Markdown files up to **10 MB**. Larger file bytes are held in a browser-local IndexedDB file locker, while the normal browser archive keeps only metadata. Uploading does not invoke AI, alter the Story Book, create a Note, or organize material.

Each item offers an explicit **Fill temporary desk** action. Text files create an editable separate local copy; images and PDFs create a small metadata reference so their bytes remain uninspected and private. The desk can be copied, explicitly saved as a compact Note, reviewed in a preflight that shows the exact text which could be copied to Brain Dump, or discarded. Continuing from the preflight still does not send anything until the author separately presses the existing final organizer request.

Validation used temporary local files only. A 57-byte text file entered the locker, filled the desk, persisted through a direct reload, and was discarded without deleting its source. A PDF at exactly **10,485,760 bytes** was accepted; a file one byte larger was blocked before any locker write. A supported 382 KB WEBP image was stored locally and created only a metadata reference in the desk; no image bytes were analyzed or sent. The local organization preflight was opened and closed with **Keep private**. Phone captures confirmed the 10 MB disclosure, picker, and empty Temporary Fill Desk. All temporary items and the validation locker database were cleared afterward. `pnpm run check`, `pnpm test` (**18 tests**), and `pnpm run build` passed.

## Temporary Fill Desk AI Text Extraction

The Temporary Fill Desk now offers **Extract text with AI** only for a selected local PNG, JPG, WEBP, or PDF. It is not shown for a plain-text temporary copy. Pressing it first opens a separate consent preflight that names the exact selected file, MIME type, and size, explains that only that one file will leave the browser for extraction, and provides **Keep private**. The extractor is never called by upload, while typing, when the desk opens, or as part of organizing.

The original 382 KB app-mark WEBP was tested after the author’s explicit approval. Its preflight identified the exact image and the returned result was separate and editable; it reported that the mark had no reliable readable text. The Temporary Fill Desk remained unchanged, and the result was discarded. A second, separately approved end-to-end test used only a harmless original 17 KB one-page PDF fixture named `temporary-extraction-fixture.pdf`. The PDF preflight showed its exact filename, `application/pdf` MIME type, and size before the final action. Gemini returned the fixture’s readable original text in a separate editable result. No copy, save, organize, or merge action was used; the result and temporary desk were discarded, then the PDF metadata and its IndexedDB locker blob were removed. The final browser-local Dump Book was empty.

The server route accepts only explicitly supplied PNG/JPEG/WEBP/PDF data URLs with matching declared kind and MIME type, applies a bounded data-URL input and 32,000-character text output contract, and returns a strict `{ text, note }` response. The client retains legacy local temporary-desk compatibility by deriving `image` or `pdf` from older stored source labels when a newer source type is absent. A clean empty desk now clearly says that no item is selected rather than suggesting it is still opening material.

Desktop and 375-pixel phone captures verified the clean Dump Book, clear 10 MB local-only disclosure, Temporary Fill Desk no-source guidance, and responsive layouts. The consent preflight and separate-result workflow were browser-validated with temporary non-author content only. The final regression suite passed: `pnpm run check`, `pnpm test` (**19 tests**), and `pnpm run build`.

## Approval-First Multi-Source Dump Book Review

Dump Book now lets the author select up to four saved PDFs, notes, text files, or saved links for one **Masterbook review**. The selected-source button shows a count. Each supported card has an **Include in Masterbook review** checkbox; selecting it changes no story record. A final consent screen lists the exact selected filename or title, type, and size, says that only the listed items will leave the browser, and provides **Keep private**. PDFs are bounded to a combined 24 MB; text sources use only the first 7,500 characters each, and saved links contribute their title and URL rather than fetched page contents.

The server accepts at most four explicitly named sources, validates every item’s kind, file size, data-URL form, cumulative PDF/data size, and cumulative text size. It extracts selected PDF text with the existing single-file reader, then prepares review-only, source-linked Masterbook candidates. Returned candidates are separate from the archive. They include source labels, can be individually selected, and require a second explicit **Add selected to Masterbook** action. Filing creates new local Masterbook records with a history entry that names the Dump Book sources; it never alters or removes the originals.

Browser validation used only a harmless 19 KB original PDF fixture. The selected-item control, exact consent summary, **Keep private** dismissal, source-count limits, local cleanup, and no-auto-filing behavior were confirmed. The initial direct multi-PDF model call was rejected by the provider before it produced proposals; its error is now handled safely. The route was changed to use the known single-file extraction path before text-only proposal review. At the author’s request, no further external PDF request was made, so a successful PDF-to-proposal result remains intentionally untested in the browser. The harmless Dump Book record, IndexedDB blob, and local fixture files were cleared. `pnpm run check`, `pnpm test` (**20 tests**), and `pnpm run build` passed.

## Phase 1 Dump Book Inbox

The first Inbox redesign keeps the archive browser-local and adds a clear **Capture** and **Organize** split. Existing Dump Book records receive the backward-compatible **Raw** status automatically; authors can now use **Raw**, **Working**, **Proposed**, **Filed**, and **Archived** without any automatic Story Book action. Capture accepts a large pasted tray and splits up to 40 pasted lines, bullets, or numbered ideas into independent Raw cards. The secondary link and file controls stay collapsed until needed, and the private picker now accepts several supported files sequentially with the existing per-file 10 MB rule.

Organize adds separate Inbox selection state, local bulk tag confirmation, bulk archive, individual status changes, and an explicit Temporary Fill Desk copy from the first selected item. None of these actions files a note, creates canon, or sends material. The existing review route remains deliberate: selecting **Organize selected ideas** only opens the existing consent path for supported text/PDF/link sources. The simplified AI Studio now starts with three clear paths—**Organize my ideas**, **Help my current chapter**, and **Check my story**—while critique, rewriting, dialogue, lore, style, and creature helpers remain accessible under **More writing helpers**.

Browser checks used only temporary harmless material. Three pasted lines became three separate Raw cards; an item was changed to Working, archived with the local bulk control, survived reload, and did not create a Story Book record. A separate one-card test confirmed the in-app bulk tag modal and local tag display. Two synthetic small text files were accepted as separate sequential file-locker items; their metadata and IndexedDB blobs were removed afterward. The browser-local Inbox was confirmed empty after cleanup. Desktop and 375-pixel phone captures verified Capture and AI Studio layouts. `pnpm run check`, `pnpm test` (**22 tests**), and `pnpm run build` passed.

## Phase 2 Private Team Foundation

The public author demo remains a no-login, browser-local workspace. A distinct `/team` route now loads a separate private team screen. It shows no team records while signed out and requires an authenticated account for every team API call. The standalone public archive is not imported, copied, or synchronized when the team route opens.

The database now contains separate `teams`, `team_members`, and `team_invitations` tables. Team roles are scoped to each team as **owner** or **writer**; default visibility is **Private**, **Team**, or **Restricted**. Team creation creates an owner membership. Owner-only invitations are tied to one normalized email address, expire after seven days, can be revoked, and enforce a five-seat total including active invitations. The server stores only a SHA-256 invitation-token hash, returns the raw copyable token once to the owner, and checks authentication, matching invitee email, pending status, expiry, and revocation before acceptance.

The protected route was browser-checked while signed out, confirming that it showed the sign-in boundary rather than team records. The public route continued to open directly with its local archive. A rejected Google device-recognition attempt was reset without clearing the local archive; the team screen now includes **Reset sign-in**, which clears only pending team-session artifacts. Desktop and 375-pixel phone captures confirmed readable sign-in, reset, and return-to-demo controls. A live authenticated create-team/invite acceptance run remains unvalidated because Google declined the sandbox device sign-in; the server routes, access denial, data model, and pure invitation safeguards are covered by automated tests. `pnpm run check`, `pnpm test` (**27 tests**), and `pnpm run build` passed.

## Easy-Use Repair and Story Vault Start

The author-facing local app now presents six clear everyday places—**Home**, **Write**, **Story Vault**, **Plan story**, **Story guide**, and **Progress**—with optional work under **More tools when you are ready**. Repeated full-width feature shortcuts were removed so the same job no longer appears in several equally prominent places. Beginner-facing labels now use action language, such as **Save an idea**, **Plan what happens**, **Check a chapter**, and **Story changes**.

The Home screen now starts with three choices and a dismissible Story Vault introduction. It says exactly that notes, links, images, PDFs, and text files remain private in the browser and that nothing is deleted, sent to AI, shared, or made into canon automatically. **Open my Story Vault** opens local capture; **Skip for now** dismisses only this introduction. The Story Vault itself was simplified to one main save box, with names, tags, links, and files moved behind optional sections. Its existing 10 MB-per-file local locker behavior remains unchanged.

The phone layout now renders a full-width in-app **Back to [previous screen]** control below the header on every non-Home screen. The Story Changes / Ledger view was captured at 375 pixels with the Back control visible, and a browser interaction confirmed it returned to Home rather than leaving the app. Desktop and phone captures confirmed the beginner Home and Story Vault layout. A harmless local Story Vault note was saved successfully and removed afterward; the browser validation archive returned to zero saved Vault items. `pnpm run check`, `pnpm test` (**27 tests**), `pnpm run build`, and whitespace validation passed.

## Local PDF Chapter Import and Story Vault Connections

The Writing desk now includes **I already wrote this PDF** under **More writing tools**. It opens a browser-local picker for PDF files within the existing 10 MB limit. The selected PDF is read in the browser only, then shown in a preflight with its filename, readable-page count, editable proposed chapter title, and extracted-text preview. **Keep private** closes the preflight without creating a chapter. **Add as separate draft** creates a new chapter whose imported text is held in **First try**; it never replaces the active chapter, Main Draft, or Final Draft. The importer records only local import metadata and does not upload the PDF, call AI, or retain the original file unless the author separately chooses Story Vault storage.

The Story Vault now offers **Where could this fit?** for saved text ideas. The suggestion list compares meaningful words only against existing local chapter, character, location, scene, and story-plan details. It explains the matched words, offers **Open this chapter** and **Copy to chapter notes** when a chapter is suggested, and leaves the original Vault item untouched. Copied ideas become visible local revision notes; they do not alter chapter prose. A no-match result plainly says to keep the item in Story Vault until more of the story is named. This matching path makes no AI or network request.

Browser validation used only the harmless generated one-page fixture. The private cancellation path kept the archive at one original chapter. The approved path created a second, separate First Draft with 29 visible words while the original chapter stayed unchanged; the generated draft was then removed. A temporary local Story Vault note correctly matched **north**, **gate**, **Aren**, and **storm**, copied into the chapter revision shelf without changing the manuscript, and remained in Story Vault. A second harmless note verified the no-match message. All temporary chapter, note, annotation, timeline, and Vault material was removed afterward, returning the browser archive to one empty starter chapter and zero Vault items. Desktop and 375-pixel phone captures confirmed the Writing and Story Vault layouts, including the in-app Back path. `pnpm run check`, `pnpm test` (**28 tests**), `pnpm run build`, and `git diff --check` passed.

## Local PDF Import History and Suggestion Dismissal

The Writing desk now includes **My PDF imports** beside **I already wrote this PDF** under **More writing tools**. It lists only chapters explicitly created from a locally previewed PDF, including the original filename, page count, First Try word count, and an explicit **Remove this import** control. The removal confirmation states that it affects only that imported chapter. When approved, it removes the selected imported chapter and only its chapter-linked local annotations, revision checklist, issues, and original import activity; all other chapters remain untouched. The importer never retains the original PDF, so removal cannot delete a source file.

Story Vault connection results now offer **Not a fit** per suggestion. This hides only that suggested local source for that one saved idea; it does not move, delete, alter, or send the idea or any story record. If any suggestions are hidden, the same modal offers **Show hidden suggestions**, which restores them for that saved idea. The dismissal list is stored in the browser archive only and uses no AI or network request.

Browser validation used only harmless temporary data. A generated one-page PDF fixture created a separate 29-word First Try, appeared in **My PDF imports**, and was removed through the exact history control; the clean starter chapter remained active and the fixture activity was removed. A temporary Story Vault note matched a temporary local **North Gate** place. **Not a fit** hid that one match while leaving the note visible in Story Vault; **Show 1 hidden suggestion** restored it. The pre-validation browser archive was restored afterward, leaving one empty starter chapter and zero Story Vault items. Desktop and 375-pixel phone captures confirmed the Writing and Story Vault layouts and the visible Back path. `pnpm run check`, `pnpm test` (**29 tests**), `pnpm run build`, and `git diff --check` passed.

## Part I Private Group Roles and Join Approval

The separate `/team` route was rechecked while signed out after the Part I changes. It showed only the private-group sign-in boundary and Return to local demo control; no group name, member, request, or browser-local author record was exposed. Live signed-in member-request approval remains pending browser-account access, while protected route access and role helpers are covered by the current automated suite.

The public `?view=chapter` route was then reopened without sign-in. It retained the browser-local Chapter 01 workspace and showed only a navigation link to the separate private group; no group record, membership, or join-request information appeared in the public author view.

After the current service restart, the private-group route rendered the same protected sign-in boundary again, with no stale PDF dependency error in the current page. The 375-pixel capture kept the sign-in, reset, and return-to-demo actions readable and tappable.

## Part II Shared Cloud Canon

Part II adds only the private `team_canon_records` store. A group member must deliberately type a category, title, proposed decision, and optional reason into the signed-in Canon Proposal form; the public browser-local chapter workspace and Story Vault have no path that auto-selects, copies, or syncs content into this table. Every submission begins as **Pending**. Only a Ruler may approve or reject it. Approved records are the only canon records visible to all accepted members, including Watchers; Watchers remain read-only and cannot submit or review a proposal.

The additive live schema was verified with its category, proposal, review, and pending/approved/rejected fields. The protected `/team` route was also reopened while signed out after the Part II service restart and showed only the sign-in boundary, reset action, and return-to-local-demo action. Automated role helpers and protected-route tests cover Writer/Ruler/Watcher permissions and rejection of unauthenticated canon access. Live signed-in proposal and approval testing remains intentionally deferred until the author requests desktop testing.

The signed-out mobile boundary retains readable sign-in, reset, and return-to-demo controls. `pnpm exec tsc --noEmit`, `pnpm test` (**33 tests**), `pnpm run build`, and `git diff --check` passed after the Part II code changes.

## Canon Discovery and Ruler Revision History

The private Canon Finder now filters only approved group records by free-text search and category. It does not read, index, or search any browser-local chapter, PDF import, Story Vault item, or local note. Writers and Watchers can search the approved record list. Rulers additionally receive **Revise with history** and **View history** controls. Saving a Ruler revision first writes an immutable snapshot of the previous approved category, title, decision, context, optional Ruler note, and version number into the protected `team_canon_revisions` table; the current approved canon record is then updated. Writers and Watchers cannot access revision history or revision controls.

The additive live schema was verified to contain the revision record, unique record/version rule, snapshot fields, Ruler revision note, and timestamp. The protected `/team` route was reopened after the service restart while signed out and exposed only the sign-in boundary, reset action, and return-to-local-demo action; shared canon and Ruler history remained hidden. A ready-to-run `team-desktop-test.md` guide now covers the Ruler, Writer, Watcher, approval, search, revision-history, and privacy checks for the author’s future desktop session. `pnpm exec tsc --noEmit`, `pnpm test` (**34 tests**), `pnpm run build`, and `git diff --check` passed. Live signed-in group testing remains deferred until the author requests it.

## Guided Private Group Decision Flows

The private group interface now uses short guided decision cards instead of the previous long fill-in forms. Joining a group is a three-step flow: choose **I want to write** or **I only want to read**, enter the private group number, then review and optionally add a note before sending. Canon proposals ask for the one story fact first, then offer a large category choice, then show a review step with optional title and reason fields. A missing title is derived locally from the typed decision; no browser-local chapter, Story Vault item, PDF, or note is selected or copied.

Ruler actions now use the same decision-card language. Pending join requests offer **Make Writer/Watcher a member** or **Not now**. Pending canon offers **Make official canon** or **Not now**. Ruler revisions start with the new official wording while the current wording remains visible; title, category, reason, and revision note remain optional advanced details. The protected server procedures, roles, review rules, immutable history, and data boundaries were not changed.

The new helper tests confirm the meaningful-decision threshold and safe local title fallback. The complete suite passed with `pnpm run check`, `pnpm test` (**36 tests**), `pnpm run build`, and `git diff --check`. Signed-out desktop and 375-pixel phone checks confirmed that `/team` still exposes only sign-in, reset, and return-to-local-demo controls, with no group data. Current post-restart browser requests returned the expected signed-out auth response without new client errors. Live signed-in desktop testing remains deferred by the author.

## Masterbook-First Local Vault Refresh

The author Home is now a Masterbook-first living library. It opens with a large visual world-building panel, category entry cards for Characters, Locations, World Rules, and Lore, a clear current-writing card, and Story at a Glance. Story Vault is now described and presented as a smaller private intake tray rather than the core purpose of the application. The public local author workspace, private Team route, and canon boundaries remain separate.

The new **Tidy my whole Vault** action opens an explicit local-only confirmation. It names the selected active-item count, explains that no AI request, sharing, deletion, or Masterbook filing will occur, and states that the current browser tab must remain open for progress to continue. While running, the app shows a visible `completed of total` progress line with a local estimate plus Pause and Resume controls. Every processed original is given the reversible **Archived** status; the normal Inbox filter hides archived material, while the new Archive filter and restore controls keep it searchable and recoverable. The existing four-source AI Masterbook review remains separately consented and unchanged.

Desktop and 375-pixel phone screenshots verified the redesigned Home, Story Vault Capture view, Story Vault queue panel, and Masterbook view. The responsive Home keeps the large Masterbook visual focus while category cards, writing actions, Vault tray, and progress stack cleanly on a phone. Automated coverage adds the Archive-versus-Inbox discovery behavior; the full suite passed with `pnpm run check`, `pnpm test` (**37 tests**), `pnpm run build`, and `git diff --check`. Production build completed with the existing large PDF.js/team chunk warnings and runtime-resolved Manus storage asset notices only.

## Visual Character Profiles

The Masterbook now offers an optional **Create character profile** window from Home and Masterbook. It collects a required name plus optional role, status, dossier importance, canon sentence, talents, powers, strengths or limits, class/stat notes, current story pressure, relationships, and private profile notes. Empty fields stay empty; no talent, rating, relationship, portrait, or canon fact is invented. Existing character records remain valid and can continue to use the ordinary basic editor.

Saved profiles open as visual local character dossiers rather than repeated office-style cards. Each card uses an initial sigil, an author-chosen Spotlight/Supporting/Minor visual accent, optional trait tags, and one clean Dossier action plus a compact More menu. The full dossier separates canon memory, optional profile-detail progress, talents, powers, strengths/limits, story links, current pressure, and optional private notes. The More menu keeps basic editing, record history, and deletion available without crowding the card.

An isolated browser context created a harmless temporary character profile, verified that the local Masterbook state held its entered name and talents, and verified that the visual dossier card rendered. The isolated context was disposed immediately, leaving the author browser archive untouched. Unit coverage verifies compact trait parsing, optional-detail progress, neutral default tiering, and preservation of existing Masterbook fields/history when a profile is saved. Desktop and 375-pixel phone screenshots verified the new entry points and responsive Masterbook layout. `pnpm run check`, `pnpm test` (**40 tests**), `pnpm run build`, and `git diff --check` passed; only the established large-chunk/runtime asset warnings appeared during build.

## Masterbook Atlas and Author-Defined Stats

The Masterbook no longer opens as seven repeated office-card lists. It now begins with a local **Masterbook Atlas** shelf containing Character Codex, System Board, World Map, Lore Glossary, Faction Hall, Artifact Cabinet, and Quest Board. Every destination opens a category-specific Atlas page with its own story purpose, one clear create action, a search field, and visual record tiles. Existing saved records remain in their original browser-local categories and history records; the Atlas only changes how they are discovered and presented.

For non-character entries, the new short Atlas creator begins with a name, a record type, and one important fact. All remaining category fields are behind **Add more details only if you need them**. It therefore preserves the full existing data model without forcing a long generic form. Characters retain the visual dossier workflow and now support author-defined stat rows. The author may choose the optional HP/MP/SP starter set, the STR/AGI/DEF/Magic DEF/Mana starter set, remove any row, or name up to twelve custom stats. These are saved locally as labels and values; no game calculations, ratings, or mechanics are invented.

The requested Lore Keeper flow is deliberately an approval boundary, not a new hidden role. The existing private-group Ruler is described as the **Lore Keeper** when reviewing an official stat proposal. From a local Character Profile, **Prepare stat profile for Lore Keeper** produces an editable plain-text proposal and a copy action only. It does not send, share, submit, publish, or make the profile canon. The author must still deliberately paste it into the separate signed-in group canon proposal flow, where the existing Ruler approval protection applies. Browser-local profiles are never auto-selected or synchronized.

External patterns were researched from character-codex, category-first worldbuilding, and configurable character-sheet products; the resulting Atlas interactions and art remain original. Desktop and 375-pixel phone captures confirmed the Atlas shelf, category grid, hero controls, and responsive single-column category records. An isolated browser context created a temporary System Board record and a temporary character with HP/MP/SP, then verified the saved local `atlasType`, custom stat labels, and HP value before disposal. `pnpm run check`, `pnpm test` (**42 tests**), `pnpm run build`, and `git diff --check` passed. The existing large PDF/team build-chunk warnings and runtime-resolved asset notices remain non-blocking.

## Atlas Place, Relationships, and Category Icons

The Masterbook Atlas category shelf now uses seven original illustrated game-codex emblems: Character Codex, System Board, World Map, Lore Glossary, Faction Hall, Artifact Cabinet, and Quest Board. The icons carry no story text or canon facts; they are small visual anchors beside the existing plain-language labels and work on desktop and phone.

Locations are now presented as visual **Place Folios** rather than the old repeated cards. A Place Folio shows its saved atlas type, description, danger, connected people, and continuity note only when those details exist. Opening it shows a visual Place Dossier and its existing local details. No location is moved, renamed, sent, shared, or promoted to canon by opening the dossier.

The Connections workspace now includes a browser-local **Relationship Web**. It shows a link only when the author has deliberately saved a relationship between two different existing characters. The helper rejects missing-character links, self-links, and duplicate reverse links. The web explicitly states that it never guesses, sends, shares, or creates canon. A focused helper test covers that rule; the broader suite passed `pnpm run check`, `pnpm test` (**43 tests**), `pnpm run build`, and `git diff --check`. Desktop and 375-pixel phone captures verified the illustrated Atlas shelf and the Relationship Web layout. Existing large chunk and runtime-resolved asset warnings remain non-blocking.

## Pocket Story Console Mobile-First Rebuild

The author workspace now uses the **Pocket Story Console** shell on phone: a five-destination fixed dock for Desk, Write, World, Plan, and Vault, with secondary tools available through a compact More control. The former tall stacked phone navigation is removed. Desktop retains the full left archive rail and expands the same desk experience without altering data, exports, private group access, or existing routes.

Home is now a concise Pocket Desk with the current chapter, its local word count, one clear writing action, and direct World, Plan, and Vault choices. Progress now renders as **Writer Pulse**: a weekly percentage, three useful local statistics, a sprint action, and a collapsed fourteen-day history rather than a wall of zero-value cards. Planning now renders as a **Pocket Planner** with one selected lane at a time, while preserving every stored scene and its stage. Story Vault now renders as a **Pocket Vault** with a Text/File/Link capture tray; existing Archive, selection, filter, restore, organization, and no-auto-sending safeguards remain present.

Creation dialogs for scenes, arcs, notes, and relationships now open with their first useful fields and place remaining fields behind **Add more details only if you need them**. Existing Character Profile guidance continues to keep power, stat, connection, and private-note sections optional. The implementation does not invent story data or silently change canon.

Phone and desktop captures verified the Pocket Desk, fixed dock, word-count badge, More entry, and expanded desktop layout. New focused tests cover safe Pocket Planner lane normalization. `pnpm run check`, `pnpm test` (**45 tests**), `pnpm run build`, and `git diff --check` passed. Production build retains the existing non-blocking large PDF/team chunk and runtime-resolved asset warnings.

## Final Product Release Validation

The final author product loads as the Pocket Story Console. At 375 pixels, the Desk shows a local current-chapter word count, direct Write/World/Plan actions, a Story Vault entry, compact More control, and the fixed five-destination navigation dock without horizontal overflow. The phone shell retains the in-app navigation and adds adequate bottom room above the dock.

The isolated public author workspace stays browser-local. It does not sign in, synchronize local chapters, send Vault content, promote local records to canon, or create group records. The separate `/team` route loads independently and begins with its protected private-workspace boundary; the existing live signed-in Ruler/Writer/Watcher test remains deliberately deferred until the author chooses to test it on desktop.

Final automated checks passed: `pnpm run check`, `pnpm test` (**45 tests**), `pnpm run build`, and `git diff --check`. The build has only the known non-blocking PDF/team chunk-size warnings and runtime-resolved static-asset notices. No author material, secret, fixture, or local browser archive was added to the repository.

## Player Backup Export

The Export panel and Pocket Story Console More menu now include **Player Backup** and **Open Player Backup**. Player Backup asks the author to choose one saved Character Profile, then downloads one browser-local JSON file containing that character’s saved profile/stat values and a story-progress snapshot: project title, chapter count, total main-draft words, active chapter and its word count, and complete/total scene counts. It excludes chapter prose, Story Vault material, files, local record identifiers/history, secrets, and private group canon records.

Opening a Player Backup does not change data. It first validates the file shape and opens a preview naming the character, stat count, and progress snapshot. The only restore action adds the profile as a clearly labelled separate local character copy; it does not overwrite any existing character, manuscript, scene, or progress record. **Keep current data** closes the preview without changing the archive. Player Backup never sends, shares, or uploads anything.

Focused unit tests cover exclusion of local record identity/history, correct stat/progress capture, valid-file acceptance, and rejection of malformed or unnamed backup files. The complete release gate passed: `pnpm run check`, `pnpm test` (**47 tests**), `pnpm run build`, and `git diff --check`. The production build retains only the known non-blocking chunk-size and runtime-resolved static-asset warnings.

## Chapter Review, PDF Access, and Feature Map

The Write workspace now shows three direct actions above the chapter canvas: **Import chapter PDF**, **My PDF imports**, and **Review Masterbook updates**. The established local-only PDF workflow is unchanged: it uses a 10 MB cap, preview-first reading, **Keep private**, and an explicit separate **First try** draft rather than overwriting an existing chapter.

Possible Masterbook Updates is a local, deterministic review flow. It checks a saved chapter only for names of Masterbook records the author has already created. It never extracts invented facts, edits a record, sends prose, creates a group proposal, or changes local or shared canon automatically. A reference is saved only after the author selects **Approve private link**. The new helper tests cover existing-name matching, name-boundary protection, and removal of links the author already approved.

Desktop now has a visible **Tools** entry that opens a Feature Map for Write, World, Plan, Review, Vault & Backup. Its direct actions were browser-checked, including chapter PDF import/history and the private Masterbook review panel. Normal 375-pixel phone layout still renders the Pocket Story Console, in-app Back action, visible Write controls, and fixed dock without horizontal overflow. Its **More** menu now includes **All tools**, opening the same Feature Map without requiring a browser’s desktop-view option.

The supplied recording was reviewed and confirmed to use the phone browser’s deliberately selected desktop view. That setting requests a wide desktop viewport, so the desktop shell is intentionally presented at a small scale; the author app does not override that browser choice. Native phone mode remains the recommended layout for writing on a phone. The final release gate passed: `pnpm run check`, `pnpm test` (**49 tests**), `pnpm run build`, and `git diff --check`. Build output retained only the known non-blocking runtime-resolved static-asset and large-chunk warnings.

## Relationship Web Focus Threads and Bond Ledger

The browser-local Relationship Web now offers three author-controlled extensions. **Focus Thread** filters the visual web to one selected character’s already saved bonds; it never hides, edits, or removes the underlying Bond Ledger. **Reader knowledge** lets the author explicitly label a bond as Private to author, Visible to reader, Reveal later, or Unclear. **Story anchor** lets the author deliberately link that bond to one existing chapter. Existing relationship records remain valid; missing new fields safely fall back to Private to author with no chapter anchor.

The visual web now carries a readable legend, author-selected state/visibility labels, optional pressure note, and optional chapter anchor. Reader-facing state is a planning label only: it changes no profile, chapter, Masterbook fact, group proposal, or shared canon. The compact edit screen explicitly explains these boundaries and keeps the two new selections inside the author’s existing private relationship form.

An isolated development-browser sample verified the mapping of Reveal later and Visible to reader bonds, pressure display, story-anchor navigation, dossier buttons, and Focus Thread behavior. Selecting Ren retained two saved bonds; selecting Mira displayed only its saved bond while the Bond Ledger remained unchanged. Native 375-pixel captures verified the visual web, Focus Thread picker, empty-state copy, and secondary Connections empty state remain readable. `pnpm run check`, `pnpm test` (**50 tests**), `pnpm run build`, and `git diff --check` passed. The build retained only the established non-blocking runtime-resolved asset and large PDF/team chunk warnings.
