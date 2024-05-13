import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Row,
  Steps,
  StepsProps,
  Tooltip,
  Typography,
  message,
} from "antd";
import { User } from "firebase/auth";
import { UserAddOutlined } from "@ant-design/icons";
import React from "react";
import { CharData, ClassNames } from "@/data/definitions";
import StepAbilities from "./StepAbilities/StepAbilities";
import StepRace from "./StepRace/StepRace";
import StepClass from "./StepClass/StepClass";
import { classes } from "@/data/classes";
import StepHitPoints from "./StepHitPoints/StepHitPoints";
import StepEquipment from "./StepEquipment/StepEquipment";
import StepDetails from "./StepDetails/StepDetails";
import { createDocument } from "@/support/accountSupport";
import { auth } from "@/firebase";
import { MessageInstance } from "antd/es/message/interface";
import { useNavigate } from "react-router-dom";
import { emptyCharacter } from "@/support/characterSupport";
import { breadcrumbItems } from "@/support/cqSupportGeneral";
import NewContentHeader from "../NewContentHeader/NewContentHeader";

console.warn("TODO: * messageapi not working *");

interface PageNewCharacterProps {
  user: User | null;
}

const newCharacterStepItemData = [
  {
    title: "Roll for Ability Scores",
    description: `Roll for your character's Abilities. **You can click the "Roll" buttons or use your own dice and record your scores**. Afterward your character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus (or penalty) Modifier is then associated with each score. Your character's Abilities will begin to determine the options available to them in the next steps as well, so good luck!
  
  <a href="https://basicfantasy.org/srd/abilities.html" target="_blank">BFRPG Official Character Ability documentation</a>`,
    disabled: "Roll all your Ability Scores before proceeding.",
  },
  {
    title: "Choose Your Race",
    description: `Choose your character's Race. **Some options may be unavailable due to your character's Ability Scores**. Each Race except Humans has a minimum and maximum value for specific Abilities that your character's Ability Scores must meet in order to select them. Consider that each Race has specific restrictions, special abilities, and Saving Throws. Choose wisely.
  
  <a href="https://basicfantasy.org/srd/races.html" target="_blank">BFRPG Official Character Race documentation</a>`,
    disabled: "Select a Race before proceeding.",
  },
  {
    title: "Choose Your Class",
    description: `Choose your character's Class. **Your character's Race and Ability Scores will determine which Class options are available**. Your Class choice determines your character's background and how they will progress through the game as they level up.
  
  <a href="https://basicfantasy.org/srd/class.html" target="_blank">BFRPG Official Character Class documentation</a>`,
    disabled: "Select a Class and required options before proceeding.",
  },
  {
    title: "Roll for Hit Points",
    description: `Roll for your character's Hit Points. **Your character's Race may place restrictions on the Hit Dice available to them, but generally this is determined by their chosen Class**. Additionally, your character's Constitution modifier is added/subtracted from this value with a minimum value of 1. The end result is the amount of Hit Points your character will start with and determines how much damage your character can take in battle.
  
  <a href="https://basicfantasy.org/srd/abilities.html#hit-points-and-hit-dice" target="_blank">BFRPG Official Character Hit Points documentation</a>`,
    disabled: "Roll for Hit Points before proceeding.",
  },
  {
    title: "Buy Equipment",
    description: `Roll for your character's starting gold and purchase their equipment. **Keep in mind that your character's Race and Class selections may limit types and amounts of equipment they can have**.
  
  <a href="https://basicfantasy.org/srd/equipment.html" target="_blank">BFRPG Official Character Equipment documentation</a>`,
    disabled: "Roll for your starting gold before proceeding.",
  },
  {
    title: "Finalize Character Details",
    description: `You're almost done! Personalize your newly minted character by giving them an identity. Optionally, upload a portrait image if you'd like. Image must be PNG/JPG and <= 1mb`,
    disabled: "Fill in your character's name before proceeding.",
  },
];

const newCharacterStepsItems: StepsProps["items"] = [
  { title: "Abilities" },
  { title: "Race" },
  { title: "Class" },
  { title: "Hit Points" },
  { title: "Equipment" },
  { title: "Details" },
];

const PageNewCharacterCreator: React.FC<
  PageNewCharacterProps & React.ComponentPropsWithRef<"div">
