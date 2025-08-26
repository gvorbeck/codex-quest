/**
 * Design constants for GameSheet component
 */
export const GAME_SHEET_STYLES = {
  spacing: {
    section: 'mb-8',
    element: 'mb-4', 
    content: 'space-y-6',
    cardGap: 'gap-4',
    innerSpacing: 'space-y-2',
  },
  layout: {
    cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    statusMessage: 'status-message',
    centeredContent: 'text-center py-12',
  },
  colors: {
    card: 'bg-zinc-800 border border-zinc-700 rounded-lg',
    text: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-400',
      error: 'text-red-400',
      loading: 'text-zinc-400',
    },
  },
  accessibility: {
    skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-400 text-zinc-900 px-4 py-2 rounded',
  },
} as const;

/**
 * Error message constants for consistent UX
 */
export const ERROR_MESSAGES = {
  gameNotFound: 'Game not found',
  loadError: 'Failed to load game',
  updateError: 'Failed to update game. Please try again.',
  invalidUrl: 'Invalid game URL',
  permissionDenied: 'You do not have permission to edit this game',
} as const;

/**
 * Loading message constants
 */
export const LOADING_MESSAGES = {
  loadingGame: 'Loading game...',
  updatingGame: 'Updating game...',
  savingChanges: 'Saving changes...',
} as const;