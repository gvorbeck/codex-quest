import { forwardRef, useState, useRef, useEffect } from "react";
import type { HTMLAttributes } from "react";
import type { Game } from "@/types/game";
import { TextInput } from "@/components/ui/inputs";
import { Details, Icon } from "@/components/ui/display";

interface GameHeroProps extends HTMLAttributes<HTMLDivElement> {
  game: Game;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onGameChange?: (game: Game) => void;
}

const GameHero = forwardRef<HTMLDivElement, GameHeroProps>(
  (
    {
      game,
      size = "md",
      className = "",
      editable = false,
      onGameChange,
      ...props
    },
    ref
  ) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(game.name);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const sizeStyles = {
      sm: {
        container: "p-4",
        gap: "gap-4",
        avatar: "w-16 h-16",
        name: "text-2xl",
        desc: "text-sm",
        avatarText: "text-lg",
      },
      md: {
        container: "p-6",
        gap: "gap-6",
        avatar: "w-24 h-24",
        name: "text-3xl",
        desc: "text-base",
        avatarText: "text-2xl",
      },
      lg: {
        container: "p-8",
        gap: "gap-8",
        avatar: "w-32 h-32",
        name: "text-4xl",
        desc: "text-lg",
        avatarText: "text-4xl",
      },
    };

    const currentSize = sizeStyles[size];

    // Update local name value when game prop changes
    useEffect(() => {
      setNameValue(game.name);
    }, [game.name]);

    // Focus input when entering edit mode
    useEffect(() => {
      if (isEditingName && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    }, [isEditingName]);

    const handleNameClick = () => {
      if (editable && onGameChange && !isEditingName) {
        setIsEditingName(true);
      }
    };

    const handleNameChange = (newName: string) => {
      setNameValue(newName);
    };

    const handleNameSubmit = () => {
      if (nameValue.trim() && nameValue.trim() !== game.name && onGameChange) {
        onGameChange({
          ...game,
          name: nameValue.trim(),
        });
      }
      setIsEditingName(false);
    };

    const handleNameCancel = () => {
      setNameValue(game.name);
      setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleNameSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleNameCancel();
      }
    };

    // Game-themed container styles (using different colors than character sheet)
    const containerClasses = [
      "bg-gradient-to-br from-lime-400 to-lime-500",
      "border-2 border-lime-600 rounded-xl",
      "shadow-[0_6px_0_0_#365314]",
      "transition-all duration-150",
      "text-zinc-900",
      currentSize.container,
      className,
    ].join(" ");

    // Game icon container styles
    const iconContainerClasses = [
      "bg-zinc-800 border-2 border-zinc-700 rounded-full",
      "shadow-[0_4px_0_0_#3f3f46]",
      "flex items-center justify-center overflow-hidden",
      "flex-shrink-0",
      currentSize.avatar,
    ].join(" ");

    const playerCount = game.players?.length || 0;

    return (
      <>
        <div
          ref={ref}
          className={`${containerClasses} relative`}
          role="banner"
          aria-labelledby="hero-game-name"
          {...props}
        >
          <div className={`flex items-start ${currentSize.gap}`}>
            {/* Game Icon */}
            <div className="relative group">
              <div className={iconContainerClasses} aria-hidden="true">
                <Icon
                  name="dice"
                  size={size === "sm" ? "lg" : size === "lg" ? "xl" : "xl"}
                  className="text-lime-300"
                  aria-hidden={true}
                />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="space-y-2" onKeyDown={handleNameKeyDown}>
                  <TextInput
                    ref={nameInputRef}
                    value={nameValue}
                    onChange={handleNameChange}
                    onBlur={handleNameSubmit}
                    maxLength={100}
                    size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
                    className="font-bold"
                    aria-label="Edit game name"
                  />
                  <div className="text-xs text-zinc-700 flex gap-2">
                    <span>Press Enter to save, Escape to cancel</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`group flex items-center gap-2 pr-12 ${
                    editable && onGameChange ? "cursor-pointer" : ""
                  }`}
                >
                  <h1
                    id="hero-game-name"
                    className={`font-bold text-zinc-900 break-words ${
                      currentSize.name
                    } ${
                      editable && onGameChange
                        ? "focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-offset-2 focus:ring-offset-lime-400 rounded-sm"
                        : ""
                    }`}
                    onClick={handleNameClick}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        editable &&
                        onGameChange
                      ) {
                        e.preventDefault();
                        handleNameClick();
                      }
                    }}
                    tabIndex={editable && onGameChange ? 0 : undefined}
                    role={editable && onGameChange ? "button" : undefined}
                    aria-label={
                      editable && onGameChange
                        ? "Click to edit game name"
                        : undefined
                    }
                  >
                    {game.name}
                  </h1>

                  {/* Edit icon - shows on hover when editable */}
                  {editable && onGameChange && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Icon
                        name="edit"
                        size="md"
                        className="text-zinc-700"
                        aria-hidden={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Game Details */}
              <div className="mt-4">
                <Details
                  layout="horizontal"
                  className="bg-zinc-800/50 border-zinc-700/ p-2 rounded-lg"
                  items={[
                    {
                      label: "Players",
                      children: (
                        <span className="text-zinc-100 font-medium">
                          {playerCount}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

GameHero.displayName = "GameHero";

export default GameHero;
