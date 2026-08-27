# The Ren Protocol — How the App Was Created

**The Ren Protocol** began as a personal writing companion for the novel **Neo Domain Online**. The goal was never to build a giant commercial platform. It was to make one friendly place where an author could write chapters, remember world rules, hold messy ideas, and avoid losing important story details.

> **Main idea:** The author controls the story. The app can organize, suggest, and help review, but it must not silently write the novel, send private material, change canon, or decide story facts.

## 1. The starting point

The first version was planned as a private writing app with a Masterbook, chapter editor, simple timeline, continuity checks, `@` mentions, version tracking, and browser-local storage. The dark-and-gold visual idea matched the tone of *Neo Domain Online*, while the technical goal was simple: no required account, no required server, and no automatic sharing.

The author then expanded the idea beyond a normal document editor. They wanted a space for rough thoughts, copied research, old chapter PDFs, characters, places, world rules, planning, and eventually small-group canon review. The guiding question became: **“How can one person keep a large fantasy world understandable without losing control?”**

## 2. The first big change: from forms to an author workspace

Early screens were useful but felt too much like filling in office forms. The app was gradually reshaped into a more visual author workspace. Labels became simpler, navigation became clearer, and the important tools were grouped by what an author is trying to do: write, plan, build the world, review, store ideas, and back up work.

| Early need | What was added | Why it matters |
| --- | --- | --- |
| Keep story facts together | Masterbook categories for characters, rules, locations, lore, factions, artifacts, and plot threads | World information has a home instead of living only in chapter prose. |
| Write safely | Chapters with First, Main, and Final drafts, plus browser-local autosave and version switching | The author can experiment without overwriting their main work. |
| Remember ideas | Notes, scenes, arcs, timeline events, and revision reminders | Small ideas can become useful later without forcing them into the story. |
| Find material quickly | Search, tags, filters, and direct links | A large world needs ways to rediscover old material. |

## 3. Story Vault and the “do not decide for me” rule

The author asked for a place to dump everything at once: notes, links, images, text files, PDFs, and rough ideas. This became **Story Vault** (previously called Dump Book). It accepts material locally and can organize it only through clear author choices.

This led to one of the most important project decisions. The app may prepare suggestions, but it must not make story decisions on its own. Uploading a file does not create a Masterbook fact. Organizing Vault material does not archive it beyond recovery or send it to AI without approval. A suggested connection does not alter chapter prose.

| Safety rule | Meaning in the app |
| --- | --- |
| No silent sending | Optional AI tools show what could leave the browser before the author confirms. |
| No silent filing | Vault material and review suggestions need an explicit add/save action. |
| No silent deletion | Removal actions name what will be removed and ask for confirmation. |
| No silent canon | Local records and drafts never become shared official canon by themselves. |

## 4. Writing help without taking over the novel

The app later gained optional helpers for critique, rewriting, dialogue, lore ideas, scene expansion, and creature-rule checks. These are designed as **separate review cards**, not invisible changes to the manuscript.

For example, Story Critic can evaluate a chapter and give direct scores, strengths, weaknesses, and practical improvements. The Chapter Composer and co-writing tools can create a separate suggestion from an author-provided brief. In every case, the author can discard, copy, append, or replace only after seeing the result. The author’s own words remain untouched until they make that choice.

## 5. PDF chapters and existing work

The author already had chapter PDFs and needed a way to bring them in safely. The app now provides local PDF import with a 10 MB limit and a readable-text preview. A PDF is never allowed to overwrite the current chapter. The author chooses **Keep private** or creates a clearly separate **First Try** draft.

Later, a frequent usability problem was found: the PDF importer existed, but it was too hidden. It is now visible directly in Write as **Import chapter PDF** and **My PDF imports**. Imported chapter records can be reviewed and removed individually without touching other chapters.

## 6. The Masterbook became a game-codex Atlas

The Masterbook slowly changed from repeated records into a more visual **Masterbook Atlas**. It now has destinations such as Character Codex, System Board, World Map, Lore Glossary, Faction Hall, Artifact Cabinet, and Quest Board. This change made the app feel more like a fantasy-world reference book and less like a spreadsheet.

