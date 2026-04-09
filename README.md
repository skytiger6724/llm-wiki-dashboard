# 🧠 LLM Wiki Dashboard v2.1

> **Compiled Intelligence, Visualized.**

A personal knowledge base dashboard inspired by **Andrej Karpathy's** [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). The LLM incrementally builds a persistent, interlinked wiki from your raw sources — and this dashboard visualizes the result.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Style](https://img.shields.io/badge/Design-Apple%20UI-blue.svg)
![Version](https://img.shields.io/badge/Version-2.1-green.svg)

---

## The Core Idea

Instead of RAG-style retrieval that rediscovers knowledge from scratch on every query, the LLM **compiles** a persistent wiki — updating entity pages, revising summaries, flagging contradictions, and maintaining cross-references. The wiki is a persistent, compounding artifact. This dashboard lets you browse, search, and visualize that wiki.

## 🔥 Features

### 📰 Changelog Feed
- **Recent Changes**: Shows the latest 5 wiki updates with type badges (new / fix / update / remove).
- **Auto-Refresh**: Click "Refresh" to pull the latest entries from `KM_changelog.md`.
- **Impact Summary**: See how many files each change affected.

### 📂 Knowledge Directory
- **Hierarchical Navigation**: Browse the full wiki directory with expand/collapse.
- **Category-Based**: Organized by System, Raw, Wiki layers — not individual files.
- **Quick Access**: Click any node to jump straight into the reader.

### 🔗 Knowledge Graph
- **1,616 Wikilinks**: Extracted from `[[Double Bracket Links]]` across 370 files.
- **Force-Directed Layout**: Interactive 2D network via `react-force-graph-2d` + D3.
- **Color-Coded Nodes**: Entities (green), Concepts (blue), Summaries (red), Synthesis (purple).
- **Search & Filter**: Real-time node search with instant results.

### 📊 Knowledge Density
- **4 Key Metrics**: Nodes, Links, Density%, Wikilinks count.
- **Top 15 Hubs**: Most connected knowledge nodes ranked by link count.
- **Category Distribution**: Visual breakdown with progress bars.
- **Isolated Nodes**: Detects and lists pages with no incoming links.

### 📖 Reader
- **Markdown Rendering**: Full GFM support with tables, code blocks, and lists.
- **Wikilink Navigation**: Click `[[links]]` to jump between connected pages.
- **Breadcrumb Path**: Always know where you are in the knowledge hierarchy.

### 🎨 Apple UI Design
- **Clean & Minimal**: SF Pro typography, generous whitespace, subtle shadows.
- **Semantic Colors**: Consistent blue/green/red/orange/purple palette.
- **Smooth Interactions**: Hover states, focus rings, transitions.

---

## 🗂️ Project Structure

```
llm-wiki-app/
├── backend/
│   ├── server.js              # Express API (tree, content, graph, changelog)
│   ├── precompute-graph.js    # Scans wiki, extracts [[wikilinks]], builds graph
│   ├── graph-data.json        # Pre-computed graph (1343 nodes, 1616 links)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main app: home, reader, graph, metrics, isolated
│   │   ├── graphDataParser.ts # Graph data loader + density computation
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── index.css          # Apple UI design tokens
│   │   └── components/
│   │       ├── GraphView.tsx       # Force-directed visualization
│   │       ├── DashboardMetrics.tsx # Density metrics + distribution
│   │       └── IsolatedNodes.tsx   # Orphan node detector
│   └── package.json
├── start.sh                   # One-click startup script
├── README.md
└── CHANGELOG.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 5, TypeScript, Lucide Icons |
| **Visualization** | `react-force-graph-2d`, D3 Force |
| **Markdown** | `react-markdown` + `remark-gfm` |
| **Backend** | Node.js + Express (in-memory graph cache) |
| **Design** | Apple UI (CSS custom properties, SF Pro) |

---

## 🚀 Getting Started

### 1. Requirements
Node.js 18+. Wiki directory at:
```
/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫
```

### 2. Quick Start
```bash
bash start.sh
```

Or manually:
```bash
# Backend
cd backend && npm install && node precompute-graph.js && node server.js

# Frontend (another terminal)
cd frontend && npm install && npx vite
```

Visit **http://localhost:5173**

### 3. Stop
```bash
screen -S llm-wiki-api -X quit && screen -S llm-wiki-fe -X quit
```

---

## 📊 Current Stats

| Metric | Value |
|:------:|:-----:|
| Knowledge Nodes | 1,343 |
| Wikilinks Extracted | 1,810 |
| Graph Links | 1,616 |
| Files with Links | 370 |
| Changelog Entries | 8 |
| Isolated Nodes | ~200 |

---

## 📄 License
MIT. *Crafted with ❤️ based on Karpathy's LLM Wiki pattern.*
