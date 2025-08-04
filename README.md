[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

<div align="center">
  <img src="https://github.com/gvorbeck/codex-quest/blob/main/src/assets/images/dragon-head.webp" width="200" alt="CODEX.QUEST Logo" />
  
  # CODEX.QUEST
  **The Ultimate Digital Companion for Basic Fantasy Role-Playing Game**
  
  [![Live Site](https://img.shields.io/badge/Live%20Site-codex.quest-blue)](https://codex.quest)
  [![Backup Site](https://img.shields.io/badge/Backup-Firebase-orange)](https://codex-quest.firebaseapp.com/)
  [![BFRPG Edition](https://img.shields.io/badge/BFRPG-4th%20Edition-red)](https://basicfantasy.org)
</div>

## 🎯 Overview

CODEX.QUEST is a comprehensive web-based character management system designed specifically for Basic Fantasy Role-Playing Game (BFRPG). This platform provides players and Game Masters with intuitive tools to create, manage, and share characters while offering robust gameplay support features.

### ✨ Key Features

#### 🧙‍♂️ **Character Management**

- **Guided Character Creation**: Step-by-step wizard for creating BFRPG characters
- **Complete Rule Support**: All official races, classes, spells, and equipment
- **Supplemental Content**: Support for Rangers, Paladins, Scouts, Spellcrafters, Assassins, and more
- **Custom Content**: Create custom races, classes, and equipment
- **Digital Character Sheets**: Interactive, auto-calculating character sheets
- **Character Progression**: Level-up system with automatic stat calculations

#### 🎲 **Gameplay Tools**

- **Virtual Dice Roller**: Integrated dice rolling for all game mechanics
- **Combat Tracker**: Initiative and round management system
- **Spell Management**: Complete spell lists with descriptions and casting tools
- **Equipment System**: Comprehensive gear management with weight calculations
- **Experience Tracking**: XP management and level progression

#### 🎮 **Game Master Features**

- **Campaign Management**: Create and manage game sessions
- **Player Character Monitoring**: View and track all player characters
- **Random Generators**: Encounter and treasure generation tools
- **Monster Database**: Complete bestiary with combat stats
- **GM Notes**: Campaign note-taking and organization

#### 🌐 **Social & Sharing**

- **Character Sharing**: Unique URLs for each character
- **Multi-Player Support**: Add characters to campaigns via URL sharing
- **Cross-Platform Access**: Play anywhere with web browser access
- **Real-time Updates**: Live character and campaign synchronization

#### 🎨 **User Experience**

- **Modern UI Design**: Clean, intuitive interface with custom theming
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Custom Animations**: Smooth transitions and loading states
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🛠️ Development

### Available Scripts

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start development server          |
| `npm run build`    | Build for production              |
| `npm run preview`  | Preview production build          |
| `npm run test`     | Run test suite                    |
| `npm run coverage` | Generate test coverage report     |
| `npm run lint`     | Run ESLint                        |
| `npm run format`   | Format code with Prettier         |
| `npm run plop`     | Generate new components           |
| `npm run host`     | Start dev server with host access |
| `npm run prepare`  | Set up Husky git hooks            |

### Project Structure

```
src/
├── components/              # React components
│   ├── PageCharacterSheet/      # Character sheet interface
│   ├── PageNewCharacter/        # Character creation wizard
│   ├── PageGameSheet/           # GM campaign management
│   ├── PageHome/                # User dashboard
│   ├── PageSources/             # Data sources and references
│   ├── ModalContainer/          # Reusable modal wrapper
│   ├── AvatarPicker/            # Character avatar selection
│   ├── ThemeSwitcher/           # Light/dark theme toggle
│   └── ...                      # Additional UI components
├── data/                    # Game data and rules
│   ├── classes/                 # Character class definitions
│   ├── races/                   # Character race definitions
│   ├── spells.json              # Complete spell database
│   └── equipment.json           # Equipment and gear data
├── hooks/                   # Custom React hooks
├── store/                   # State management
├── support/                 # Utility functions
│   ├── theme.ts                 # Ant Design theme configuration
│   ├── darkTheme.ts             # Dark mode theme
│   ├── characterSupport.ts      # Character logic
│   └── ...                      # Additional utilities
├── assets/                  # Static assets
│   ├── images/                  # Images and graphics
│   ├── svg/                     # SVG components
│   └── fonts/                   # Custom fonts
└── types/                   # TypeScript type definitions
```

### Code Quality & Development Workflow

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Vitest**: Comprehensive testing framework with coverage reporting
- **Husky**: Git hooks for automated quality assurance
- **Lint-staged**: Run linting and formatting on staged files only
- **Pre-commit Hooks**: Automated build, test, and lint checks before commits
- **Plop**: Component generation for consistent code structure
- **Modern Normalize**: CSS normalization for cross-browser consistency

## 🏗️ Architecture

### Frontend Architecture

- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server with SWC compiler
- **Ant Design 5.21+**: Professional UI component library
- **Tailwind CSS v4**: Utility-first CSS framework with modern config
- **Wouter**: Lightweight client-side routing
- **React Responsive**: Device detection and responsive design

### Backend Services

- **Firebase Auth**: User authentication and session management
- **Firestore**: NoSQL database for character and game data
- **Firebase Storage**: Cloud storage for character avatars and assets
- **Firebase Hosting**: Static site hosting with CDN
- **Firebase Functions**: Serverless backend logic (TypeScript)
- **Real-time Database**: Live synchronization for multiplayer features

### State Management

- **React Context**: Global state management for user and game data
- **Reducers**: Predictable state updates for complex character data
- **Custom Hooks**: Reusable stateful logic for responsive design and device detection
- **Local Storage**: Persistence for user preferences and temporary data

### Technical Specifications

- **Current Version**: 2.13.5
- **BFRPG Edition**: 4th Edition (Release 137)
- **Build Tool**: Vite 5.4+ with SWC compiler
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Browser Support**: Modern browsers with ES2020+ support
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Performance**: Lazy loading, image optimization, and asset bundling

## 🚢 Deployment

The application uses automated deployment with quality assurance:

### Continuous Integration

- **Husky Pre-commit Hooks**: Automated build, test, and lint checks
- **Lint-staged**: Code formatting and linting on staged files
- **GitHub Actions**: Continuous deployment pipeline

### Deployment Process

1. **Pre-commit Validation** ensures code quality before commits
2. **Push to main branch** triggers automatic deployment
3. **Build process** runs tests and creates production build
4. **Firebase deployment** updates live site
5. **Backup site** maintained for redundancy

### Quality Gates

- TypeScript compilation must pass
- All tests must pass
- ESLint rules must be satisfied
- Code must be properly formatted

## 🧪 Testing

Comprehensive test suite using modern testing tools:

### Testing Stack

- **Vitest**: Fast unit test runner with native TypeScript support
- **React Testing Library**: Component testing utilities
- **JSDOM**: Browser environment simulation
- **Coverage Reports**: Detailed code coverage analysis

### Available Test Commands

```bash
# Run tests in watch mode
npm run test

# Generate coverage report with UI
npm run coverage

# Run tests once (used in CI/CD)
npm run test -- run
```

### Test Configuration

- **Environment**: JSDOM for browser API simulation
- **Setup Files**: Custom test utilities and mocks
- **Coverage Provider**: V8 for accurate coverage reporting
- **Reporters**: Text, JSON, and HTML coverage reports

## 📄 License & Legal

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

## 📞 Support

- **Website**: [codex.quest](https://codex.quest)
- **Issues**: [GitHub Issues](https://github.com/gvorbeck/codex-quest/issues)
- **Basic Fantasy RPG**: [basicfantasy.org](https://basicfantasy.org)

## 🙏 Acknowledgments

- **Basic Fantasy RPG** community for the excellent open-source game system
- **Open Source Contributors** who made this project possible through their amazing libraries
- **Players and Game Masters** who use, test, and provide feedback on the platform
- **Firebase Team** for providing robust backend infrastructure
- **Ant Design Team** for the comprehensive component library
- **Vite and SWC Teams** for blazing-fast development tools

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Modern web browser

### Local Development

```bash
# Clone the repository
git clone https://github.com/gvorbeck/codex-quest.git

# Navigate to the project directory
cd codex-quest

# Install dependencies
npm install

# Set up environment variables (create .env file)
# See .env.example for required variables

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

<div align="center">
  <strong>Ready to embark on your next adventure?</strong><br>
  <a href="https://codex.quest">Start Creating Characters Today!</a>
</div>