Character records became optional visual dossiers. The author can use any custom stat labels, including HP/MP/SP, STR/AGI/DEF/Mana, or completely personal systems. Place records became visual place folios. A Relationship Web was added only for connections the author deliberately saves.

## 7. Mobile became a first-class part of the app

As the app grew, phone use exposed problems: too many navigation choices, side-by-side boards squeezing into a narrow screen, hidden tools, and unclear back paths. The answer was the **Pocket Story Console**: a touch-friendly phone layout with a fixed five-destination dock for Desk, Write, World, Plan, and Vault.

The same app still has a fuller desktop rail. Phone users can open **More → All tools** to access the complete Feature Map instead of turning on their browser’s Desktop view. A later recording confirmed that a “desktop-looking phone screen” had come from the browser’s intentional Desktop view option, not from the normal phone interface.

## 8. Shared group canon stays separate

The author also wanted a small shared-universe option for friends. This became a separate protected **Team** space. The public author app remains browser-local and does not require login. The Team space has its own Ruler, Writer, and Watcher permissions, join approval, pending canon proposals, approved canon, and Ruler revision history.

> Opening Team does not copy your chapters, Story Vault, PDFs, notes, or Masterbook records there. A local record can become a group proposal only through a separate deliberate action.

## 9. The latest release: a stronger Relationship Web

The most recent release expanded the Relationship Web after research into readable game-codex and character-link patterns. It added three author-controlled tools:

| New tool | What it does | What it never does |
| --- | --- | --- |
| **Focus Thread** | Shows the saved bonds for one chosen character | It does not delete, hide, or modify other saved bonds. |
| **Reader knowledge** | Lets the author mark a bond as Private to author, Visible to reader, Reveal later, or Unclear | It does not change chapter text, character facts, or canon. |
| **Story anchor** | Lets the author link a bond to one existing chapter | It does not infer a chapter link or rewrite the chapter. |

The web also shows an optional pressure point, clear status chips, a small visibility legend, and a clickable chapter anchor. The phone layout was specifically checked so that empty-state instructions remain readable.

## Key release checkpoints

| Checkpoint | Date | Milestone |
| --- | --- | --- |
| `abf13ec2` | 26 Aug 2026 | Masterbook-first Home and reversible local Story Vault organization |
| `9ed1544f` | 26 Aug 2026 | Visual Character Profiles and dossiers |
| `10b3cbc3` | 26 Aug 2026 | Masterbook Atlas and author-defined stats |
| `04da66e0` | 26 Aug 2026 | Place dossiers, Atlas emblems, and first Relationship Web |
| `519bce7c` | 26 Aug 2026 | Pocket Story Console mobile-first redesign |
| `c0ae479f` | 27 Aug 2026 | Player Backup export/import preview |
| `9af44064` | 27 Aug 2026 | Visible PDF import, private Masterbook-update review, and Feature Map |
| `a3a6753a` | 27 Aug 2026 | Clear separate protected Team destination in Feature Map |
| `de58220e` | 27 Aug 2026 | Relationship Web Focus Thread, Reader knowledge, and Story anchor |

## Current state

The Ren Protocol is now a personal local-first novel-writing and worldbuilding app with writing, planning, optional review tools, Story Vault, Masterbook Atlas, character/place dossiers, relationship tracking, private group canon rules, backup exports, PDF import, and desktop/phone discovery tools.

It is not presented as a finished replacement for every commercial writing platform. The best future direction is to make existing tools feel more connected through a simple **Story Spine**, a **Chapter Context Tray**, and a **Chapter Hub**—without breaking the app’s author-control and privacy rules.

## What the author contributed

The author supplied the novel purpose, major features, safety boundaries, testing feedback, visual direction, and decisions about what the app should and should not do. AI-assisted development helped turn those directions into code, tests, visual iterations, and documentation. A truthful project credit can therefore be:

> **Designed and directed by Ajay for Neo Domain Online, with AI-assisted development.**

## Project records used

This history is based on the project’s own release notes, feature checklist, checkpoint messages, and source history. It contains no outside claims or private story content.