> = ({ user, className }) => {
  const [stepNumber, setStepNumber] = React.useState<number>(0);
  const [character, setCharacter] = React.useState<CharData>(emptyCharacter);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  if (!user) {
    return (
      <>
        <Breadcrumb items={breadcrumbItems("New Character", UserAddOutlined)} />
        <Typography.Text>
          You must log in before creating a character.
        </Typography.Text>
      </>
    );
  }
  console.info("Character in progress:", character);

  if (!newCharacterStepsItems) return;

  function handleNext() {
    setStepNumber((prevStepNumber) => prevStepNumber + 1);
  }
  function handlePrev() {
    setStepNumber((prevStepNumber) => prevStepNumber - 1);
  }
  function success(name: string, messageApi: MessageInstance) {
    messageApi.open({
      type: "success",
      content: `${name} successfully saved!`,
    });
  }
  function errorMessage(message: string, messageApi: MessageInstance) {
    messageApi.open({
      type: "error",
      content: `This is an error message: ${message}`,
    });
  }

  async function handleSaveCharacter() {
    await createDocument(
      auth.currentUser,
      "characters",
      character,
      (name) => {
        success(name, messageApi);
        // Reset characterData and step
        setCharacter({} as CharData);
        setStepNumber(0);
      },
      (error) => {
        errorMessage(`Error writing document: ${error}`, messageApi);
      },
      () => {
        navigate("/");
      },
    );
  }

  function handleProgressDisabled() {
    let disabled = false;
    switch (stepNumber) {
      case 0:
        // If any ability score is 0, disable the next button
        disabled = Object.values(character.abilities.scores).some(
          (ability) => ability === 0,
        );
        break;
      case 1:
        // Disable next button if no race has been selected
        disabled = character.race === "";
        break;
      case 2:
        // Disable next button if no class has been selected
        disabled = character.class.length === 0;
        // Further checks if classes are selected
        if (!disabled) {
          // Check if any selected class has a spellBudget, implying need for spell selection
          const classRequiresSpells = character.class.some((className) => {
            const classDetails = classes[className as ClassNames];
            // Only consider predefined classes that have a spellBudget defined
            return (
              classDetails &&
              classDetails.spellBudget &&
              classDetails.spellBudget[0][0] > 0
            );
          });
          // If a predefined class requires spells, ensure that spells have been selected
          if (classRequiresSpells) {
            disabled = character.spells.length === 0;
          }
        }
        break;
      case 3:
        disabled = character.hp.points === 0;
        break;
      case 4:
        disabled = character.equipment.length === 0 && character.gold === 0;
        break;
      case 5:
        disabled = character.name === "";
        break;
      default:
        break;
    }
    return disabled;
  }

  function getStepContent() {
    let content = null;
    stepNumber === 0 &&
      (content = (
        <StepAbilities
          character={character}
          setCharacter={setCharacter}
          newCharacter
        />
      ));

    stepNumber === 1 &&
      (content = (
        <StepRace character={character} setCharacter={setCharacter} />
      ));
    stepNumber === 2 &&
      (content = (
        <StepClass character={character} setCharacter={setCharacter} />
      ));
    stepNumber === 3 &&
      (content = (
        <StepHitPoints character={character} setCharacter={setCharacter} />
      ));
    stepNumber === 4 &&
      (content = (
        <StepEquipment character={character} setCharacter={setCharacter} />
      ));
    stepNumber === 5 &&
      (content = (
        <StepDetails
          newCharacter
          character={character}
          setCharacter={setCharacter}
        />
      ));
    return content;
  }

  const previousButton =
    stepNumber > 0 ? <Button onClick={handlePrev}>Previous</Button> : null;
  const nextButton =
    stepNumber < newCharacterStepsItems.length - 1 ? (
      <Tooltip
        title={
          handleProgressDisabled() &&
          newCharacterStepItemData[stepNumber]["disabled"]
        }
      >
        <Button
          type="primary"
          onClick={handleNext}
          disabled={handleProgressDisabled()}
          className="[&:only-child]:ml-auto"
        >
          Next
        </Button>
      </Tooltip>
    ) : null;
  const doneButton =
    stepNumber === newCharacterStepsItems.length - 1 ? (
      <Button
        type="primary"
        onClick={handleSaveCharacter}
        disabled={handleProgressDisabled()}
      >
        Done
      </Button>
    ) : null;

  return (
    <>
      {contextHolder}
      <Breadcrumb items={breadcrumbItems("New Character", UserAddOutlined)} />
      <Row className={className} gutter={16}>
        <Col xs={24} sm={5}>
          <Steps
            progressDot
            current={stepNumber}
            direction="vertical"
            items={newCharacterStepsItems}
            className="hidden sm:block"
          />
        </Col>
        <Col xs={24} sm={19}>
          <Flex gap={16} vertical>
            <NewContentHeader
              title={newCharacterStepItemData[stepNumber]["title"]}
              description={newCharacterStepItemData[stepNumber]["description"]}
            />
            <Flex gap={16} justify="space-between">
              {previousButton}
              {nextButton}
              {doneButton}
            </Flex>
            {getStepContent()}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default PageNewCharacterCreator;
