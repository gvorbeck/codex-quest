import { forwardRef, useState, useRef, useEffect } from "react";
import type { HTMLAttributes } from "react";
import type { Character } from "@/types/character";
import {
  AvatarChangeModal,
  SettingsModal,
} from "@/components/modals";
import { TextInput } from "@/components/ui/inputs";
import { Details, Icon } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";
import { cn } from "@/constants/styles";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";

interface HeroProps extends HTMLAttributes<HTMLDivElement> {
  character: Character;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onCharacterChange?: (character: Character) => void;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      character,
      size = "md",
      className = "",
      editable = false,
      onCharacterChange,
      ...props
    },
    ref
  ) => {
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(character.name);
    const nameInputRef = useRef<HTMLInputElement>(null);
    
    // Helper function to get display name for race
    const getRaceDisplayName = (): string => {
      if (character.race === "custom") {
        return character.customRace?.name || "Custom";
      }
      const race = allRaces.find((r) => r.id === character.race);
      return race?.name || character.race || "Unknown";
    };

    // Helper function to get display names for classes
    const getClassDisplayNames = (): string => {
      if (!character.class || character.class.length === 0) return "Unknown";
      
      const classNames = character.class.map((classId) => {
        // Handle custom classes
        if (classId.startsWith('custom-') && character.customClasses) {
          const customClass = character.customClasses[classId];
          return customClass?.name || "Custom Class";
        }
        
        const classData = allClasses.find((cls) => cls.id === classId);
        return classData?.name || classId;
      });
      
      return classNames.join(" / ");
    };
    const sizeStyles = {
      sm: {
        container: "p-3 sm:p-4",
        gap: "gap-3 sm:gap-4",
        avatar: "w-12 h-12 sm:w-16 sm:h-16",
        name: "text-xl sm:text-2xl",
        desc: "text-sm",
        avatarText: "text-base sm:text-lg",
      },
      md: {
        container: "p-4 sm:p-6",
        gap: "gap-4 sm:gap-6",
        avatar: "w-16 h-16 sm:w-24 sm:h-24",
        name: "text-2xl sm:text-3xl",
        desc: "text-base",
        avatarText: "text-xl sm:text-2xl",
      },
      lg: {
        container: "p-6 sm:p-8",
        gap: "gap-6 sm:gap-8",
        avatar: "w-20 h-20 sm:w-32 sm:h-32",
        name: "text-3xl sm:text-4xl",
        desc: "text-lg",
        avatarText: "text-2xl sm:text-4xl",
      },
    };

    const currentSize = sizeStyles[size];

    // Update local name value when character prop changes
    useEffect(() => {
      setNameValue(character.name);
    }, [character.name]);

    // Focus input when entering edit mode
    useEffect(() => {
      if (isEditingName && nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    }, [isEditingName]);

    const handleNameClick = () => {
      if (editable && onCharacterChange && !isEditingName) {
        setIsEditingName(true);
      }
    };

    const handleNameChange = (newName: string) => {
      setNameValue(newName);
    };

    const handleNameSubmit = () => {
      if (
        nameValue.trim() &&
        nameValue.trim() !== character.name &&
        onCharacterChange
      ) {
        onCharacterChange({
          ...character,
          name: nameValue.trim(),
        });
      }
      setIsEditingName(false);
    };

    const handleNameCancel = () => {
      setNameValue(character.name);
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

    // Clean, simple container styles
    const containerClasses = cn(
      "bg-gradient-to-br from-amber-400 to-amber-500",
      "border-2 border-amber-600 rounded-xl",
      "shadow-[0_6px_0_0_#b45309]",
      "transition-all duration-150",
      "text-zinc-900",
      currentSize.container,
      className,
    );

    // Simple avatar container styles
    const avatarContainerClasses = cn(
      "bg-zinc-800 border-2 border-zinc-700 rounded-full",
      "shadow-[0_4px_0_0_#3f3f46]",
      "flex items-center justify-center overflow-hidden",
      "flex-shrink-0",
      currentSize.avatar,
    );

    return (
      <>
        <div
          ref={ref}
          className={`${containerClasses} relative`}
          role="banner"
          aria-labelledby="hero-character-name"
          {...props}
        >
          {/* Settings Button - Top Right Corner */}
          {editable && onCharacterChange && (
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsSettingsModalOpen(true);
                }
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-6 p-1.5 sm:p-2 bg-zinc-800/80 hover:bg-zinc-700/80 focus:bg-zinc-700/80 border border-zinc-600 rounded-lg transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-amber-500"
              aria-label="Open character settings"
              title="Settings"
            >
              <Icon
                name="settings"
                size="md"
                className="text-zinc-300 group-hover:text-zinc-100 group-focus:text-zinc-100"
                aria-hidden={true}
              />
            </button>
          )}

          {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
          <div className={`flex flex-col sm:flex-row sm:items-start ${currentSize.gap}`}>
            {/* Avatar with edit functionality */}
            <div className="relative group flex-shrink-0 self-center sm:self-start">
              <div className={avatarContainerClasses} aria-hidden="true">
                {character.avatar ? (
                  <img
                    src={character.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".avatar-fallback")) {
                        const fallback = document.createElement("div");
                        fallback.className = `avatar-fallback flex items-center justify-center w-full h-full text-zinc-300 font-bold ${currentSize.avatarText}`;
                        fallback.textContent = character.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div
                    className={`text-zinc-300 font-bold ${currentSize.avatarText}`}
                    aria-hidden="true"
                  >
                    {character.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Avatar edit overlay - shows on hover when editable */}
              {editable && onCharacterChange && (
                <div
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsAvatarModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="Change avatar"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsAvatarModalOpen(true);
                    }
                  }}
                >
                  <Icon
                    name="edit"
                    size="lg"
                    className="text-white"
                    aria-hidden={true}
                  />
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {isEditingName ? (
                <div className="space-y-2" onKeyDown={handleNameKeyDown}>
                  <TextInput
                    ref={nameInputRef}
                    value={nameValue}
                    onChange={handleNameChange}
                    onBlur={handleNameSubmit}
                    maxLength={50}
                    size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
                    className="font-bold"
                    aria-label="Edit character name"
                  />
                  <div className="text-xs text-zinc-700 flex gap-2">
                    <span>Press Enter to save, Escape to cancel</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`group flex items-center justify-center sm:justify-start gap-2 pr-8 sm:pr-12 ${
                    editable && onCharacterChange ? "cursor-pointer" : ""
                  }`}
                >
                  <Typography
                    as="h1"
                    variant="h1"
                    color="primary"
                    weight="bold"
                    id="hero-character-name"
                    className={`break-words ${currentSize.name} ${
                      editable && onCharacterChange
                        ? "focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-400 rounded-sm"
                        : ""
                    }`}
                    onClick={handleNameClick}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        editable &&
                        onCharacterChange
                      ) {
                        e.preventDefault();
                        handleNameClick();
                      }
                    }}
                    tabIndex={editable && onCharacterChange ? 0 : undefined}
                    role={editable && onCharacterChange ? "button" : undefined}
                    aria-label={
                      editable && onCharacterChange
                        ? "Click to edit character name"
                        : undefined
                    }
                  >
                    {character.name}
                  </Typography>

                  {/* Edit icon - shows on hover when editable */}
                  {editable && onCharacterChange && (
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

              {/* Character Details */}
              <div className="mt-3 sm:mt-4">
                <Details
                  layout="horizontal"
                  className="bg-zinc-800/50 border-zinc-700/ p-2 rounded-lg text-sm sm:text-base"
                  items={[
                    {
                      label: "Race",
                      children: (
                        <span className="text-zinc-100 font-medium">
                          {getRaceDisplayName()}
                        </span>
                      ),
                    },
                    {
                      label: "Class",
                      children: (
                        <span className="text-zinc-100 font-medium">
                          {getClassDisplayNames()}
                        </span>
                      ),
                    },
                    {
                      label: "Level",
                      children: (
                        <span className="text-zinc-100 font-medium">
                          {character.level}
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Change Modal */}
        {editable && onCharacterChange && (
          <AvatarChangeModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            character={character}
            onCharacterChange={onCharacterChange}
          />
        )}

        {/* Settings Modal */}
        {editable && onCharacterChange && (
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            character={character}
            onCharacterChange={onCharacterChange}
          />
        )}
      </>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;
