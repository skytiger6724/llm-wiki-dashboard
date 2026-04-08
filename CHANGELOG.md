# Changelog

All notable changes to the **LLM Wiki Dashboard** will be documented in this file.

---

## [2.1.0] - 2026-04-08

### Changed
- **Apple UI Design System**: Replaced dark glassmorphism/neon theme with clean Apple-inspired design — SF Pro typography, `#f5f5f7` background, white surfaces, semantic system colors.
- **Table Styling**: All markdown tables now feature center-aligned text and 2pt borders (`border: 2pt solid`).
- **Sidebar Readability**: Fixed invisible text in "Quick Navigation" section — all colors now use Apple CSS variables (`--apple-text-primary`, `--apple-text-secondary`, `--apple-text-tertiary`).
- **Component Color Audit**: Updated DashboardMetrics, IsolatedNodes, GraphView, and GlobalSearch to use Apple color tokens consistently.
- **Tooltip Redesign**: Graph hover tooltips now use white surface with Apple borders and shadows instead of dark neon overlays.

### Design Tokens
| Before | After |
|--------|-------|
| `#0d0f12` obsidian background | `#f5f5f7` Apple gray |
| `#00ffa3` neon green accent | `#0071e3` Apple blue |
| Dark glassmorphism panels | White surface cards |
| Neon glowing borders | Subtle Apple shadows |

---

## [2.0.0] - 2026-04-08

### Added
- **Knowledge Graph Visualization (v2.0)**: Integrated `react-force-graph-2d` with force-directed layout, node glow effects, and hover tooltips.
- **Dashboard Metrics Panel**: Real-time statistics including node count, link density, category distribution, and Top 10 knowledge hubs.
- **Isolated Node Detection**: Automatic identification of disconnected nodes with reason classification (no links, single layer, orphan) and suggested connections.
- **Global Search Homepage**: Added a home view with full-text search across all wiki nodes, quick navigation sidebar, and recently viewed tracking.
- **Backend `/api/all-content` Endpoint**: Optimized wikilink extraction API that returns only link data (not full content) to prevent OOM crashes with 1000+ files.

### Changed
- **Graph Data Pipeline**: Refactored `buildGraphData()` to accept pre-extracted wikilink cache instead of full content, reducing API payload from ~50MB to ~50KB.
- **Default View**: Changed initial view from empty reader to homepage with search bar and knowledge overview.
- **Type Definitions**: Consolidated `GraphNode`, `GraphLink`, and `GraphData` interfaces into `types.ts` with proper exports.

### Fixed
- **Backend OOM Crash**: Resolved Node.js memory exhaustion by extracting only wikilinks server-side instead of loading all Markdown content.
- **Node Key Matching**: Fixed filename collision issue by using relative paths as cache keys and extracting basename for matching.
- **Graph Loading Race Condition**: Added `tree.length === 0` guard to prevent graph building before tree data is loaded.

### Isolated Node Linking
- **Auto-linked 141 isolated nodes** based on intelligent categorization rules:
  - Astrology/Metaphysics nodes → `西方占星體系`, `宮位系統`, `相位系統`
  - AI/Tech nodes → `LLM_Wiki_Compiler`, `Agentic_AI`, `工業AI大腦`
  - Investment/Finance nodes → `社交力學_Social_Dynamics`
  - Skills/Tools nodes → `提示詞工程_Prompt_Engineering`
  - PUA/Social nodes → `社交力學`, `戀愛腦`, `說服策略`
  - Reports/KM nodes → `LLM_Wiki_Compiler`, `知識複利系統`
- **Reduced isolated nodes by 21.9%** (from 638 to 498), increased total links from 956 to 1207.

---

## [1.0.0] - 2026-04-07

### Added
- **Initial Core Architecture**: Implemented a Node.js + Express backend to serve local Markdown files from the Obsidian vault.
- **Glassmorphism UI**: Developed a React 19 frontend featuring high-end aesthetics (blur, noise texture, and staggered animations).
- **Interconnected Knowledge Navigation**: Created a custom Wiki Link parser that transforms `[[Link]]` syntax into clickable navigation points.
- **Smart Directory Discovery**: Implemented recursive scanning of the `20_LLM_Wiki` structure (System, Raw, Wiki, Output).

### Changed
- **Type Safety Overhaul**: Migrated `TreeNode` interfaces to a dedicated `types.ts` to prevent circular dependency issues between `App.tsx` and `Sidebar.tsx`.
- **Server Connectivity**: Optimized Vite server configuration (`0.0.0.0`) to ensure reliable connectivity across local environments.

### Fixed
- **Blank Page Issue**: Resolved critical TypeScript export errors that caused React tree crashes during initial HMR.
- **Lucide Icon Importing**: Switched to named imports for enhanced stability in high-version React/Vite environments.

---
*Created with ❤️ by skytiger6724*
