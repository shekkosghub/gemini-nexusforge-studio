# NexusForge Creative Studio — AI Addon & Creative Asset Engine

NexusForge is a specialized workbench that empowers 3D artists, technical directors, and digital illustrators to generate, test, package, and monetize high-demand addons and creative assets for Blender, ZBrush, Procreate, and Photoshop using an intelligent AI copilot.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during initial clarification and guide the entire system architecture:

- **Confirmed Platforms**: Multi-platform creative ecosystem covering **Blender** (Python addons, UI panels, operators, geometry node setups), **ZBrush** (ZScripts, macro brushes, automation plugins), **Procreate** (custom brush dynamics, dual-brush configurations, color swatches), and **Photoshop** (JSX ExtendScript, UXP plugins, action scripts).
- **Confirmed Resource Scope**: Full creative suite supporting Python automation scripts, modal operators, custom N-panel UIs, procedural shader recipes, brush dynamics configuration, and palette stamps.
- **Confirmed Tooling Suite**: Integrated multi-tab code & configuration editor, interactive software simulator/previewer, one-click ZIP packager (with platform-compliant directory structures and installation guides), and an automated marketplace copy generator for Gumroad, BlenderMarket, and ArtStation.

---

### 1. Overview & Core Concept

- **What It Does**: NexusForge bridges the gap between creative ideas and technical implementation. Non-coders and seasoned artists describe a workflow bottleneck (e.g., *"A Blender addon that auto-unwraps hard-surface seams and creates light-baking cages"* or *"A ZBrush ZScript that decimates subtools in batch while preserving polypaint"* or *"A dual-texture painterly oil brush set for Procreate"*), and the AI Agent designs the complete resource architecture: code files, UI panels, hotkeys, metadata manifest, documentation, and marketplace pitch.
- **Target Audience / Persona**: 
  - 3D modelers & environment artists looking to monetize custom workflow shortcuts on BlenderMarket and Gumroad.
  - Concept artists and digital painters building specialized brush kits and tool presets.
  - Studio technical artists prototyping pipeline utilities without spending days writing boilerplate API code.
- **Key Value**: Capitalizes on the "silent giant" of creative tooling marketplaces where demand is concentrated and high-utility scripts command premium pricing ($15–$75+ per pack).

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Studio Canvas & Template Browser**: The user lands on the workbench with immediate access to quick-start prompts (e.g., *Blender Batch Retopo Helper*, *ZBrush Subtool Renamer & Exporter*, *Procreate Concept Gouache Set*, *Photoshop Smart Layer Slicer*) or an AI prompt input.
2. **AI Agent Generation & Co-Pilot Chat**: The user specifies requirements or tweaks parameters (Platform, Resource Type, Target Version, Complexity). The agent streams code, explains API hooks (e.g., `bpy.types.Operator`, `[IButton,...]`, `brush.json`), and sets up error handling.
3. **Multi-File Code Sandbox**: An interactive dark-mode code viewer with line numbers, copy, syntax highlighting, diff inspect, and multi-file tabs (`__init__.py`, `operators.py`, `ui_panel.py`, `README.md`, `LICENSE`).
4. **Interactive Software Previewer**: A simulated viewport reflecting how the addon or resource behaves:
   - For *Blender*: Interactive simulated 3D viewport with an interactive N-Panel showing the generated buttons and real-time execution feedback.
   - For *ZBrush*: Simulated canvas with shelf palette and shelf button activation.
   - For *Procreate*: Interactive pressure/tilt brush stroke canvas allowing live drawing with generated brush parameters.
   - For *Photoshop*: Simulated layer stack and script action runner.
