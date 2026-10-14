# NexusForge Studio — AI Addons & Creative Assets

**NexusForge Studio** is an AI-powered addon and creative asset generator focused on producing marketplace-ready commercial packages for **Blender, ZBrush, Procreate, and Photoshop**.

From a simple natural-language description, the app uses **Gemini** (`@google/genai`) to generate a complete multi-file project: valid source code per platform standards, an installation README, LICENSE, simulated interactive controls, and sales copy optimized for marketplaces like Gumroad or BlenderMarket.

---

## ✨ Features

- **AI addon generation**: creates scripts, panels, shaders, brushes, or full asset suites via enriched technical prompts.
- **4 supported platforms**:
  - 🧊 **Blender** — Python (`bpy` / `bmesh`), operators, N-panel UI, valid `bl_info`.
  - 🗿 **ZBrush** — ZScript with macros (`[IButton,...]`, `[VarSet,...]`).
  - 🎨 **Procreate** — brush engine parameters (JSON) and color palettes.
  - 🖌️ **Photoshop** — modern UXP plugins (`manifest.json` v5 + `batchPlay`).
- **Multi-file code editor** (`MultiFileCodeEditor`): browse and review every file in the generated project.
- **Viewport simulator** (`ViewportSimulator`): preview the addon's UI and interactive controls directly in the browser, without opening the target software.
- **Marketplace Studio** (`MarketplaceStudio` + `MarketplaceInsightsModal`): title, suggested price, taglines, features, target audience, installation guide, tags, and extended AI-generated sales copy.
- **Agent prompt bar** (`AgentPromptBar`): describe your idea and let the AI turn it into an exhaustive technical specification (`/api/enhance-prompt`).
- **Instant starter templates**: curated sample projects per platform (`src/data/templates.ts`) that work even without an API key configured.
- **Sell-ready ZIP export** (`zipPackager`): packages all code, documentation, installation guide, and marketplace copy into a downloadable `.zip` in the browser (JSZip).
- **Robust fallbacks**: if the Gemini API is unavailable or fails, the server returns built-in high-fidelity templates, keeping the UI fully operational.

---

## 🏗️ Architecture

The application follows a client-server model:

- **Frontend**: React 19 + TypeScript + Vite 8 + Tailwind CSS 4, with animations (`motion`), icons (`lucide-react`), and custom fonts.
- **Backend**: Express server (`server.ts`) that centralizes calls to the Gemini API (API key never exposed to the client). In development it uses the Vite middleware; in production it serves the static assets from `dist/`.

### Usage flow

1. Select platform, asset type, and target version in the top bar.
2. Write (or enhance with AI) the prompt describing the desired addon, or pick a starter template.
3. The AI generates the full project against `/api/generate-addon` using a strict JSON schema.
4. Explore the code in the editor, simulate the tool in the viewport simulator, and fine-tune the listing in the Marketplace Studio.
5. Download the `.zip` package ready to install or publish.

---

## 📂 Project structure

```
.
├── server.ts                     # Express server + AI routes (Gemini)
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration (React + Tailwind)
├── package.json                  # Scripts and dependencies
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Environment variables template
├── metadata.json                 # Applet metadata (AI Studio)
└── src/
    ├── main.tsx                  # React bootstrap
    ├── App.tsx                   # Root component and state orchestration
    ├── index.css                 # Global styles (Tailwind)
    ├── types/
    │   └── addon.ts              # Types: AddonProject, AddonFile, MarketplaceInfo, etc.
    ├── data/
    │   └── templates.ts          # Starter templates (TemplatePreset)
    ├── utils/
    │   └── zipPackager.ts        # ZIP packaging and download (JSZip)
    └── components/
        ├── TopNav.tsx                    # Navigation, platform selector and tabs
        ├── AgentPromptBar.tsx            # Generation prompt + AI enhancement
        ├── MultiFileCodeEditor.tsx       # Multi-file project editor
        ├── ViewportSimulator.tsx         # Addon UI simulation
        ├── MarketplaceStudio.tsx         # Marketplace listing and copy
        └── MarketplaceInsightsModal.tsx  # Sales metrics and insights
```

---

## 🔌 API (Express)

| Method | Route                    | Description                                                                                 |
|--------|--------------------------|---------------------------------------------------------------------------------------------|
| `POST` | `/api/generate-addon`    | Generates a complete addon project (files, simulated controls, and marketplace info).      |
| `POST` | `/api/enhance-prompt`    | Turns an artist's idea into a technical specification for the generation prompt.           |
| `POST` | `/api/marketplace-copy`  | Generates an extended Markdown sales page for Gumroad / BlenderMarket.                     |
| `GET`  | `*`                      | SPA: serves `index.html` / assets (Vite middleware in dev, static files in production).    |

All responses include fallbacks: if no `GEMINI_API_KEY` is set or generation fails, built-in templates are returned with `success: true`.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))
- A **Google Gemini API** key for AI generation (optional: without it, the app works with fallback templates).

## 🚀 Installation and running

```bash
# 1. Install dependencies
npm install          # or: bun install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set GEMINI_API_KEY (and APP_URL if applicable)

# 3. Development (Express + Vite middleware, port 3000 by default)
npm run dev          # or: bun run dev

# 4. Production
npm run build        # Compiles the frontend into dist/
NODE_ENV=production npm start   # Express serves the static assets from dist/
```

### Available scripts

| Script            | Description                                        |
|-------------------|----------------------------------------------------|
| `npm run dev`     | Starts the development server (`tsx server.ts`)    |
| `npm run build`   | Builds the frontend with Vite                      |
| `npm run start`   | Starts the server                                  |
| `npm run preview` | Previews the production build                      |
| `npm run lint`    | Type checking (`tsc --noEmit`)                     |
| `npm run clean`   | Removes `dist/` and build artifacts                |

---

## 🔐 Environment variables

| Variable         | Required | Description                                                                                                |
|------------------|----------|------------------------------------------------------------------------------------------------------------|
| `GEMINI_API_KEY` | Yes*     | Google Gemini API key for AI calls (*if not set, fallback templates are used)                              |
| `APP_URL`        | No       | URL where the app is hosted (self-referential links, callbacks, endpoints)                                 |
| `PORT`           | No       | Express server port (defaults to `3000`)                                                                   |
| `DISABLE_HMR`    | No       | Disables Vite HMR/watching (AI Studio environments)                                                        |

> In **Google AI Studio**, `GEMINI_API_KEY` and `APP_URL` are automatically injected at runtime from the *Secrets* panel.

---

## 🛠️ Tech stack

- **React 19** + **TypeScript** — UI and typing
- **Vite 8** — Build tooling and dev server
- **Tailwind CSS 4** — Styling
- **Express 4** — Backend and secure proxy for the Gemini API
- **@google/genai** — Gemini SDK (structured JSON output)
- **JSZip** — Client-side ZIP packaging
- **motion** and **lucide-react** — Animations and iconography

---

## 📄 License

Private project generated with Google AI Studio (`SPDX-License-Identifier: Apache-2.0` in the `src/` sources). Generated addons are the property of the user who creates them.
