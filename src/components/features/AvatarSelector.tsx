import { useCallback, useState } from "react";
import { FileUpload, Button, Callout } from "@/components/ui";
import type { Character } from "@/types/character";

interface AvatarSelectorProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

// List of stock avatars available in /public/faces/
const STOCK_AVATARS = [
  "cleric-man-1.webp",
  "dwarf-man-1.webp",
  "elf-man-1.webp",
  "elf-woman-1.webp",
  "elf-woman-2.webp",
  "elf-woman-3.webp",
  "gnome-boy-1.webp",
  "thief-man-1.webp",
  "thief-woman-1.webp",
  "warrior-man-1.webp",
  "warrior-man-2.webp",
  "warrior-man-3.webp",
  "warrior-man-4.webp",
  "warrior-man-5.webp",
  "warrior-woman-1.webp",
  "warrior-woman-2.webp",
  "warrior-woman-3.webp",
  "wizard-man-1.webp",
  "wizard-woman-1.webp",
  "wizard-woman-3.webp",
];

function AvatarSelector({ character, onCharacterChange }: AvatarSelectorProps) {
  const [uploadError, setUploadError] = useState<string>("");

  // Determine if current avatar is a stock avatar or custom upload
  const isCustomAvatar =
    character.avatar && !character.avatar.startsWith("/faces/");
  const selectedStockAvatar = character.avatar?.startsWith("/faces/")
    ? character.avatar
    : null;

  const handleStockAvatarSelect = useCallback(
    (avatarPath: string) => {
      onCharacterChange({
        ...character,
        avatar: `/faces/${avatarPath}`,
      });
      setUploadError("");
    },
    [character, onCharacterChange]
  );

  const handleCustomUpload = useCallback(
    (file: File | null) => {
      setUploadError("");

      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }

      // Validate file size (max 2MB for avatars)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setUploadError("Image must be smaller than 2MB");
        return;
      }

      // Create a data URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onCharacterChange({
          ...character,
          avatar: dataUrl,
        });
      };
      reader.onerror = () => {
        setUploadError("Failed to read the image file");
      };
      reader.readAsDataURL(file);
    },
    [character, onCharacterChange]
  );

  const handleClearAvatar = useCallback(() => {
    const updatedCharacter = { ...character };
    delete updatedCharacter.avatar;
    onCharacterChange(updatedCharacter);
    setUploadError("");
  }, [character, onCharacterChange]);

  const getAvatarDisplayName = (filename: string): string => {
    // Simply return the index position + 1 for a neutral numbering system
    const index = STOCK_AVATARS.indexOf(filename);
    return `Avatar ${index + 1}`;
  };

  return (
    <div className="space-y-6">
      <header>
        <h4 className="text-lg font-semibold text-primary-100 mb-2">Avatar</h4>
        <Callout variant="info" size="sm">
          Choose a stock avatar or upload your own image to represent your
          character.
        </Callout>
      </header>

      {/* Current Avatar Preview */}
      {character.avatar && (
        <div className="bg-primary-800 rounded-lg p-4 border border-primary-700">
          <h5 className="text-base font-medium text-primary-200 mb-3">
            Current Avatar
          </h5>
          <div className="flex items-center gap-4">
            <img
              src={character.avatar}
              alt={`${character.name || "Character"} avatar`}
              className="w-20 h-20 rounded-full border-2 border-primary-600 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="flex-1">
              <div className="text-primary-200 font-medium mb-2">
                {isCustomAvatar
                  ? "Custom Upload"
                  : getAvatarDisplayName(
                      character.avatar.split("/").pop() || ""
                    )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAvatar}
              >
                Remove Avatar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Avatars */}
      <div>
        <h5 className="text-base font-medium text-primary-200 mb-3">
          Stock Avatars
        </h5>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {STOCK_AVATARS.map((avatar) => {
            const avatarPath = `/faces/${avatar}`;
            const isSelected = selectedStockAvatar === avatarPath;

            return (
              <button
                key={avatar}
                type="button"
                onClick={() => handleStockAvatarSelect(avatar)}
                aria-label={`Select ${getAvatarDisplayName(avatar)} avatar`}
                className={`
                  relative w-16 h-16 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-highlight-400 focus:ring-offset-2 focus:ring-offset-primary-900
                  ${
                    isSelected
                      ? "border-highlight-400 bg-highlight-400/10"
                      : "border-primary-600 hover:border-highlight-400 hover:bg-primary-800"
                  }
                `}
              >
                <img
                  src={avatarPath}
                  alt={getAvatarDisplayName(avatar)}
                  className="w-full h-full rounded-md object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.alt = "Avatar unavailable";
                    target.className += " bg-primary-700";
                  }}
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-highlight-400 rounded-full flex items-center justify-center">
                    <span className="text-primary-900 text-xs font-bold">
                      ✓
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Upload */}
      <div className="bg-primary-800 rounded-lg p-4 border border-primary-700">
        <h5 className="text-base font-medium text-primary-200 mb-3">
          Upload Custom Avatar
        </h5>
        <FileUpload
          label="Upload Avatar Image"
          helperText="Upload your own avatar image. Accepts JPG, PNG, WebP. Max 2MB."
          accept="image/jpeg,image/png,image/webp"
          maxSizeBytes={2 * 1024 * 1024}
          onFileSelect={handleCustomUpload}
          error={uploadError}
          aria-describedby="avatar-upload-info"
        />
        <Callout variant="neutral" size="sm">
          For best results, use a square image (1:1 aspect ratio) that's at
          least 128x128 pixels.
        </Callout>
      </div>
    </div>
  );
}

export default AvatarSelector;
