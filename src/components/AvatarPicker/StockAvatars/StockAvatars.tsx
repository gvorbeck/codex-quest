import { CharData, CharDataAction } from "@/data/definitions";
import { Button, Image } from "antd";
import { clsx } from "clsx";
import React from "react";

interface StockAvatarsProps {
  character: CharData;
  characterDispatch: React.Dispatch<CharDataAction>;
}

const StockAvatars: React.FC<
  StockAvatarsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, characterDispatch }) => {
  const [avatar, setAvatar] = React.useState(character.avatar);

  const imageNames = [
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

  const images = imageNames.map((name) => `/faces/${name}`);

  return (
    <div className={"mt-4 grid grid-cols-4 gap-2 md:grid-cols-5 " + className}>
      {images.map((image) => (
        <Button
          key={image}
          type="link"
          className="h-auto w-auto leading-none p-0"
          onClick={() => {
            setAvatar(image);
            characterDispatch({
              type: "SET_AVATAR",
              payload: { avatar: image },
            });
          }}
        >
          <Image
            src={image}
            className={clsx("w-16 rounded-full", {
              "ring-4 ring-sea-buckthorn": avatar === image,
              "ring-2 ring-ship-gray": avatar !== image,
            })}
            preview={false}
          />
        </Button>
      ))}
    </div>
  );
};

export default StockAvatars;
