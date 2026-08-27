# Relationship Web Visual Research

## References reviewed

The visual-reference search showed three especially useful patterns: a **legend that gives link colors meaning**, a **central selected character with direct connections surrounding it**, and a **simple category view when a full web becomes visually busy**.[1] The Pinterest visual-novel interface collection also confirms that card-like character presentation and strong themed framing are common inspiration directions, though its individual items could not be inspected without a Pinterest login.[2]

Game interface research reinforced a key principle: a menu can reinforce a story’s theme rather than be a neutral generic control surface, but it must remain usable and readable.[3] The Relationship Web should therefore use an original game-codex treatment—character seals, named bonds, focus mode, and restrained magical connection lines—without copying any image, layout, or game artwork.

## Chosen design direction

The completed Relationship Web extension should stay browser-local and author-controlled. Its three connected additions are:

1. **Bond Ledger:** each saved relationship receives an author-written type, private note, direction, and a simple intensity label; nothing is inferred from prose.
2. **Focus Thread:** selecting one saved character filters the web to that character’s known connections, keeping a dense world readable on a phone.
3. **Story Pressure:** the author may mark a relationship as stable, strained, hidden, broken, or changing; this is a private planning signal, not canon and not an automatic plot generator.

These additions will be represented with clear labels, a compact legend, and progressive disclosure rather than a larger form. The author must deliberately create or revise every bond and pressure marker. Existing records remain unchanged.

## Implementation Check

An isolated development-browser sample verified two deliberately saved bonds: one **Reveal later** bond with a pressure point and a chapter anchor, plus one **Visible to reader** bond. The Relationship Web rendered the Focus Thread picker, legend, state/visibility chips, pressure note, dossier links, and chapter anchor. This sample existed only in the development browser’s local storage and did not use, alter, or expose the author’s public-site archive.

The Focus Thread selector was also tested directly: selecting **Ren** retained Ren’s two saved bonds, and selecting **Mira** showed only the saved Ren–Mira bond. The separate Bond Ledger below the web remained unchanged, confirming that focus is only a local view filter and does not edit, hide, or delete a relationship record.

The edit screen was checked with the isolated sample bond. It presents **Reader knowledge** and **Story anchor** as explicit author-selected dropdowns beside the existing relationship stage, dynamics, and pressure fields. The opening explanation correctly states that the record does not alter a profile, manuscript, or shared canon. Native-phone captures confirmed that the Relationship Web and the secondary Connections ledger now retain readable empty-state and helper text on pale cards.

## Current release verification

Desktop Connections shows the new private Relationship Web visual-view chooser, Focus Thread chooser, bond legend, and empty guidance without overlap. Native 375-pixel phone view keeps the controls in a readable single column and leaves the Pocket dock reachable. The empty Masterbook Atlas remains readable at the same phone size. The dark Chapter Connections title/description contrast was strengthened with a scoped phone rule and its final capture is readable.

## References

[1]: https://www.pinterest.com/pin/relationship-map-ideas/ "Visual reference search results: relationship-map legends and centered-node layouts"
[2]: https://www.pinterest.com/cat200403/visual-novel-ui/ "Pinterest — Visual novel UI collection"
[3]: https://www.gamedeveloper.com/design/thematic-storytelling-through-menu-design "Game Developer — Thematic Storytelling Through Menu Design"
