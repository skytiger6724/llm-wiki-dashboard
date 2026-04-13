# Changelog

All notable changes to LLM Wiki Dashboard.

---

## [2.2.0] — 2026-04-13

### Obsidian-Style Graph View Redesign

- **Category Color Nodes**: Entities=green, Concepts=blue, Summaries=pink, Synthesis=purple
- **Layer Color Coding**: System=purple, Raw=cyan, Wiki=green, Output=amber
- **Hover Highlights**: Node + neighbors highlight on hover, dimming unrelated nodes
- **Zoom Controls**: Mouse wheel zoom with smooth scaling, center reset button
- **Node Size by Connections**: Larger nodes = more wikilinks (degree-based scaling)
- **Arrow Indicators**: Directional arrows on links showing wikilink direction
- **Search Integration**: Highlight matching nodes when searching

### Apple-Style Sidebar Redesign

- **Obsidian-Inspired Tree**: Dark text on light background, #eaf3ff hover highlight
- **Default Collapsed**: Tree nodes default to collapsed (was auto-expand depth 2)
- **Refined Typography**: 0.82rem/600 for directories, 0.78rem/400 for files
- **Refresh Button**: Added manual refresh trigger for tree reload

### Auto Change Scanning API

- **`/api/scan-changes` Endpoint**: Scans Wiki/Output directories for file changes
- **Automatic Changelog Writing**: Updates `KM_changelog.md` with detected changes
- **`scan-changes.py` Backend Script**: Python-based file scanner with JSON output

### Orphan Node Cleanup (2026-04-13)

- **Conversation Filter**: `precompute-graph.js` now permanently skips `Conversation_` files (467 raw AI chat logs)
- **Auto Orphan Removal**: Graph data automatically filters nodes with zero incoming AND zero outgoing wikilinks
- **`cleanup-orphans.py` Tool**: Standalone script for manual orphan node detection and cleanup
- **Result**: Graph reduced from 1242 → 1246 clean nodes, **0 orphaned nodes**
- **Backup**: Automatic `graph-data.json.backup` before each cleanup

---

## [2.1.0] — 2026-04-09

### Complete Graph Rebuild

- **Fixed `precompute-graph.js`** to correctly extract `[[wikilinks]]` — wikilinks went from 0 to **1,810**
- **1,616 graph links** across **1,343 nodes** from **370 files** with wikilinks
- **Karpathy-style compilation**: respects `[[target|alias]]` format, auto-creates target nodes

### Apple UI Reader Overhaul

- **720px Centered Layout**: Optimal reading width with 48px margins
- **Frosted Glass Breadcrumb**: Sticky header with `backdropFilter: blur(20px)`
- **Typography Hierarchy**: H1 2rem/700 `-0.025em`, H2 1.5rem/600 `-0.02em`, body 0.95rem/1.75
- **Table Styling**: 2pt borders, centered text, rounded container, uppercase headers
- **Code Blocks**: `#1d1d1f` dark background, SF Mono font
- **Wikilink Navigation**: Blue underline, hover transition, click to jump

### Directory Navigation Fix

- **Fixed TreeNodeItem**: Was `return null` for files — now displays all `.md` files
- **File Click Handler**: `onSelect(node.path)` opens reader view
- **Active Highlighting**: Current file highlighted blue with bold font
- **Unified Tree**: Same directory structure in both Home and Reader modes
- **Root Filter**: Auto-skips `21_LLM_Wiki_核心知識庫` wrapper, shows content directly

### Changelog Feed

- **Recent 5 Changes**: Parsed from `KM_changelog.md` via `/api/km-changelog`
- **Type Badges**: ✅ New / 🔧 Fix / 📝 Update / 🗑️ Remove
- **Refresh Button**: Pulls latest entries on demand

### Knowledge Density Dashboard

- **Top 15 Hubs**: Most connected nodes ranked by link count
- **Category Distribution**: Progress bars showing entity/concept/summary breakdown
- **4-Column Stats Cards**: Nodes, Links, Density%, Wikilinks count

### Bug Fixes

- Removed backup files with special characters (`*Dwayne的MacBook Pro.*`)
- Fixed TypeScript compilation errors in all components
- Fixed Vite connectivity issues with corrupted node_modules
- Simplified component props (GraphView, DashboardMetrics, IsolatedNodes)

---

## [2.0.0] — 2026-04-08

### Initial Dashboard Release

- **5 View Modes**: Home, Reader, Graph, Metrics, Isolated Nodes
- **Force-Directed Graph**: react-force-graph-2d visualization
- **Apple UI Design**: SF Pro typography, semantic colors, minimal layout
- **Markdown Reader**: GFM rendering with wikilink navigation
- **Global Search**: Instant node search by name or category
- **Dashboard Metrics**: Node count, link count, density, category distribution

### Backend

- **Express API Server**: `/api/tree`, `/api/content`, `/api/all-content`, `/api/km-changelog`
- **Pre-computed Graph**: `precompute-graph.js` for fast graph generation
- **In-Memory Cache**: Graph data loaded at startup for instant API responses
