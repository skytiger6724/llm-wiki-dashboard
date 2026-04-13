# 🧠 LLM Wiki Dashboard v2.1

> **Compiled Intelligence, Visualized.**

A personal knowledge base dashboard inspired by **Andrej Karpathy's** [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). The LLM incrementally builds a persistent, interlinked wiki from your raw sources — and this dashboard visualizes the result.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Version](https://img.shields.io/badge/Version-2.2-green.svg)

---

## The Core Idea

Instead of RAG-style retrieval that rediscovers knowledge from scratch on every query, the LLM **compiles** a persistent wiki — updating entity pages, revising summaries, flagging contradictions, and maintaining cross-references. This dashboard lets you browse, search, and visualize that wiki.

## 🔥 Features

### 📂 Knowledge Directory Navigation
- **Hierarchical Tree**: Expandable directories + clickable files
- **Unified Nav**: Same tree in Home (browse) and Reader (navigate) modes
- **Active Highlighting**: Current file highlighted in blue
- **Auto-root-filter**: Skips wrapper directory, shows content directly

### 📖 Apple UI Reader
- **720px Centered Layout**: Generous 48px margins, optimal reading width
- **Frosted Glass Breadcrumb**: `backdropFilter: blur(20px)` sticky header
- **Typography Hierarchy**: H1 2rem/700, H2 1.5rem/600, body 0.95rem/1.75
- **SF Pro + SF Mono**: System fonts, proper letter-spacing, line-height tuning
- **Table Styling**: 2pt borders, centered text, rounded container, uppercase headers
- **Wikilink Navigation**: Blue dashed underline → solid on hover, click to jump

### 📰 Changelog Feed
- **Recent Changes**: Shows latest 5 wiki updates with type badges
- **Auto-Refresh**: Pull latest entries from `KM_changelog.md` on demand
- **Impact Summary**: See how many files each change affected

### 🔗 Knowledge Graph
- **1,616 Wikilinks**: Extracted from `[[Double Bracket Links]]` across 370 files
- **Force-Directed Layout**: Interactive 2D network via `react-force-graph-2d` + D3
- **Color-Coded Nodes**: Entities (green), Concepts (blue), Summaries (red), Synthesis (purple)
- **Search & Filter**: Real-time node search with instant results

### 📊 Knowledge Density Dashboard
- **4 Key Metrics**: Nodes, Links, Density%, Wikilinks count
- **Top 15 Hubs**: Most connected knowledge nodes ranked by link count
- **Category Distribution**: Visual breakdown with progress bars
- **Isolated Nodes**: Detects and lists pages with no incoming links

### 🎨 Apple UI Design
- **Clean & Minimal**: Generous whitespace, subtle shadows
- **Semantic Colors**: Blue/green/red/orange/purple palette
- **Smooth Interactions**: Hover states, focus rings, transitions

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
~/Documents/21_LLM_Wiki_核心知識庫
```

### 2. Quick Start
```bash
bash start.sh
```

Or manually:
```bash
cd backend && npm install && node precompute-graph.js && node server.js
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

---

## 📄 License
MIT. *Crafted with ❤️ based on Karpathy's LLM Wiki pattern.*
