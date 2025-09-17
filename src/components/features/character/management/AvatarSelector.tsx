import { useCallback, useState } from "react";
import { FileUpload } from "@/components/ui/core/primitives";
import { Button, Icon } from "@/components/ui";
import { Card, Typography } from "@/components/ui/core/display";
import { LAYOUT_STYLES } from "@/constants";
import type { Character } from "@/types";
import { FILE_UPLOAD } from "@/constants";

interface AvatarSelectorProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

// List of stock avatars available in /public/avatars/
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
    character.avatar && !character.avatar.startsWith("/avatars/");
  const selectedStockAvatar = character.avatar?.startsWith("/avatars/")
    ? character.avatar
    : null;

  const handleStockAvatarSelect = useCallback(
    (avatarPath: string) => {
      onCharacterChange({
        ...character,
        avatar: `/avatars/${avatarPath}`,
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
      if (file.size > FILE_UPLOAD.AVATAR_MAX_SIZE_BYTES) {
        setUploadError(
          `Image must be smaller than ${FILE_UPLOAD.AVATAR_MAX_SIZE_MB}MB`
        );
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
        <Typography variant="sectionHeading" className={LAYOUT_STYLES.iconText}>
          <Icon name="user" size="md" className="text-amber-400" />
          Avatar
        </Typography>
        <Card variant="info" size="compact" className="mb-6">
          <Typography variant="helper" color="amber">
            Choose a stock avatar or upload your own image to represent your
            character.
          </Typography>
        </Card>
      </header>

      {/* Current Avatar Preview */}
      {character.avatar && (
        <Card variant="success">
          <Typography
            variant="baseSectionHeading"
            className={`${LAYOUT_STYLES.iconText} text-lime-100`}
          >
            <Icon name="check-circle" size="sm" className="text-lime-400" />
            Current Avatar
          </Typography>
          <div className="flex items-center gap-4">
            <img
              src={character.avatar}
              alt={`${character.name || "Character"} avatar`}
              className="w-20 h-20 rounded-full border-3 border-lime-400 object-cover shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="flex-1">
              <div className="text-lime-100 font-medium mb-3">
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
        </Card>
      )}

      {/* Stock Avatars */}
      <Card variant="standard">
        <Typography
          variant="baseSectionHeading"
          className={LAYOUT_STYLES.iconText}
        >
          <Icon name="photo" size="sm" className="text-zinc-400" />
          Stock Avatars
        </Typography>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {STOCK_AVATARS.map((avatar) => {
            const avatarPath = `/avatars/${avatar}`;
            const isSelected = selectedStockAvatar === avatarPath;

            return (
              <button
                key={avatar}
                type="button"
                onClick={() => handleStockAvatarSelect(avatar)}
                aria-label={`Select ${getAvatarDisplayName(avatar)} avatar`}
                className={`
                  relative w-16 h-16 rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-zinc-900
                  ${
                    isSelected
                      ? "border-lime-400 bg-lime-400/10 shadow-[0_2px_0_0_#65a30d]"
                      : "border-zinc-600 hover:border-lime-400 hover:bg-zinc-700"
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
                    target.className += " bg-zinc-700";
                  }}
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full flex items-center justify-center">
                    <Icon name="check" size="xs" className="text-zinc-900" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Custom Upload */}
      <Card variant="standard">
        <Typography
          variant="baseSectionHeading"
          className={LAYOUT_STYLES.iconText}
        >
          <Icon name="upload" size="sm" className="text-zinc-400" />
          Upload Custom Avatar
        </Typography>
        <FileUpload
          label="Upload Avatar Image"
          helperText={`Upload your own avatar image. Accepts JPG, PNG, WebP. Max ${FILE_UPLOAD.AVATAR_MAX_SIZE_MB}MB.`}
          accept="image/jpeg,image/png,image/webp"
          maxSizeBytes={FILE_UPLOAD.AVATAR_MAX_SIZE_BYTES}
          onFileSelect={handleCustomUpload}
          error={uploadError}
          aria-describedby="avatar-upload-info"
        />
        <Card variant="info" size="compact" className="mt-4">
          <Typography variant="helper" color="amber">
            For best results, use a square image (1:1 aspect ratio) that's at
            least 128x128 pixels.
          </Typography>
        </Card>
      </Card>
    </div>
  );
}

export default AvatarSelector;
