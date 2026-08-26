# The Ren Protocol — Final Version Feature Summary

**The Ren Protocol** is a private, local-first writing workspace for planning, drafting, checking, and organizing a novel. Its main archive works in the browser without a required login. Your Story Book, chapters, notes, planning records, local files, and accepted review material remain on your device unless you deliberately use an AI action and pass that action’s final consent screen.

## Writing and Manuscript Tools

| Feature | What it does |
|---|---|
| **Chapter Stream** | Provides a focused writing desk with first, main, and final draft versions for each chapter. It saves locally and supports word counts, chapter details, bookmarks, focus mode, writing goals, and a writing timer. |
| **Author-guided drafting** | Offers author-triggered scene drafting, next-line suggestions, rough-note expansion, scene choices, and focused rewrites. Each output is separate until the author chooses to copy, insert, append, or replace text. |
| **Rewriting and revision** | Supplies slower, darker, psychological, environmental, dialogue, clarity, description, pacing, and emotional rewrite directions. It also provides revision annotations, revision checklists, draft comparison, and a local fix-it list. |
| **Story Critic** | Produces an opt-in critique with eight 10-point scores, evidence, weaknesses, and practical next steps. Reports stay local until the author chooses how to use them. |
| **Continuity support** | Checks chapter text against the local Story Book, flags possible conflicts, and supports Intent Bubbles for deliberate exceptions. |
| **@mentions** | Links named characters in chapter text to their Story Book profiles. |

## Story Planning and Worldbuilding

| Feature | What it does |
|---|---|
| **Story Book / Masterbook** | Keeps characters, world rules, locations, lore, factions, artifacts, and plot threads in organized local records with add, edit, delete, history, search, and collapsible categories. |
| **Story Plan** | Organizes plot arcs, acts, subplots, stakes, scenes, chapter purposes, emotional turns, and planning links. |
| **Connections** | Shows links between characters, locations, scenes, events, chapters, and arcs, helping with complex continuity. |
| **Notes Desk** | Stores local research notes, reminders, fragments, and links to relevant story material. |
| **Progress Desk** | Tracks writing goals, daily progress, recent activity, and focus sessions locally. |
| **Style and lore tools** | Includes Dialogue Lab, Lore Workshop, a personal style guide, and configurable creature-rule checks. These produce review-only suggestions. |

## Dump Book and File Workspace

| Feature | What it does |
|---|---|
| **Dump Book** | A local catch-all for quick notes, pasted text, HTTPS links, tags, images, PDFs, TXT files, and Markdown files. |
| **Search and tags** | Finds saved material by title, text, filename, link, type, or custom tag. Filters include notes, links, images, text files, and PDFs. |
| **10 MB local file locker** | Uses browser-local IndexedDB for PNG, JPG, WEBP, PDF, TXT, and Markdown files up to 10 MB. File bytes are not stored in the normal local archive record. |
| **Temporary Fill Desk** | Creates a separate temporary working copy from one Dump Book item. It can be edited, copied, made into a compact note, reviewed for organization, or discarded without changing Story Book records. |
| **Downloads and deletion** | Lets the author download locally saved files and delete saved Dump Book material with confirmation. |

## Explicit AI and Privacy Controls

| Feature | Author-control rule |
|---|---|
| **PDF and image text extraction** | A selected PNG, JPG, WEBP, or PDF can be sent only after a screen names its exact filename, type, and size. **Keep private** closes the screen without sending it. Returned text is a separate editable result. |
| **Review-first organization** | AI organizers create proposals only. They do not automatically create Notes, alter chapters, add Masterbook records, organize files, or merge text. |
| **Multi-source Masterbook review** | The author can select up to four compatible Dump Book sources—PDFs, notes, text files, or saved links—see an exact consent list, and request source-linked Masterbook proposals. The original sources remain unchanged. Proposed records are separate until a second explicit **Add selected to Masterbook** action. |
| **No background AI activity** | Uploading a file, opening a desk, searching, tagging, and typing do not send content for AI processing. |
| **No personal API key required** | Optional AI calls use the project’s secure server connection only after consent; the user does not paste a personal API key into the app. |

> **Current test note:** The single-file PDF/image extraction workflow was tested successfully with harmless temporary fixtures. The new multi-source workflow’s selection, consent, Keep private, size limits, cleanup, and safe provider-error handling were tested. Further external PDF testing was deliberately stopped at the author’s request, so the final release does not claim a completed successful multi-PDF proposal test.

## Import, Export, and Sharing

| Feature | What it does |
|---|---|
| **Final Novel PDF** | Exports the chosen chapters into a formatted local PDF. |
| **Text and Markdown exports** | Exports current drafts, manuscript text, Markdown, and a readable manuscript package. |
| **Archive backup and import** | Supports local archive export, import, and a safe reset workflow. |
| **Feature Tour PDF** | Includes an original guide that explains the principal tools and how to use them. |
| **Checkpoint releases** | Each finished release is saved as a recoverable checkpoint. |

## Sharing Link: Important Difference

The **checkpoint link** shows a saved project version. The public link, `https://renprotocol-2mzjepu7.manus.space`, shows the last version that was explicitly published. Saving a new checkpoint does not publish it automatically. To update the sharing link, open the newest checkpoint and press **Publish**.

## Final Release Status

The final release includes the bright white and lavender premium interface, phone-responsive navigation, visible Back actions, local-first writing and planning tools, Dump Book with its 10 MB file locker, Temporary Fill Desk, explicit single-file extraction, and the new approval-first multi-source Masterbook review workflow. The automated release checks passed with **20 tests**, TypeScript checking, and a production build.
