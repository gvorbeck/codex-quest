import { Avatar, Descriptions, Divider, Modal, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ExperiencePoints from "./ExperiencePoints/ExperiencePoints";
import { extractImageName } from "../../../support/stringSupport";
import { images } from "../../../assets/images/faces/imageAssets";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import { marked } from "marked";
import { isStandardClass, isStandardRace } from "../../../support/helpers";
import { classes } from "../../../data/classes";
import {
  CharacterData,
  ClassNames,
  RaceNames,
  SetCharacterData,
} from "../../../data/definitions";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { races } from "../../../data/races";

type BaseStatsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
};

export default function BaseStats({
  characterData,
  setCharacterData,
  userIsOwner,
  showLevelUpModal,
}: BaseStatsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(
    undefined
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getRaceModalContent = (raceName: RaceNames) =>
    setModalContent(
      <div>
        <Typography.Title level={3} className="text-shipGray">
          {raceName}
        </Typography.Title>
        {isStandardRace(raceName) ? (
          <div
            className="text-shipGray"
            dangerouslySetInnerHTML={{
              __html: marked(races[raceName].details?.description || ""),
            }}
          />
        ) : (
          <div className="text-shipGray">"{raceName}" is a custom race.</div>
        )}
      </div>
    );

  const getClassModalContent = (classNames: ClassNames[]) =>
    setModalContent(
      <div>
        {classNames.map((className: ClassNames) => {
          return (
            <div key={className}>
              <Typography.Title level={3} className="text-shipGray">
                {className}
              </Typography.Title>
              {isStandardClass(className) ? (
                <div
                  className="text-shipGray"
                  dangerouslySetInnerHTML={{
                    __html: marked(
                      classes[className].details?.description || ""
                    ),
                  }}
                />
              ) : (
                <div className="text-shipGray">
                  "{className}" is a custom class.
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

  // Legacy characters created while the site was using Create React App will have broken image links that start with "/static/media/"
  // This code checks for that and replaces the broken link with the correct one
  let image = "";
  if (characterData.avatar.startsWith("/static/media/")) {
    const legacyImage = extractImageName(characterData.avatar);
    if (legacyImage) {
      // find the matching source images in `images`
      // "/src/assets/images/faces/gnome-boy-1.jpg" matches gnome-boy-1
      image = images.find((image) => image.includes(legacyImage)) || "";
    }
  } else {
    image = characterData.avatar;
  }
  const modalDescriptionsClassNames = classNames("[&+td]:cursor-pointer");
  return (
    <div>
      <div className="flex flex-col items-center mt-4 md:flex-row">
        {characterData.avatar.length ? (
          <Avatar
            size={64}
            src={image}
            alt={characterData.name}
            className="print:grayscale shadow-md border-solid border-2 border-seaBuckthorn"
          />
        ) : (
          <Avatar
            size={64}
            icon={<UserOutlined />}
            alt={characterData.name}
            className="print:hidden shadow-md border-solid border-2 border-seaBuckthorn"
          />
        )}
        <Typography.Title
          level={2}
          className="mt-0 mb-0 text-shipGray ml-4 text-center font-enchant text-6xl tracking-wide"
        >
          {characterData.name}
        </Typography.Title>
      </div>
      <Divider className="mt-4 mb-4 border-seaBuckthorn" />
      <div className="flex flex-col justify-between gap-4 w-3/4 lg:w-full lg:flex-row print:flex-row print:items-baseline">
        <ExperiencePoints
          characterData={characterData}
          setCharacterData={setCharacterData}
          userIsOwner={userIsOwner}
          showLevelUpModal={showLevelUpModal}
          className="text-lg print:w-1/2 print:float-left"
        />
        <Descriptions
          bordered
          size="small"
          className="[&_th]:leading-none [&_td]:leading-none [&_td]:px-3 [&_th]:px-2 print:w-1/2"
        >
          <Descriptions.Item label="Level">
            {characterData.level}
          </Descriptions.Item>
          <Descriptions.Item
            label="Race"
            className={modalDescriptionsClassNames}
          >
            <div
              onClick={() => {
                setModalTitle("Race");
                getRaceModalContent(characterData.race as RaceNames);
                showModal();
              }}
            >
              {characterData.race}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label="Class"
            className={modalDescriptionsClassNames}
          >
            <div
              onClick={() => {
                setModalTitle("Class");
                getClassModalContent(characterData.class as ClassNames[]);
                showModal();
              }}
            >
              {characterData.class.join(" ")}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        closeIcon={<CloseIcon />}
        className="text-shipGray"
      >
        {modalContent}
      </Modal>
    </div>
  );
}
