# Changelog

All notable changes to LLM Wiki Dashboard.

## [2.1.0] — 2026-04-09

### Complete Graph Rebuild

- **Fixed `precompute-graph.js`** to correctly extract `[[wikilinks]]` from all Markdown files — wikilinks went from 0 to **1,810**
- **1,616 graph links** across **1,343 nodes** from **370 files** with wikilinks
- **Karpathy-style compilation**: respects `[[target|alias]]` format, auto-creates target nodes even without physical files

### Homepage Redesign

- **Changelog Feed**: Shows latest 5 wiki changes with type badges (✅ new / 🔧 fix / 📝 update / 🗑️ remove)
- **Directory Navigation**: Replaced "Top 10 hot nodes" with full hierarchical directory browser
- **Refresh Button**: Pulls latest entries from `KM_changelog.md` on demand
- **4-Column Stats Cards**: Nodes, Links, Density%, Wikilinks count

### Knowledge Density Dashboard

- **Top 15 Hubs**: Most connected nodes ranked by link count
- **Category Distribution**: Progress bars showing entity/concept/summary breakdown
- **Density Metrics**: Metcalfe's Law-based calculation + average degree + isolated node count

### Architecture Simplification

- **Unified `types.ts`**: All interfaces (ContentTreeItem, ChangelogEntry, GraphNode, GraphData) in one file
- **Simplified Components**: GraphView, DashboardMetrics, IsolatedNodes — no prop type conflicts
- **Zero TypeScript errors**: Clean compilation across all files

### Bug Fixes

- Fixed node_modules corruption that prevented Vite from starting
- Removed backup files with special characters in filenames
- Fixed Sidebar component import errors
- Fixed graphDataParser to fetch from API instead of rebuilding locally

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
