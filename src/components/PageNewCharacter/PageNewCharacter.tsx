import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Steps,
  StepsProps,
  Tooltip,
  Typography,
} from "antd";
import { User } from "firebase/auth";
import BreadcrumbHomeLink from "../BreadcrumbHomeLink/BreadcrumbHomeLink";
import { UserAddOutlined } from "@ant-design/icons";
import React from "react";
import { CharData } from "@/data/definitions";
import StepAbilities from "./StepAbilities/StepAbilities";
import StepRace from "./StepRace/StepRace";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import StepClass from "./StepClass/StepClass";

interface PageNewCharacterProps {
  user: User | null;
}

const breadcrumbItems: BreadcrumbProps["items"] = [
  { title: <BreadcrumbHomeLink /> },
  {
    title: (
      <div>
        <UserAddOutlined className="mr-2" />
        <span>New Character</span>
      </div>
    ),
  },
];

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
];

const newCharacterStepsItems: StepsProps["items"] = [
  {
    title: "Abilities",
  },
  {
    title: "Race",
  },
  {
    title: "Class",
  },
  {
    title: "Hit Points",
  },
  {
    title: "Equipment",
  },
  {
    title: "Details",
  },
];

const emptyCharacter: CharData = {
  abilities: {
    scores: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      dexterity: 0,
      constitution: 0,
      charisma: 0,
    },
    modifiers: {
      strength: "",
      intelligence: "",
      wisdom: "",
      dexterity: "",
      constitution: "",
      charisma: "",
    },
  },
  avatar: "",
  class: [],
  desc: [],
  equipment: [],
  gold: 0,
  hp: {
    dice: "",
    points: 0,
    max: 0,
    desc: "",
  },
  level: 1,
  name: "",
  race: "",
  restrictions: {
    race: [],
    class: [],
  },
  savingThrows: {
    deathRayOrPoison: 0,
    dragonBreath: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    spells: 0,
  },
  specials: {
    race: [],
    class: [],
  },
  spells: [],
  weight: 0,
  xp: 0,
};

const PageNewCharacterCreator: React.FC<
  PageNewCharacterProps & React.ComponentPropsWithRef<"div">
> = ({ user, className }) => {
  const [stepNumber, setStepNumber] = React.useState<number>(0);
  const [character, setCharacter] = React.useState<CharData>(emptyCharacter);
  console.log(character);

  if (!newCharacterStepsItems) return;

  function handleNext() {
    setStepNumber((prevStepNumber) => prevStepNumber + 1);
  }
  function handlePrev() {
    setStepNumber((prevStepNumber) => prevStepNumber - 1);
  }

  function handleSaveCharacter() {
    // ...TBD
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
        disabled = character.race === "";
        break;
      case 2:
        // check class is not empty
        // if combo class is selected, that second class is not empty
        // if magic class, that spell is not empty
        break;
      default:
        break;
    }
    return disabled;
  }
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
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
            {/* NEW WRAPPER COMPONENT START (USE: NEW-CHARACTER, NEW-GAME) */}
            <Typography.Title
              level={2}
              className="m-0 font-enchant leading-none tracking-wide"
            >
              {newCharacterStepItemData[stepNumber]["title"]}
            </Typography.Title>
            <Typography.Paragraph className="m-0 [&_p]:m-0 [&_p+p]:mt-4">
              <Markdown rehypePlugins={[rehypeRaw]}>
                {newCharacterStepItemData[stepNumber]["description"]}
              </Markdown>
            </Typography.Paragraph>
            <Divider />
            {/* NEW WRAPPER COMPONENT END */}
            <Flex gap={16} justify="space-between">
              {stepNumber > 0 && <Button onClick={handlePrev}>Previous</Button>}
              {stepNumber < newCharacterStepsItems.length - 1 && (
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
              )}
              {stepNumber === newCharacterStepsItems.length - 1 && (
                <Button
                  type="primary"
                  onClick={handleSaveCharacter}
                  disabled={handleProgressDisabled()}
                >
                  Done
                </Button>
              )}
            </Flex>
            {stepNumber === 0 && (
              <StepAbilities
                character={character}
                setCharacter={setCharacter}
                newCharacter
              />
            )}
            {stepNumber === 1 && (
              <StepRace character={character} setCharacter={setCharacter} />
            )}
            {stepNumber === 2 && (
              <StepClass character={character} setCharacter={setCharacter} />
            )}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default PageNewCharacterCreator;

