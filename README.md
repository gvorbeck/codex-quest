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
  [![Version](https://img.shields.io/badge/Version-2.13.5-green)](#)
  [![BFRPG Edition](https://img.shields.io/badge/BFRPG-4th%20Edition%20(Release%20137)-red)](https://basicfantasy.org)
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
- **Real-time Updates**: Live synchronization across devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gvorbeck/codex-quest.git
   cd codex-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with your Firebase configuration
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run plop` | Generate new components |

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

## 🎲 Game Data

CODEX.QUEST includes comprehensive data from:

### Core Rules
- **Basic Fantasy RPG Core Rules** (4th Edition, Release 137)
- All standard races: Human, Dwarf, Elf, Halfling
- All standard classes: Fighter, Magic-User, Cleric, Thief

### Supplemental Content
- **Rangers and Paladins** supplement
- **Scouts** supplement  
- **Spellcrafters** supplement
- **Assassins** supplement
- **New Races** supplement
- Complete spell database with 1000+ spells
- Comprehensive equipment catalog
- Monster database

## 📱 Features in Detail

### Character Creation Wizard
1. **Ability Score Generation**: Roll or assign ability scores
2. **Race Selection**: Choose from available races with restrictions
3. **Class Selection**: Pick class based on ability requirements
4. **Hit Point Calculation**: Roll hit points with modifiers
5. **Equipment Purchase**: Buy gear with starting gold
6. **Character Details**: Add name, avatar, and background

### Digital Character Sheet
- Auto-calculating statistics (AC, movement, attack bonuses)
- Interactive spell management with preparation tracking
- Equipment management with encumbrance calculations
- Experience point tracking and level-up assistance
- Saving throw calculators
- Special ability trackers

### Game Master Tools
- Campaign creation and player management
- Character overview dashboard
- Combat initiative tracker
- Random encounter generator
- Treasure generator
- Comprehensive spell and monster databases
- Session notes and campaign tracking

## 🚢 Deployment

The application uses GitHub Actions for continuous deployment:

1. **Push to main branch** triggers automatic deployment
2. **Build process** runs tests and creates production build
3. **Firebase deployment** updates live site
4. **Backup site** maintained for redundancy

### Manual Deployment
```bash
npm run build
firebase deploy
```

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

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

### Third-Party Content
- Basic Fantasy RPG content used under Open Game License
- Ant Design components (MIT License)
- All other dependencies as per their respective licenses

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all checks pass before submitting PR

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
