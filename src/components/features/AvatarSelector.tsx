import { useCallback, useState } from "react";
import { FileUpload, Button } from "@/components/ui";
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
    <div>
      <h4>Avatar</h4>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#6c757d",
          marginBottom: "1.5rem",
        }}
      >
        Choose a stock avatar or upload your own image to represent your
        character.
      </p>

      {/* Current Avatar Preview */}
      {character.avatar && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h5 style={{ marginBottom: "0.5rem" }}>Current Avatar</h5>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={character.avatar}
              alt="Current character avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "2px solid #dee2e6",
                objectFit: "cover",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "500" }}>
                {isCustomAvatar
                  ? "Custom Upload"
                  : getAvatarDisplayName(
                      character.avatar.split("/").pop() || ""
                    )}
              </div>
              <Button
                onClick={handleClearAvatar}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                }}
              >
                Remove Avatar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Avatars */}
      <div style={{ marginBottom: "2rem" }}>
        <h5 style={{ marginBottom: "1rem" }}>Stock Avatars</h5>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {STOCK_AVATARS.map((avatar) => {
            const avatarPath = `/faces/${avatar}`;
            const isSelected = selectedStockAvatar === avatarPath;

            return (
              <button
                key={avatar}
                type="button"
                onClick={() => handleStockAvatarSelect(avatar)}
                aria-label={`Select ${getAvatarDisplayName(avatar)} avatar`}
                style={{
                  padding: "0.25rem",
                  border: `2px solid ${isSelected ? "#007bff" : "#dee2e6"}`,
                  borderRadius: "50%",
                  backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#007bff";
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#dee2e6";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "2px solid #007bff";
                  e.currentTarget.style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
              >
                <img
                  src={avatarPath}
                  alt={getAvatarDisplayName(avatar)}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.alt = "Avatar unavailable";
                    target.style.backgroundColor = "#f8f9fa";
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Upload */}
      <div>
        <h5 style={{ marginBottom: "1rem" }}>Upload Custom Avatar</h5>
        <FileUpload
          label="Upload Avatar Image"
          helperText="Upload your own avatar image. Accepts JPG, PNG, WebP. Max 2MB."
          accept="image/jpeg,image/png,image/webp"
          maxSizeBytes={2 * 1024 * 1024}
          onFileSelect={handleCustomUpload}
          error={uploadError}
          aria-describedby="avatar-upload-info"
        />
        <div
          id="avatar-upload-info"
          style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "0.5rem" }}
        >
          For best results, use a square image (1:1 aspect ratio) that's at
          least 128x128 pixels.
        </div>
      </div>
    </div>
  );
}

export default AvatarSelector;
