# Dump Book Validation Worklog

## In progress — 2026-08-25

The Dump Book route rendered in the bright local-first workspace with the title, text, link, and compact-file capture controls visible. Temporary browser-local values were entered successfully for a titled note and an HTTPS link; no data was sent to an external service during this step.

The temporary titled text was saved as a Pasted text card, and the HTTPS value was saved as a separate Link card with a safe new-tab link. Both capture fields reset after saving and the card list showed the expected local item count.

A generated 68-byte PNG was accepted through the same file-input path used by the interface, stored as a browser-local data URL, and rendered as a Small image card with its filename and size. The image bytes were not sent to an external service.

The sandbox browser does not allow direct uploads from `/tmp`, so compact-file validation uses an in-memory `File` assigned to the visible browser file input. The application’s native change event and `FileReader` path received a 94-byte Markdown file named `north-gate.md` for confirmation in the rendered list.

The Text file card rendered with extracted Markdown text. The Help me organize flow displayed a review modal containing the exact prepared material, labeled the image as title-only, and explicitly stated that nothing had been sent. Continuing moved the material into the existing local Brain Dump editor but did not call the AI organizer; the separate existing **Organize with AI** button remained the final explicit send action.

After the tested helper import was added, the live preview briefly rendered a blank page on hot reload. The production build and unit suite were already green; runtime logs are being checked before further browser validation.

The blank state persisted after a clean preview reload. The document shell and injected development scripts loaded, but the `#app` mount point remained empty and the console did not surface an error, so the development-server response is being investigated next.

The compatible standalone initialization was restored and the Dump Book rendered again with all four temporary local items after navigation. The first card’s explicit Note-copy click did not create the expected local note in this validation pass, although the action controls held valid item identifiers; this control is being corrected before release.

Dump Book controls now route through the application’s established global action dispatcher. The explicit **Make story note** action was exercised in the rendered document and created one `Dump Book` Notes Desk copy for `north-gate.md`; the original Dump Book item count remained four, confirming author-approved copying rather than automatic moving or merging.

Deletion was tested with the confirmation gate: the prompt named `tiny-check.png` and stated that removal could not be undone. Once confirmed, only that temporary image was removed. A clean route reload retained the remaining three temporary Dump Book items and did not restore the deleted image, confirming browser-local persistence and cleanup behavior.

All temporary validation archive material was then removed from the isolated browser’s `the-ren-protocol.v1` local-storage key. A final clean reload showed the intended empty Dump Book state with the capture controls and no saved test items.
