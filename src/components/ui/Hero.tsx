import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import type { Character } from "@/types/character";

interface HeroProps extends HTMLAttributes<HTMLDivElement> {
  character: Character;
  size?: "sm" | "md" | "lg";
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ character, size = "md", className = "", ...props }, ref) => {
    const sizeStyles = {
      sm: {
        container: "p-4",
        avatar: "w-16 h-16",
        name: "text-xl",
        details: "text-sm",
      },
      md: {
        container: "p-6",
        avatar: "w-24 h-24",
        name: "text-2xl",
        details: "text-base",
      },
      lg: {
        container: "p-8",
        avatar: "w-32 h-32",
        name: "text-4xl",
        details: "text-lg",
      },
    };

    const currentSize = sizeStyles[size];

    // Base styles consistent with chunky 3D design
    const containerClasses = [
      "bg-gradient-to-br from-amber-400 to-amber-500",
      "border-2 border-amber-600 rounded-xl",
      "shadow-[0_6px_0_0_#b45309]", // amber-700 shadow for 3D effect
      "transform transition-all duration-150",
      "text-zinc-900",
      currentSize.container,
      className,
    ].join(" ");

    // Avatar container styles
    const avatarContainerClasses = [
      "bg-zinc-800 border-2 border-zinc-700 rounded-full",
      "shadow-[0_4px_0_0_#3f3f46]", // zinc-700 shadow
      "flex items-center justify-center overflow-hidden",
      "flex-shrink-0",
      currentSize.avatar,
    ].join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="banner"
        aria-labelledby="hero-character-name"
        {...props}
      >
        <div className="flex items-center gap-6">
          {/* Avatar */}
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
                    fallback.className = `avatar-fallback flex items-center justify-center w-full h-full text-zinc-300 font-bold ${
                      size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl"
                    }`;
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
                className={`text-zinc-300 font-bold ${
                  size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl"
                }`}
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

          {/* Character Info */}
          <div className="flex-1 min-w-0">
            <h1
              id="hero-character-name"
              className={`font-bold text-zinc-900 mb-2 break-words ${currentSize.name}`}
            >
              {character.name}
            </h1>
            
            <div className={`flex flex-wrap gap-3 ${currentSize.details}`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Race:</span>
                <span className="capitalize">{character.race}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold">Class:</span>
                <span className="capitalize">
                  {Array.isArray(character.class) 
                    ? character.class.join(" / ") 
                    : character.class}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Level:</span>
                <span>{character.level}</span>
              </div>
            </div>

            {character.desc && (
              <div className={`mt-3 ${currentSize.details}`}>
                <p className="text-zinc-800 italic line-clamp-2" title={character.desc}>
                  {character.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;