<div align="center">
  <img src="./public/logo.webp" width="200" alt="Codex.Quest Logo" />
  
  # 🔥 Codex.Quest
  
  **Modern Character Creation for Basic Fantasy Role-Playing Game**
  
  [![React](https://img.shields.io/badge/React-19.1-61dafb?style=flat&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1-646cff?style=flat&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06b6d4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
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

## 🏗️ Architecture

### Frontend Stack

- **React 19** with functional components and hooks
- **TypeScript 5.9** for type-safe development
- **Vite 7.1** for fast development and optimized builds
- **TailwindCSS 4.1** with modern design tokens
- **Wouter 3.7** for lightweight client-side routing

### Backend & Services

- **Firebase 12.2** for authentication and Firestore database
- **Real-time synchronization** for multiplayer features
- **Automated data migration** for schema evolution
- **Secure user authentication** with email/password

### Data Management

- **Type-safe character schemas** with runtime validation
- **Modular game data** stored as TypeScript modules
- **Cascade validation system** for dependent field updates
- **localStorage integration** for draft characters

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/gvorbeck/codex-quest.git
cd codex-quest

# Install dependencies
npm install

# Set up Firebase environment variables
# Create .env.local with your Firebase config:
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
# VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Start development server
npm run dev
```

## 🛠️ Development

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint on TypeScript/React files     |

### Project Structure

```
src/
├── components/              # React components
│   ├── ui/                     # Design system components
│   │   ├── design-system/         # Card, Typography, Badge
│   │   ├── inputs/                # Button, Select, TextInput, etc.
│   │   ├── feedback/              # Modal, Notification, Tooltip
│   │   ├── display/               # StatCard, ItemGrid, Stepper
│   │   ├── layout/                # Accordion, Tabs, PageWrapper
│   │   └── dice/                  # Dice rolling components
│   ├── character/              # Character-specific components
│   │   ├── creation/              # Character creation wizard steps
│   │   ├── management/            # Character list and management
│   │   ├── sheet/                 # Character sheet display
│   │   └── shared/                # Shared character components
│   ├── game/                   # Game session components
│   │   ├── management/            # Game creation and listing
│   │   └── sheet/                 # Game session management
│   ├── pages/                  # Top-level page components
│   └── auth/                   # Authentication components
├── data/                    # Game data (races, classes, equipment)
├── services/                # Firebase and business logic
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
└── hooks/                   # Custom React hooks
```

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

- Use existing UI components instead of creating custom implementations
- Follow the established component structure and naming conventions
- Write TypeScript interfaces for all data structures
- Include accessibility considerations in new components
- Test responsive behavior across device sizes

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
