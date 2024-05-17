import { CharData, CharDataAction } from "@/data/definitions";
import { Button, Image } from "antd";
import classNames from "classnames";
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
    "cleric-man-1.jpg",
    "dwarf-man-1.jpg",
    "elf-man-1.jpg",
    "elf-woman-1.jpg",
    "elf-woman-2.jpg",
    "elf-woman-3.jpg",
    "gnome-boy-1.jpg",
    "thief-man-1.jpg",
    "thief-woman-1.jpg",
    "warrior-man-1.jpg",
    "warrior-man-2.jpg",
    "warrior-man-3.jpg",
    "warrior-man-4.jpg",
    "warrior-man-5.jpg",
    "warrior-woman-1.jpg",
    "warrior-woman-2.jpg",
    "warrior-woman-3.jpg",
    "wizard-man-1.jpg",
    "wizard-woman-1.jpg",
    "wizard-woman-3.jpg",
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
              payload: {
                avatar: image,
              },
            });
          }}
        >
          <Image
            src={image}
            className={classNames("w-16 rounded-full", {
              "ring-4 ring-seaBuckthorn": avatar === image,
              "ring-2 ring-shipGray": avatar !== image,
            })}
            preview={false}
          />
        </Button>
      ))}
    </div>
  );
};

export default StockAvatars;
