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

## 🛠️ Development

### Available Scripts

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start development server      |
| `npm run build`    | Build for production          |
| `npm run preview`  | Preview production build      |
| `npm run test`     | Run test suite                |
| `npm run coverage` | Generate test coverage report |
| `npm run lint`     | Run ESLint                    |
| `npm run format`   | Format code with Prettier     |
| `npm run plop`     | Generate new components       |

### Project Structure

```
src/
├── components/          # React components
│   ├── PageCharacterSheet/   # Character sheet interface
│   ├── PageNewCharacter/     # Character creation wizard
│   ├── PageGameSheet/        # GM campaign management
│   └── ...
├── data/               # Game data and rules
│   ├── classes/        # Character class definitions
│   ├── races/          # Character race definitions
│   ├── spells.json     # Complete spell database
│   └── equipment.json  # Equipment and gear data
├── hooks/              # Custom React hooks
├── store/              # State management
├── support/            # Utility functions
└── assets/             # Static assets
```

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Vitest**: Comprehensive testing framework
- **Husky**: Git hooks for quality assurance

## 🏗️ Architecture

### Frontend Architecture

- **React 18**: Modern React with hooks and context
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Ant Design**: Professional UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing

### Backend Services

- **Firebase Auth**: User authentication
- **Firestore**: NoSQL database for character and game data
- **Firebase Hosting**: Static site hosting
- **Firebase Functions**: Serverless backend logic

### State Management

- **React Context**: Global state management
- **Reducers**: Predictable state updates
- **Custom Hooks**: Reusable stateful logic

## 🚢 Deployment

The application uses GitHub Actions for continuous deployment:

1. **Push to main branch** triggers automatic deployment
2. **Build process** runs tests and creates production build
3. **Firebase deployment** updates live site
4. **Backup site** maintained for redundancy

## 🧪 Testing

Comprehensive test suite using Vitest and React Testing Library:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run coverage

# Run tests in watch mode
npm run test:watch
```

## 📄 License & Legal

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

## 📞 Support

- **Website**: [codex.quest](https://codex.quest)
- **Issues**: [GitHub Issues](https://github.com/gvorbeck/codex-quest/issues)
- **Basic Fantasy RPG**: [basicfantasy.org](https://basicfantasy.org)

## 🙏 Acknowledgments

- **Basic Fantasy RPG** community for the excellent game system
- **Open Source Contributors** who made this project possible
- **Players and Game Masters** who use and test the platform

---

<div align="center">
  <strong>Ready to embark on your next adventure?</strong><br>
  <a href="https://codex.quest">Start Creating Characters Today!</a>
</div>
