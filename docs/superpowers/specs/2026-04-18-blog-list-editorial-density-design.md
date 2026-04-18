# Blog List Editorial Density Design

## Goal
Restyle `/blog/` to match the tighter, editorial, document-like feeling of the reference list UI.

## Scope
- Update the `/blog/` page header area.
- Update the post list row layout and visual density.
- Preserve existing data source and routing.
- Keep changes compatible with desktop and mobile.

## Design
### Header
- Replace the sparse page heading with an editorial header block.
- Add breadcrumb text, a stronger title, and a short explanatory paragraph.
- Keep the overall layout flat and text-led, with no card treatment.

### List Rows
- Use a single-row composition: title, thin divider line, date.
- Reduce vertical spacing between items.
- Increase title weight slightly and keep date muted and tabular.
- Add subtle hover emphasis on the title only.

### Layout and Responsiveness
- Use a slightly narrower content width than generic pages to create a denser reading rhythm.
- On smaller screens, collapse the divider and let date flow under the title while preserving compact spacing.

## Constraints
- No new dependencies.
- Reuse existing page and component structure.
- Keep diff small and reversible.

## Testing
- Verify with `pnpm build`.
- Verify `/blog/` renders in `pnpm dev` without layout breakage.