5. **Marketplace Kit Generator**: Generates high-converting marketing materials with pricing recommendations, headline formulas, feature breakdown, installation instructions, and FAQ.
6. **Export & Bundle**: One-click download of a production-ready `.zip` file with proper directory layout, manifests, and auto-install instructions ready to load directly into Blender Preferences, ZBrush ZScripts, or Procreate import.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-density creative workstation inspired by Blender 4.x and modern technical creative suites: dark titanium surfaces, subtle hairline borders, crisp typography, and restrained electric amber/emerald accents.
- **Color Palette**:
  - Neutral Canvas: `#0F1117` (Deep graphite workstation background)
  - Structural Surfaces: `#181B24` (Panels, sidebars, header), `#212634` (Editor tabs & card surfaces)
  - Hairline Borders: `#2B3142` (Subtle 1px boundaries)
  - Primary Accent: `#F97316` (Blender orange) & `#3B82F6` (Creative blue)
  - Status Accents: `#10B981` (Nominal / Verified code), `#EAB308` (API Warning)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` (Crisp geometric sans)
  - Workstation Labels & Prose: `DM Sans` / `Manrope` (Optimal legibility at compact scales)
  - Code & Telemetry: `JetBrains Mono` with `tabular-nums`
- **Component Styling & Layout**:
  - Full-width 1440px viewport presence.
  - Three-zone top navigation strictly respecting the Top Bar Contract (Wordmark · Platform Nav · Primary "Export Bundle" Action).
  - Left panel: Agent chat, template library, and resource configuration.
  - Center/Right panel: Code workspace with live interactive simulator toggle and marketplace kit tabs.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Server with `@google/genai` Backend Proxy**
  - *Chosen Approach*: Route all Gemini AI generation requests through Express API endpoints (`/api/generate-addon`, `/api/enhance-prompt`, `/api/marketplace-copy`) using `gemini-3.8-flash`.
  - *Why*: Strict compliance with zero-client-key exposure and streaming capabilities. Ensures reliable structured JSON output schemas for multi-file code generation.
  - *Alternative Considered*: Client-side generation (rejected: insecure and forbidden by system instructions).

- **Decision 2: Interactive In-Browser Software Simulators vs. Static Code Display**
  - *Chosen Approach*: Build interactive visual simulation sandboxes (e.g. interactive 3D viewport canvas for Blender, interactive stroke testing canvas for Procreate, interactive subtool tree for ZBrush) alongside the code view.
  - *Why*: Creators need immediate visual validation that their addon buttons work, trigger actions, and feel right before installing into production software.

- **Decision 3: Client-Side ZIP Packaging (`jszip`)**
  - *Chosen Approach*: Generate and pack multi-file archives directly in the browser with platform-standard folder structures (e.g., `addon_name/__init__.py`, `manifest.json`, `README.md`).
  - *Why*: Instant downloads without server-side storage overhead or privacy concerns.

- **Decision 4: Curated High-Yield Resource Templates**
  - *Chosen Approach*: Provide ready-to-remix templates based on real top-selling categories (Batch Mesh Cleaners, Procedural Cable Routers, Stylized Hair Curve Brushes, ZBrush Hard-Surface Inset Brushes).
  - *Why*: Users can immediately test and explore without starting from a blank prompt.

---

### 4. Technical Architecture & Data Strategy (Technical Reference)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      NexusForge Creative Studio                        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────┐           ┌────────────────────────────────┐
│   Agent & Config Workbench    │           │    Code & Simulation Studio    │
│  - Platform Selector (Blender/│           │  - Multi-file Tabbed Editor    │
│    ZBrush/Procreate/PS)       │           │  - Syntax Highlighting         │
│  - Resource Type & Engine Ver │           │  - Interactive Viewport Sim    │
│  - Prompt & AI Assist Panel   │           │  - Marketplace Copy Generator  │
│  - Starter Preset Library     │           │  - One-Click ZIP Packager      │
└──────────────┬────────────────┘           └────────────────┬───────────────┘
               │                                             │
               ▼                                             │
┌───────────────────────────────┐                            │
│  Express Backend API Proxy    │                            │
│  - POST /api/generate-addon   │                            │
│  - POST /api/marketplace-copy │                            │
│  - Using @google/genai SDK    │                            │
│  - Model: gemini-3.8-flash    │                            │
└──────────────┬────────────────┘                            │
               │                                             │
               ▼                                             ▼
┌───────────────────────────────┐           ┌────────────────────────────────┐
│   Gemini 3.8 Flash Backend    │           │   Production ZIP Generator     │
│   (Generates Structured Code  │           │   (Client-side JSZip archive   │
│    & Validated Addon Specs)   │           │    with Readme & Install Docs) │
└───────────────────────────────┘           └────────────────────────────────┘
```

#### Data Model & State
- `AddonProject`: Current project model containing `id`, `name`, `platform`, `resourceType`, `version`, `description`, `files` (array of `{ filename, code, language, description }`), `marketplaceInfo` (title, price, taglines, features, installationGuide, tags), and `status`.
- `PlatformConfig`: Metadata for Blender (`bl_info` spec, minimum version e.g. 4.2+, operator categories), ZBrush (ZScript format, command palettes), Procreate (brush dynamics, grain, dynamics properties), Photoshop (UXP manifest / JSX).
- `SimulationState`: Simulated interactive parameters (active objects, mesh polycount, active subtools, brush stroke history, active panel values).

#### Interactive Component & State Mapping
- `HeaderBar`: Brand wordmark, platform switcher tabs, direct "Download Addon ZIP" action.
- `PromptStudio`: Natural language prompt editor with AI prompt enhancer, template selector, and platform-specific feature toggles.
- `CodeViewer`: Multi-file tabs, one-click copy, download single file, line counts, syntax highlight formatting.
- `ViewportSimulator`:
  - *Blender*: Interactive 3D scene preview (interactive turntable box/torus), customizable N-Panel with real reactive controls that execute and log results.
  - *Procreate*: Canvas stroke simulator with pressure slider, smoothing, and live paint dynamics.
  - *ZBrush*: Subtool list manager and one-click macro execution log.
- `MarketplaceStudio`: Interactive copy editor with live preview of Gumroad/BlenderMarket product cards, markdown exporter, and pricing recommendation calculator.
