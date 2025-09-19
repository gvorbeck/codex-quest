<div align="center">
  <img src="./public/images/logo.webp" width="200" alt="Codex.Quest Logo" />
  
  # 🔥 Codex.Quest
  
  **Modern Character Creation for Basic Fantasy Role-Playing Game**
  
  [![React](https://img.shields.io/badge/React-19.1-61dafb?style=flat&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1-646cff?style=flat&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
  [![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.x-ff6b6b?style=flat&logo=react-query)](https://tanstack.com/query)
  [![Zustand](https://img.shields.io/badge/Zustand-5.x-000000?style=flat&logo=zustand)](https://zustand-demo.pmnd.rs/)
  [![Firebase](https://img.shields.io/badge/Firebase-12.2-ffca28?style=flat&logo=firebase)](https://firebase.google.com/)
  
</div>

## 🎯 Overview

Codex.Quest is a comprehensive web-based character creation and management system for Basic Fantasy Role-Playing Game (BFRPG). Built with modern React architecture and a beautiful, accessible interface, it provides players and Game Masters with powerful tools to create, manage, and track characters throughout their adventures.

### ✨ Key Features

🧙‍♂️ **Character Creation & Management**

- Step-by-step character creation wizard with guided experience
- Complete BFRPG race and class support (Core + Supplemental)
- Intelligent cascade validation system for automatic stat updates
- Persistent character storage with Firebase integration
- Character sheet display and live editing capabilities

🎲 **Gameplay Integration**

- Comprehensive dice rolling system with modal interface
- Spell and cantrip management per class
- Equipment system with weight and currency calculations
- Experience tracking and level progression
- Combat stats and saving throws

🎮 **Game Master Tools**

- Game session creation and management
- Multi-player character linking and tracking
- Encounter management with initiative tracking
- Persistent game state across sessions

🌐 **Modern User Experience**

- Responsive design optimized for all devices
- Accessibility-first approach with WCAG 2.1 AA compliance
- Real-time data synchronization across devices
- Optimistic updates with automatic error recovery
- Intelligent background data fetching and caching

## 🏗️ Architecture

### Frontend Stack

- **React 19** with functional components and hooks
- **TypeScript 5.9** for type-safe development
- **Vite 7.1** for fast development and optimized builds
- **TailwindCSS 4.1** with modern design tokens
- **Wouter 3.7** for lightweight client-side routing
- **TanStack Query 5.x** for server state management and caching
- **Zustand 5.x** for client-side state management with persistence

### Backend & Services

- **Firebase 12.2** for authentication and Firestore database
- **Real-time synchronization** for multiplayer features
- **Automated data migration** for schema evolution
- **Secure user authentication** with email/password

### State Management & Data

- **Unified state architecture** with TanStack Query (server state) + Zustand (client state)
- **Intelligent caching** with automatic background updates and optimistic mutations
- **Type-safe character schemas** with runtime validation and automatic migration
- **Modular game data** stored as TypeScript modules with centralized query keys
- **Cascade validation system** for dependent field updates
- **Persistent client state** with automatic draft management and preference storage

#### Modern Architecture Highlights

🚀 **TanStack Query Integration**

- Smart server state caching with configurable stale times
- Automatic background refetching and error retry logic
- Optimistic updates for seamless user experience
- Type-safe query key factory for consistency

⚡ **Zustand State Management**

- Lightweight client-side state with persistence middleware
- Separate stores for different concerns (characters, combat, UI)
- Automatic localStorage synchronization for drafts and preferences
- Zero boilerplate with excellent TypeScript support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Quick Start (Mock Mode)

**Perfect for contributors and trying out the app:**

```bash
# Clone the repository
git clone https://github.com/gvorbeck/codex-quest.git
cd codex-quest

# Install dependencies
npm install

# Start development server (auto-detects mock mode)
npm run dev
```

🎉 **That's it!** The app automatically detects missing Firebase credentials and runs in mock mode with sample data.

### Production Installation

**For production deployment with Firebase:**

```bash
# Follow the steps above, then create .env.local with your Firebase config:
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
# VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Build for production
npm run build
```

## 🛠️ Development

### Available Scripts

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start development server in **mock mode**      |
| `npm run dev:firebase` | Start development server with Firebase      |
| `npm run build`      | Build for production (TypeScript + Vite)      |
| `npm run preview`    | Preview production build locally              |
| `npm run lint`       | Run ESLint on TypeScript/React files          |

## 🎭 Mock Mode for Contributors

Codex.Quest features an intelligent mock mode that **automatically activates** when Firebase credentials aren't available. This provides a **zero-setup experience** for contributors and demos.

### 🚀 Auto-Detection Features

- **Instant Setup**: Works immediately without any configuration
- **Rich Sample Data**: 5 pre-built characters and 5 game sessions showcase all features
- **Full Functionality**: Character creation, editing, game management - everything works
- **Persistent Storage**: Data survives browser refresh using localStorage
- **Safe Environment**: Can't accidentally touch production data
- **Visual Indicators**: Header shows "Codex.Mock", orange favicon, reset button

### 🎮 Sample Data Included

**Characters:**
- **Thorin Ironforge** - Human Fighter (tank build)
- **Elara Moonwhisper** - Elf Magic-User (spellcaster)
- **Pip Lightfinger** - Halfling Thief (stealth specialist)
- **Brother Marcus** - Dwarf Cleric (support character)
- **Gareth the Versatile** - Multi-class Fighter/Thief

**Game Sessions:**
- **The Tavern Mystery** - Classic murder mystery investigation
- **Ruins of the Ancient Temple** - Dungeon crawl with undead
- **Journey to Dragonspear Castle** - Wilderness adventure
- **Conspiracy in Waterdeep** - Urban political intrigue
- **New Campaign** - Empty session ready for customization

### 🛠️ Development Utilities

When in mock mode, additional debugging tools are available:

#### UI Reset Button
- **Reset Sample Data** button appears in the header (orange button next to "Codex.Mock")
- Instantly resets all data back to original sample characters and games
- Reloads the page automatically to show fresh data

#### Console Commands
```javascript
// Available in browser console as window.devUtils
devUtils.resetAllData()          // Reset to sample data
devUtils.clearAllData()          // Clear all data
devUtils.signInAsUser(userData)  // Test different users
devUtils.exportCharacterData()   // Export for debugging
devUtils.exportGameData()        // Export game data
```

### ⚡ Manual Mock Mode

Force mock mode even with Firebase credentials:

```bash
VITE_MOCK_FIREBASE=true npm run dev
```

### 🧪 Testing Mock Mode

To test the mock mode implementation:

```bash
# Start in mock mode (auto-detects if no Firebase config)
npm run dev

# Or force mock mode explicitly
VITE_MOCK_FIREBASE=true npm run dev

# Then visit: http://localhost:5173 (or whatever port is shown)
```

The app will automatically populate with sample characters and games that you can interact with immediately.

## 🧪 Testing

We use a comprehensive two-layer testing approach for quality assurance:

**📚 [Complete Testing Guide → TEST_PLAN.md](./TEST_PLAN.md)**

### Quick Testing Commands

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run test`          | Unit tests (watch mode) - run while coding    |
| `npm run test:ui`       | Unit tests with beautiful visual interface ✨ |
| `npm run test:run`      | Unit tests (run once) - for CI/commits        |
| `npm run test:coverage` | Show code coverage gaps                       |
| `npm run test:e2e`      | End-to-end tests (headless)                   |
| `npm run test:e2e:ui`   | E2E tests with visual debugging ✨            |

### Testing Architecture

- **⚡ Unit Tests (Vitest)**: Fast feedback for individual functions and components
- **🌐 E2E Tests (Playwright)**: Complete user workflow validation across browsers
- **🎯 Visual Interfaces**: Beautiful web dashboards for both testing layers
- **📊 Coverage Reports**: Track which code needs more testing

**For detailed explanations of each command and when to use them, see [TEST_PLAN.md](./TEST_PLAN.md)**

## 📱 Accessibility Features

- **WCAG 2.1 AA compliance** target
- **Screen reader support** with proper ARIA labels
- **Keyboard navigation** throughout the application
- **Skip links** and semantic HTML structure
- **High contrast support** and readable typography
- **Responsive design** for all device types

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch for your changes
3. Follow the existing code style and component patterns
4. Ensure all and linting is clean
5. Submit a pull request with a clear description

### Development Guidelines

📚 **[Read our comprehensive Style Guide](./src/components/STYLE_GUIDE.md)** for detailed development patterns, TypeScript best practices, performance optimization, and component architecture.

- Use existing UI components instead of creating custom implementations
- Follow the established component structure and naming conventions
- Write TypeScript interfaces for all data structures
- Include accessibility considerations in new components
- Test responsive behavior across device sizes

#### State Management Patterns

- **Server State**: Use TanStack Query hooks (`useCharacters`, `useCharacterSheet`, `useGame`)
- **Client State**: Use appropriate Zustand store (`characterStore`, `combatStore`, `uiStore`)
- **Query Keys**: Always use the centralized `queryKeys` factory for consistency
- **Mutations**: Implement optimistic updates with proper error rollback
- **Persistence**: Leverage Zustand persistence middleware for client preferences

## 📄 License

This project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)

## 🙏 Acknowledgments

- **Basic Fantasy RPG** community for the excellent open-source game system

---

<div align="center">
  <strong>Ready to create your next character?</strong><br>
  <em>Light up your adventures with codex.quest!</em> 🔥
</div>
