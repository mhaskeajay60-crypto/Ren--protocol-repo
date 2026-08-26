# Masterbook Atlas Pattern Notes

This note records the external interaction patterns used only as design inspiration for The Ren Protocol. The app remains browser-local for private author records unless the author deliberately uses the separate private group workflow.

## Character Codex and quick editing

[Chronica’s NPC & Player Codex guide](https://chronica.ventures/guidebooks/npc-player-codex) separates a character list from a full profile, offers a direct View action and a separate quick-edit path, and supports optional custom character stats. The Masterbook Atlas applies the useful interaction idea—not Chronica’s visual design—by giving a character one clear dossier action and moving secondary controls into More.

## Atlas destinations and cross-links

[World Anvil](https://www.worldanvil.com/) presents worldbuilding as linked article types, maps, timelines, and major categories rather than a single uniform feed. Its category-first approach informed the Atlas Shelf concept: Character Codex, System Board, World Map, Lore Glossary, Faction Hall, Artifact Cabinet, and Quest Board. The Ren Protocol will retain simple local data and will not copy World Anvil’s templates, content, or cloud behavior.

## Flexible stat modules

[Character Sheet Online](https://charactersheetonline.com/) describes custom sheet templates, modular mobile-friendly character sheets, and formula-capable stats. The relevant design lesson is author-defined labels: no stat is forced. In The Ren Protocol, an author can start with optional HP/MP/SP or STR/AGI/DEF/Magic DEF/Mana presets, remove them, or use entirely custom labels such as Soul Charge or Origin Resonance. No automated formulas or gameplay calculations are planned unless separately approved.

## Approval boundary

The current private-team role model permits Writers and Rulers to propose canon, allows Watchers to read approved canon, and reserves approval/revision for the Ruler. For the requested “Lore Keeper” concept, the safe first implementation is a **Lore Keeper approval label for the existing Ruler approval action**, rather than silently adding a new database role. A local stat profile stays in the author’s browser. Only an explicit group canon proposal may transfer a selected stat profile to the private group, and the Ruler/Lore Keeper must then approve it.
