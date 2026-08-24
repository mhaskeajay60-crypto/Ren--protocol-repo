# The Ren Protocol — Design Exploration

## Three Directions Considered

### 1. The Ember Archive
**Very Brief Intro:** A scholarly, firelit archive where manuscript pages and evidence cards gather around a warm gold seam. It feels private, deliberate, and made for long sessions of story stewardship.

**Probability:** 0.06

### 2. Signal Noir
**Very Brief Intro:** A low-light interface inspired by surveillance consoles and classified future dossiers. Sharp panels and sparse warning colors make continuity work feel investigative.

**Probability:** 0.03

### 3. The Marginalia Room
**Very Brief Intro:** An editorial studio built around annotated paper, handwritten marks, and editorial slips. Its softer, literary texture supports a reflective drafting practice.

**Probability:** 0.08

## Chosen Direction: The Ember Archive

**Design Movement:** Contemporary editorial design with the restrained materiality of a private archival reading room.

**Core Principles:**
1. **Writing remains sacred:** chapter text gets the calmest, brightest surface and the most visual breathing room.
2. **Evidence has structure:** lore, events, and continuity signals look like catalogued research material rather than generic dashboard widgets.
3. **Gold is a signal, not a fill:** the accent colour identifies a decision, a focus state, a connection, or a valuable detail.
4. **Quiet hierarchy:** scale, rules, and spacing create a sense of order without clutter or ornamental excess.

**Color Philosophy:** Nearly-black charcoal and smoked indigo create a protected late-night working environment. Parchment-tinted text reduces glare, while antique gold provides a limited, purposeful glow for the author’s active trail through the archive. Oxidised red is reserved solely for continuity risks.

**Layout Paradigm:** A persistent left archive rail anchors the application. The working view is an asymmetric desk: navigation and live chapter context remain narrow and architectural; the manuscript expands into a paper-like main column; supporting intelligence arrives in a detachable right inspector. On smaller screens, these contexts become slide-up layers rather than squeezed columns.

**Signature Elements:**
1. A vertical gold ‘protocol line’ running through the archive rail.
2. Fine catalog rules, folio labels, and small-caps metadata that echo curated archival records.
3. A faint, abstract ember field behind the workspace, seen only at the edges of the desk.

**Interaction Philosophy:** Controls react like editorial tools: direct, quick, and unobtrusive. The author should never need to leave the manuscript to check a fact, save a version, acknowledge a warning, or open a referenced character.

**Animation:** Use a 160–220ms custom ease-out for panels, dialog entrances, and hover emphasis. Active rail items receive a short gold line-draw and subtle lateral shift. The editor never animates while typing. All non-essential movement is disabled for reduced-motion preferences.

**Typography System:** `DM Mono` provides compact editorial metadata, labels, and navigation. `Cormorant Garamond` supplies the manuscript text and major display moments; its reading texture makes the writing surface feel intentional. Hierarchy relies on italic display accents, high-contrast large chapter titles, and restrained mono small caps—never generic sans-serif dominance.

**Brand Essence:** A private, local-first archive for novelists who manage intricate worlds without losing the thread of the draft. **Deliberate, archival, vigilant.**

**Brand Voice:** Headlines are concise and author-centred; CTAs refer to active writing actions rather than generic onboarding. Microcopy acts as a calm editorial assistant.

> “Keep the world intact. Keep the story moving.”
>
> “Return to the line that matters.”

**Wordmark & Logo:** A simple gold monogram that merges an open book spine, a linked chain, and a narrow protocol beacon. It uses no text and sits beside a typeset wordmark with an intentionally editorial cadence.

**Signature Brand Color:** **Archive Gold — #C9A84C.**

## Style Decisions

- Archive Gold is reserved for the protocol line, active trail, key status numerals, and decisive writing actions; it is not a general decorative fill.
- Labels use archival-local language such as folios, records, and manuscript archive rather than network or command-console language.
- Evidence panels use small-caps folio labels, fine rules, and dossier hierarchy so continuity work reads as literary stewardship rather than generic dashboard monitoring.
