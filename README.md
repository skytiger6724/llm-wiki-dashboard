# 🧠 LLM Wiki Dashboard v2.1

> **Compiled Intelligence, Visualized.**

An advanced, aesthetic dashboard for managing your personal LLM Wiki, inspired by **Andrej Karpathy's** "Compiling Knowledge" philosophy. Transforms your local Markdown-based knowledge network into a high-performance, interconnected **knowledge graph** with visualization, metrics, and global search.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Style](https://img.shields.io/badge/Design-Apple%20UI-blue.svg)
![Version](https://img.shields.io/badge/Version-2.1-green.svg)

---

## 🔥 Features

### 🌐 Knowledge Graph Visualization
- **Force-Directed Graph**: Interactive 2D network layout powered by `react-force-graph-2d` and D3.
- **Node Coloring**: Color-coded by knowledge category (Entities, Concepts, Summaries, Comparisons, Synthesis).
- **Glow Effects & Tooltips**: Hover to see node details; links animate with directional particles.
- **Search & Filter**: Real-time node search, category and layer filtering.

### 📊 Dashboard Metrics
- **Graph Statistics**: Node count, link count, density, average degree.
- **Category Distribution**: Visual breakdown of knowledge types.
- **Top 10 Hubs**: Most connected knowledge nodes ranked by link count.

### 🔗 Isolated Node Detection
- **Automatic Identification**: Finds disconnected knowledge nodes.
- **Reason Classification**: No links, single layer, or orphan summary.
- **Suggested Connections**: Recommends related nodes based on category and keyword matching.

### 🔍 Global Search Homepage
- **Instant Search**: Find any knowledge node by name or category.
- **Quick Navigation**: Top 10 hub nodes for fast access.
- **Knowledge Overview**: Real-time stats on your knowledge network.

### 🏛️ Karpathy-style Compilation
- **Direct Local Sync**: Reads directly from your structured `20_LLM_Wiki` directory.
- **Smart Knowledge Jumping**: Automatically parses `[[Double Bracket Links]]` and enables seamless navigation between Entities, Concepts, and Summaries.
- **Hierarchical Navigation**: Visualizes the four-layer structure (System, Raw, Wiki, Output) with an intuitive sidebar.

### 🎨 Apple UI Design System
- **Clean & Minimal**: Inspired by Apple's design language — SF Pro typography, generous whitespace, subtle shadows.
- **System Colors**: Apple Blue, Green, Red, Orange, Teal, Purple for consistent semantic coloring.
- **Apple Typography**: Center-aligned tables with 2pt borders, SF Mono for code blocks, SF Pro Display for headings.
- **Responsive Interactions**: Smooth hover states, focus rings, and staggered entrance animations.
- **Markdown Tables**: Center-aligned text, 2pt borders, zebra striping, and hover highlighting.

---

## 🗂️ Project Structure

```
llm-wiki-app/
├── backend/
│   ├── server.js              # Express API server (in-memory graph cache)
│   ├── precompute-graph.js    # Graph data pre-computation script
│   ├── graph-data.json        # Pre-computed wikilink graph (gitignored)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main app with 5 view modes (home, reader, graph, metrics, isolated)
│   │   ├── graphDataParser.ts # Wikilink → graph data parser
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── index.css          # Apple UI design system (CSS variables + components)
│   │   └── components/
│   │       ├── GraphView.tsx       # Force-directed graph visualization
│   │       ├── DashboardMetrics.tsx # Metrics panel with stats
│   │       └── IsolatedNodes.tsx   # Disconnected node detector
│   └── package.json
├── README.md
└── CHANGELOG.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide Icons.
- **Visualization**: `react-force-graph-2d`, D3 Force.
- **Markdown Engine**: `react-markdown` with `remark-gfm` support.
- **Backend**: Node.js + Express (Local File System API with pre-computed graph cache).
- **Design**: Apple UI Design System (CSS custom properties, SF Pro typography, semantic colors).

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have Node.js installed and your Wiki follows the standard structure at:
`/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫/20_LLM_Wiki`

### 2. Setup
Clone the repo and install dependencies for both layers:

```bash
# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 3. Pre-compute Graph Data (required for v2.0+)
Generate the static graph data JSON to enable fast API responses:

```bash
cd backend && node precompute-graph.js
```

### 4. Run
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend && node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

Visit **http://localhost:5173** to initiate knowledge retrieval.

---

## 📊 Knowledge Graph Stats

| Metric | Value |
|:------:|:-----:|
| Total Nodes | ~1,050 |
| Total Links | ~1,300+ |
| Connected Nodes | ~550 |
| Isolated Nodes | ~500 |

*Stats will vary based on your Wiki content. Use the Dashboard Metrics panel for real-time numbers.*

---

## 🎨 Design Tokens

| Token | Value | Usage |
|:------|:------|:------|
| `--apple-blue` | `#0071e3` | Primary actions, links, active states |
| `--apple-green` | `#34c759` | Success, Entities category |
| `--apple-red` | `#ff3b30` | Errors, Summaries category |
| `--apple-orange` | `#ff9500` | Warnings, Comparisons category |
| `--apple-teal` | `#5ac8fa` | Links, secondary info |
| `--apple-purple` | `#af52de` | Synthesis category |
| `--apple-text-primary` | `#1d1d1f` | Main text |
| `--apple-text-secondary` | `#6e6e73` | Secondary text |
| `--apple-text-tertiary` | `#86868b` | Muted text |
| `--apple-bg` | `#f5f5f7` | Page background |
| `--apple-surface` | `#ffffff` | Card/panel background |

---

## 📄 Changelog
See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## 📄 License
This project is licensed under the MIT License.

*Crafted with ❤️ by skytiger6724*
