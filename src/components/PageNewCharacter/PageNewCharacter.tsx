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
import { CharData, ClassNames, EquipmentItem } from "@/data/definitions";
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
import { calculateModifier, rollDice } from "@/support/diceSupport";
import { getItemCost } from "@/support/equipmentSupport";

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

function characterReducer(state: CharData, action: any) {
  switch (action.type) {
    case "RESET":
      // Return character to empty state.
      return emptyCharacter;
    case "SET_ABILITIES":
      // Set the character's abilities and modifiers.
      // If newCharacter is true, reset the character's future choices.
      return {
        ...state,
        abilities: {
          scores: action.payload.scores,
          modifiers: action.payload.modifiers,
        },
        race: action.payload.newCharacter ? "" : state.race,
        class: action.payload.newCharacter ? [] : [...state.class],
        hp: action.payload.newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...state.hp },
        equipment: [],
        gold: 0,
        spells: [],
      };
    case "FLIP_ABILITIES": {
      // Flip all the character's abilities and modifiers.
      // If newCharacter is true, reset the character's future choices.
      const flippedScores = Object.fromEntries(
        Object.entries(state.abilities.scores).map(([key, value]) => [
          key,
          21 - +value,
        ]),
      );
      const flippedModifiers = Object.fromEntries(
        Object.entries(flippedScores).map(([key, value]) => [
          key,
          calculateModifier(value),
        ]),
      );
      return {
        ...state,
        abilities: {
          scores: flippedScores,
          modifiers: flippedModifiers,
        },
        race: action.payload.newCharacter ? "" : state.race,
        class: action.payload.newCharacter ? [] : [...state.class],
        hp: action.payload.newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...state.hp },
        equipment: [],
        gold: 0,
        spells: [],
      };
    }
    case "SET_RACE":
      // Set the character's race.
      return {
        ...state,
        race: action.payload.race,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: [],
        gold: 0,
        spells: [],
      };
    case "SET_CLASS": {
      // Set the character's class.
      const getStartingEquipment = (classArray: string[]) => {
        const startingEquipment: EquipmentItem[] = [];
        classArray.some((className) => {
          const hasStartingEquipment =
            classes[className as ClassNames]?.startingEquipment;
          if (hasStartingEquipment) {
            hasStartingEquipment.forEach((item) => {
              item.amount = 1;
            });
            startingEquipment.push(...hasStartingEquipment);
          }
        });
        return startingEquipment;
      };

      let newClassArray;
      if (action.payload.position) {
        if (action.payload.position === "primary") {
          newClassArray =
            [...state.class][1] && action.payload.combinationClass
              ? [...action.payload.class, [...state.class][1]]
              : [...action.payload.class];
        } else {
          newClassArray = [...state.class][0]
            ? [state.class[0], ...action.payload.class]
            : [...action.payload.class];
        }
      } else {
        newClassArray = [...action.payload.class];
      }
      const startingEquipment: EquipmentItem[] =
        getStartingEquipment(newClassArray);

      return {
        ...state,
        class: newClassArray,
        hp: { dice: "", points: 0, max: 0, desc: "" },
        equipment: startingEquipment,
        gold: 0,
        spells: action.payload.keepSpells ? state.spells : [],
      };
    }
    case "SET_SPELLS":
      // Set the character's spells.
      return {
        ...state,
        spells: action.payload.spells,
      };
    case "SET_HP": {
      // Set the character's hit points.
      const dice = action.payload.dice || state.hp.dice;
      const max = action.payload.setMax
        ? +dice.split("d")[1] +
          parseInt(state.abilities.modifiers.constitution as string)
        : state.hp.max;
      console.log("max", max);
      const desc = action.payload.desc || state.hp.desc;
      return {
        ...state,
        hp: {
          dice,
          points: action.payload.points,
          max,
          desc,
        },
      };
    }
    case "SET_GOLD":
      // Set the character's gold.
      return {
        ...state,
        gold: action.payload ? action.payload.gold : rollDice("3d6*10"),
      };
    case "SET_EQUIPMENT": {
      console.log("action.payload", action.payload);
      const foundItemIndex = state.equipment.findIndex(
        (equipmentItem) => equipmentItem.name === action.payload.item.name,
      );
      const equipment = [...state.equipment];
      let gold = state.gold;

      if (foundItemIndex !== -1) {
        if (action.payload.amount === 0) {
          // Remove item if amount is 0
          const costDifference =
            getItemCost(equipment[foundItemIndex]) *
            equipment[foundItemIndex].amount;
          equipment.splice(foundItemIndex, 1);
          gold = parseFloat((state.gold + costDifference).toFixed(2));
        } else {
          // Determine if an item is being added or removed
          const itemAmount = equipment[foundItemIndex].amount;
          const amountDifference = action.payload.amount - itemAmount;
          const costDifference =
            getItemCost(action.payload.item) * amountDifference;
          gold = parseFloat((state.gold - costDifference).toFixed(2));

          // Update existing item amount
          equipment[foundItemIndex] = {
            ...equipment[foundItemIndex],
            amount: action.payload.amount,
          };
        }
      } else {
        // Add new item if it doesn't exist
        const cost = getItemCost(action.payload.item) * action.payload.amount;
        gold = parseFloat((state.gold - cost).toFixed(2));

        equipment.push({
          ...action.payload.item,
          amount: action.payload.amount,
        });
      }

      return {
        ...state,
        equipment,
        gold,
      };
    }
    case "SET_NAME":
      // Set the character's name.
      return {
        ...state,
        name: action.payload.name,
      };
    case "SET_AVATAR":
      // Set the character's avatar.
      return {
        ...state,
        avatar: action.payload.avatar,
      };
    default:
      return state;
  }
}

const PageNewCharacter: React.FC<
  PageNewCharacterProps & React.ComponentPropsWithRef<"div">
> = ({ user, className }) => {
  const [stepNumber, setStepNumber] = React.useState<number>(0);
  const [character, characterDispatch] = React.useReducer(
    characterReducer,
    emptyCharacter,
  );
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
        characterDispatch({ type: "RESET" });
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
          characterDispatch={characterDispatch}
          newCharacter
        />
      ));

    stepNumber === 1 &&
      (content = (
        <StepRace character={character} characterDispatch={characterDispatch} />
      ));
    stepNumber === 2 &&
      (content = (
        <StepClass
          character={character}
          characterDispatch={characterDispatch}
        />
      ));
    stepNumber === 3 &&
      (content = (
        <StepHitPoints
          character={character}
          characterDispatch={characterDispatch}
        />
      ));
    stepNumber === 4 &&
      (content = (
        <StepEquipment
          character={character}
          characterDispatch={characterDispatch}
        />
      ));
    stepNumber === 5 &&
      (content = (
        <StepDetails
          newCharacter
          character={character}
          characterDispatch={characterDispatch}
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

export default PageNewCharacter;
