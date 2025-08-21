import { forwardRef, useState, useRef, useEffect } from "react";
import type { HTMLAttributes } from "react";
import type { Character } from "@/types/character";
import { AvatarChangeModal } from "@/components/features";
import { TextInput } from "@/components/ui";

interface HeroProps extends HTMLAttributes<HTMLDivElement> {
  character: Character;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onCharacterChange?: (character: Character) => void;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ character, size = "md", className = "", editable = false, onCharacterChange, ...props }, ref) => {
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(character.name);
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
      if (nameValue.trim() && nameValue.trim() !== character.name && onCharacterChange) {
        onCharacterChange({
          ...character,
          name: nameValue.trim()
        });
      }
      setIsEditingName(false);
    };

    const handleNameCancel = () => {
      setNameValue(character.name);
      setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNameSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleNameCancel();
      }
    };

    // Clean, simple container styles
    const containerClasses = [
      "bg-gradient-to-br from-amber-400 to-amber-500",
      "border-2 border-amber-600 rounded-xl",
      "shadow-[0_6px_0_0_#b45309]",
      "transition-all duration-150",
      "text-zinc-900",
      currentSize.container,
      className,
    ].join(" ");

    // Simple avatar container styles
    const avatarContainerClasses = [
      "bg-zinc-800 border-2 border-zinc-700 rounded-full",
      "shadow-[0_4px_0_0_#3f3f46]",
      "flex items-center justify-center overflow-hidden",
      "flex-shrink-0",
      currentSize.avatar,
    ].join(" ");

    return (
      <>
        <div
          ref={ref}
          className={containerClasses}
          role="banner"
          aria-labelledby="hero-character-name"
          {...props}
        >
          <div className={`flex items-center ${currentSize.gap}`}>
            {/* Avatar with edit functionality */}
            <div className="relative group">
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
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                     onClick={() => setIsAvatarModalOpen(true)}
                     role="button"
                     tabIndex={0}
                     aria-label="Change avatar"
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         setIsAvatarModalOpen(true);
                       }
                     }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Character Info - removed description */}
            <div className="flex-1 min-w-0">
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
                <div className={`group flex items-center gap-2 ${editable && onCharacterChange ? 'cursor-pointer' : ''}`}>
                  <h1
                    id="hero-character-name"
                    className={`font-bold text-zinc-900 break-words ${currentSize.name} ${
                      editable && onCharacterChange 
                        ? 'focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-400 rounded-sm' 
                        : ''
                    }`}
                    onClick={handleNameClick}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && editable && onCharacterChange) {
                        e.preventDefault();
                        handleNameClick();
                      }
                    }}
                    tabIndex={editable && onCharacterChange ? 0 : undefined}
                    role={editable && onCharacterChange ? "button" : undefined}
                    aria-label={editable && onCharacterChange ? "Click to edit character name" : undefined}
                  >
                    {character.name}
                  </h1>
                  
                  {/* Edit icon - shows on hover when editable */}
                  {editable && onCharacterChange && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-zinc-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
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
      </>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;