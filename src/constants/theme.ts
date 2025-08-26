// Theme constants for consistent styling across components

export const CARD_DECORATION_SIZES = {
  large: 'w-24 h-24',
  medium: 'w-16 h-16'
} as const;

export const BASE_CARD_STYLES = {
  base: 'group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 border-2 border-zinc-700/50 rounded-xl p-6',
  transition: 'transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1',
  overlay: 'absolute inset-0 z-10 cursor-pointer rounded-xl',
  decorationTop: 'absolute top-0 right-0 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-xl pointer-events-none',
  decorationBottom: 'absolute bottom-0 left-0 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-xl pointer-events-none',
  content: 'relative z-20 space-y-4 pointer-events-none'
} as const;