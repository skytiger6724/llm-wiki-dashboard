# Changelog

All notable changes to the **LLM Wiki Dashboard** will be documented in this file.

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
