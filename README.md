# 🧠 LLM Wiki Dashboard

> **Compiled Intelligence, Visualized.**

An advanced, aesthetic dashboard for managing your personal LLM Wiki, inspired by **Andrej Karpathy's** "Compiling Knowledge" philosophy. This app transforms your local Markdown-based knowledge network into a high-performance, interconnected web experience.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Style](https://img.shields.io/badge/Design-Glassmorphism-purple.svg)

---

## 🔥 Features

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

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide Icons.
- **Markdown Engine**: `react-markdown` with `remark-gfm` support.
- **Backend**: Node.js + Express (Local File System API).

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

### 3. Run
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

## 📄 License
This project is licensed under the MIT License.

*Crafted with ❤️ by skytiger6724*
