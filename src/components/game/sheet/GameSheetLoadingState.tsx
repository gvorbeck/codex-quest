import { memo } from "react";
import { GAME_SHEET_STYLES, LOADING_MESSAGES } from "@/constants/gameSheetStyles";

interface GameSheetLoadingStateProps {
  message?: string;
  isUpdating?: boolean;
}

export const GameSheetLoadingState = memo(({ 
  message = LOADING_MESSAGES.loadingGame, 
  isUpdating = false 
}: GameSheetLoadingStateProps) => (
  <div 
    className={`${GAME_SHEET_STYLES.layout.statusMessage} ${isUpdating ? 'fixed top-4 right-4 z-50' : ''}`} 
    role="status" 
    aria-live="polite"
  >
    <div className={`flex items-center gap-3 ${isUpdating ? 'bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 shadow-lg' : ''}`}>
      <div 
        className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
        aria-hidden="true"
      />
      <p className={`${GAME_SHEET_STYLES.colors.text.loading} ${isUpdating ? 'text-sm' : ''}`}>
        {message}
      </p>
    </div>
  </div>
));

GameSheetLoadingState.displayName = "GameSheetLoadingState";