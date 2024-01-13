import React from "react";
import { CharData } from "@/data/definitions";
import { Button } from "antd";
import { images } from "@/assets/images/faces/imageAssets";
import classNames from "classnames";

interface StockAvatarsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const StockAvatars: React.FC<
  StockAvatarsProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const [selectedAvatar, setSelectedAvatar] = React.useState("");

  React.useEffect(() => {
    if (selectedAvatar) {
      const updatedCharacter = { ...character, avatar: selectedAvatar };
      setCharacter(updatedCharacter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAvatar]);

  const stockAvatarClassNames = classNames(
    className,
    "mt-4 grid grid-cols-4 gap-2 md:grid-cols-5 lg:w-[75%]",
  );

  return (
    <div className={stockAvatarClassNames}>
      {images.map((image) => (
        <Button
          key={image}
          type="link"
          className="h-auto w-auto leading-none p-0 border-none"
          onClick={() => {
            setCharacter({ ...character, avatar: image });
            setSelectedAvatar(image);
          }}
        >
          <img
            alt="Avatar"
            src={image}
            className={`w-16 rounded-[50%] border-2 border-solid ${
              image === selectedAvatar
                ? "border-seaBuckthorn"
                : "border-transparent"
            }`}
          />
        </Button>
      ))}
    </div>
  );
};

export default StockAvatars;
