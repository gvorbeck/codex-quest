import React from "react";
import { SolutionOutlined } from "@ant-design/icons";
import {
  Flex,
  Divider,
  Breadcrumb,
  Typography,
  Descriptions,
  DescriptionsProps,
} from "antd";
import { CharacterDataContext } from "@/store/CharacterContext";
import ExperiencePoints from "./ExperiencePoints/ExperiencePoints";
import HeroAvatar from "./HeroAvatar/HeroAvatar";
import Section from "../Section/Section";
import StepDetails from "@/components/PageNewCharacter/StepDetails/StepDetails";
import { ModalDisplay } from "@/data/definitions";
import { breadcrumbItems } from "@/support/cqSupportGeneral";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { useDeviceType } from "@/hooks/useDeviceType";

interface HeroProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const Hero: React.FC<HeroProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  setModalDisplay,
}) => {
  const { character, characterDispatch, userIsOwner } =
    React.useContext(CharacterDataContext);
  const { isMobile } = useDeviceType();

  const descriptionsItems: DescriptionsProps["items"] = [
    { key: "1", label: "Level", children: character.level },
    { key: "2", label: "Race", children: character.race },
    { key: "3", label: "Class", children: character.class.join(", ") },
  ];

  function handleShowAvatarModal() {
    if (userIsOwner) {
      setModalDisplay({
        isOpen: true,
        title: "Change Avatar",
        content: (
          <AvatarPicker
            character={character}
            characterDispatch={characterDispatch}
          />
        ),
      });
    }
  }

  return (
    <>
      <Flex className={"w-full " + className} gap={16} vertical>
        <Breadcrumb items={breadcrumbItems(character.name, SolutionOutlined)} />
        <HeroAvatar handleShowAvatarModal={handleShowAvatarModal} />
        <Section
          component={
            <Typography.Title
              level={2}
              className="text-center m-0 leading-none font-enchant text-5xl tracking-wide w-full [&:hover_span]:opacity-100 [&_span]:opacity-50 [&>*]:cursor-pointer!"
            >
              {character.name}
            </Typography.Title>
          }
          editable
          editableComponent={
            <StepDetails
              character={character}
              characterDispatch={characterDispatch}
              className="mr-4"
            />
          }
          className="relative self-center"
          editableClassName="absolute left-full"
        />
        <Divider />
        <Flex
          gap={16}
          align="flex-start"
          vertical={isMobile}
          justify="space-between"
          className="w-full sm:flex-row-reverse sm:mx-auto"
        >
          <Descriptions
            bordered
            column={2}
            size="small"
            items={descriptionsItems}
            className="w-full sm:w-1/3"
          />
          <ExperiencePoints setModalDisplay={setModalDisplay} />
        </Flex>
      </Flex>
    </>
  );
};

export default Hero;