// import {
//   Breadcrumb,
//   BreadcrumbProps,
//   Button,
//   Col,
//   Flex,
//   Row,
//   Steps,
//   message,
// } from "antd";
// import { User } from "firebase/auth";
// import React from "react";
// import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
// import { UserAddOutlined } from "@ant-design/icons";
// import { CharData } from "@/data/definitions";
// import { useNavigate } from "react-router-dom";
// import NewContentWrapper from "@/components/NewContentWrapper/NewContentWrapper";
// import {
//   addCharacterData,
//   getStepsItems,
//   isNextButtonEnabled,
// } from "@/support/pageNewCharacterSupport";

// interface PageNewCharacterProps {
//   user: User | null;
// }

// const breadcrumbItems: BreadcrumbProps["items"] = [
//   { title: <BreadcrumbHomeLink /> },
//   {
//     title: (
//       <div>
//         <UserAddOutlined className="mr-2" />
//         <span>New Character</span>
//       </div>
//     ),
//   },
// ];

// const PageNewCharacter: React.FC<
//   PageNewCharacterProps & React.ComponentPropsWithRef<"div">
// > = ({ className }) => {
//   // HOOKS
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = React.useState<number>(0);
//   const [character, setCharacter] = React.useState<CharData>({
//     level: 1,
//     xp: 0,
//   } as CharData);
//   const [messageApi, contextHolder] = message.useMessage();
//   // VARS
//   const next = () => {
//     console.info(character);
//     setCurrentStep(currentStep + 1);
//   };
//   const prev = () => {
//     console.info(character);
//     setCurrentStep(currentStep - 1);
//   };
//   const stepsItems = getStepsItems(character, setCharacter);
//   const items = stepsItems.map((item) => ({
//     key: item.title,
//     title: item.title,
//   }));

//   return (
//     <>
//       {contextHolder}
//       <Breadcrumb items={breadcrumbItems} />
//       <Row className={className} gutter={16}>
//         <Col xs={24} sm={5}>
//           <Steps
//             progressDot
//             current={currentStep}
//             direction="vertical"
//             items={items}
//             className="hidden sm:block"
//           />
//         </Col>
//         <Col xs={24} sm={19}>
//           <NewContentWrapper
//             title={stepsItems[currentStep].fulltitle}
//             markedDesc={stepsItems[currentStep].description}
//           >
//             <Flex gap={16} justify="space-between">
//               {currentStep > 0 && (
//                 <Button onClick={() => prev()}>Previous</Button>
//               )}
//               {currentStep < stepsItems.length - 1 && (
//                 <Button
//                   type="primary"
//                   onClick={() => next()}
//                   disabled={!isNextButtonEnabled(currentStep, character)}
//                   className="[&:only-child]:ml-auto"
//                 >
//                   Next
//                 </Button>
//               )}
//               {currentStep === stepsItems.length - 1 && (
//                 <Button
//                   type="primary"
//                   onClick={() =>
//                     addCharacterData(
//                       character,
//                       messageApi,
//                       setCharacter,
//                       setCurrentStep,
//                       navigate,
//                     )
//                   }
//                   disabled={!isNextButtonEnabled(currentStep, character)}
//                 >
//                   Done
//                 </Button>
//               )}
//             </Flex>
//             {stepsItems[currentStep].content}
//           </NewContentWrapper>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default PageNewCharacter;
