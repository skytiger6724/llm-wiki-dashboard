# 🧠 LLM Wiki Dashboard v2.0

> **Compiled Intelligence, Visualized.**

An advanced, aesthetic dashboard for managing your personal LLM Wiki, inspired by **Andrej Karpathy's** "Compiling Knowledge" philosophy. Transforms your local Markdown-based knowledge network into a high-performance, interconnected **knowledge graph** with visualization, metrics, and global search.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Style](https://img.shields.io/badge/Design-Glassmorphism-purple.svg)
![Version](https://img.shields.io/badge/Version-2.0-orange.svg)

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

### 🎨 Elite Aesthetic (拒绝平庸)
- **Glassmorphism UI**: Deep obsidian background with heavy blur and subtle borders.
- **Noise Texture**: A fine film-grain overlay for that high-end "geek" atmosphere.
- **Staggered Animations**: Fluid entrance effects for every UI element.
- **Neon Accents**: Neon Vertex (`#00ffa3`) and Electric Pulse (`#00e5ff`) color scheme.

---

## 🗂️ Project Structure

```
llm-wiki-app/
├── backend/
│   ├── server.js              # Express API server
│   ├── precompute-graph.js    # Graph data pre-computation script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main app with 5 view modes
│   │   ├── graphDataParser.ts # Wikilink → graph data parser
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── components/
│   │       ├── GraphView.tsx       # Force-directed graph
│   │       ├── DashboardMetrics.tsx # Metrics panel
│   │       └── IsolatedNodes.tsx   # Disconnected node detector
│   └── package.json
└── CHANGELOG.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide Icons.
- **Visualization**: `react-force-graph-2d`, D3 Force.
- **Markdown Engine**: `react-markdown` with `remark-gfm` support.
- **Backend**: Node.js + Express (Local File System API with pre-computed graph cache).

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

### 3. Pre-compute Graph Data (required for v2.0)
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
|--------|-------|
| Total Nodes | ~1,035 |
| Total Links | ~1,211 |
| Connected Nodes | ~538 |
| Isolated Nodes | ~497 |

*Stats will vary based on your Wiki content.*

---

## 📄 Changelog
See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## 📄 License
This project is licensed under the MIT License.

*Crafted with ❤️ by skytiger6724*
