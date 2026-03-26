# BG Odds

Interactive backgammon probability calculator covering dice sums, bar entry, hit probability, shot odds, and bear-off chances. Static site with no build step — vanilla HTML/CSS/JS deployed to Cloudflare Pages.

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (no frameworks, no dependencies)
- Cloudflare Pages hosting via Wrangler CLI
- Google Fonts (Inter)

## Commands

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=backgammon-dice-simulator

# Local development — just open index.html in a browser (no server needed)
```

## Project Structure

```
index.html           # Main single-page app (5 tabs: Sums, Bar Entry, Hit Probability, Shot Odds, Bear-off)
script.js            # All calculation logic & DOM manipulation (~930 lines)
style.css            # Theming via CSS custom properties, responsive (768px/480px breakpoints)
board-exploration.html  # Standalone experimental board visualization (separate from main app)
_headers             # Cloudflare cache-control (no-cache on all assets)
```

## Architecture & Patterns

- **Tab-based SPA**: Tabs selected via `data-tab` attributes; each tab has a calculator section, 6x6 dice grid, and combinations table
- **Data attributes for state**: `data-tab`, `data-sum`, `data-point`, `data-value` drive UI behavior
- **Probability engine**: All calculations based on 36 equally likely dice outcomes. Some tabs use hardcoded lookup tables (`barEntryData`, `hitProbabilityData`), others compute dynamically
- **Naming conventions**: camelCase JS functions, BEM-inspired CSS classes (`.calculator-section`, `.grid-cell`, `.point-toggle`), state classes (`.active`, `.highlighted`, `.blocked`, `.double`)
- **ID pattern**: `[tabName]-tab` for content sections, `[tabName]TableBody` for table bodies
- **Cache-busting**: Query params on CSS/JS imports (`?v=2`) plus `_headers` no-cache directives

## Known Simplifications

- Shot odds tab ignores doubles' special 4-move advantage (intentional)
- Bear-off table filtered to positions where sum <= 8
- No tests or CI/CD
