import {
  Card,
  Descriptions,
  Flex,
  Image,
  Select,
  SelectProps,
  Switch,
  Typography,
} from "antd";
import React from "react";
import {
  baseClasses,
  classSplit,
  getClassSelectOptions,
  getClassType,
} from "@/support/classSupport";
import { CharData, ClassNames, Spell } from "@/data/definitions";
import { classes } from "@/data/classes";
import { useMarkdown } from "@/hooks/useMarkdown";
import { getSpellFromName, getSpellsAtLevel } from "@/support/spellSupport";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useImages } from "@/hooks/useImages";
import { toSlugCase } from "@/support/stringSupport";

interface StepClassProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  comboClass: boolean;
  comboClassSwitch: boolean;
  setComboClassSwitch: (comboClassSwitch: boolean) => void;
}

const StepClass: React.FC<
  StepClassProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  setCharacter,
  comboClass, // whether or not a character is able to use a combo class
  comboClassSwitch,
  setComboClassSwitch,
}) => {
  const { isMobile } = useDeviceType();
  // STATE
  const [standardClass, setStandardClass] = React.useState<string | undefined>(
    getClassType(character.class) === "standard"
      ? classSplit(character.class)[0]
      : undefined,
  );
  const [classArr, setClassArr] = React.useState<string[]>(
    classSplit(character.class) ?? [],
  );
  const [supplementalContent, setSupplementalContent] = React.useState<boolean>(
    classSplit(character.class).some(
      (className) => !baseClasses.includes(className as ClassNames),
    ),
  );
  const [hasMagicCharacterClass, setHasMagicCharacterClass] =
    React.useState<boolean>(
      classSplit(character.class).some(
        (className) =>
          classes[className as ClassNames]?.spellBudget?.[character.level - 1],
      ),
    );
  const [magicCharacterClass, setMagicCharacterClass] =
    React.useState<string>();
  const [startingSpells, setStartingSpells] = React.useState<Spell[]>();
  // VARS
  const classDescription = useMarkdown(
    `Characters with the **${magicCharacterClass}** class start with **Read Magic** and one other spell:`,
  );
  const levelOneSpells = getSpellsAtLevel(classArr, character.level);
  const spellSelectOptions: SelectProps["options"] = levelOneSpells
    .map((spell: Spell) => ({ value: spell.name, label: spell.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const descriptionMarkdown = useMarkdown(
    startingSpells?.[1].description ?? "",
  );
  const { getSpellImage } = useImages();
  const spellImage = getSpellImage(toSlugCase(startingSpells?.[1].name || ""));
  // HANDLERS
  const onStandardClassChange = (value: string) => {
    setStandardClass(value);
    setClassArr([value]);
  };
  const onSupplementalContentChange = (checked: boolean) => {
    setSupplementalContent(checked);
  };
  const onStartingSpellChange = (value: string) => {
    const readMagicSpell = getSpellFromName("Read Magic");
    const selectedSpell = getSpellFromName(value);
    const spells = [readMagicSpell, selectedSpell].filter(Boolean) as Spell[];
    setStartingSpells(spells);
  };

  React.useEffect(() => {
    console.log("standardClass changed", standardClass);
    setStartingSpells(undefined);
    if (standardClass) {
      setClassArr([standardClass]);
    } else {
      setClassArr([]);
    }
  }, [standardClass]);

  React.useEffect(() => {
    console.log("supplementalContent changed", supplementalContent);
    setClassArr([]);
    setStandardClass(undefined);
    setStartingSpells(undefined);
  }, [supplementalContent]);

  React.useEffect(() => {
    console.log("classArr changed", classArr);
    if (classArr.length) {
      setHasMagicCharacterClass(
        classArr.some((className) =>
          classes[className as ClassNames]?.spellBudget?.[
            character.level - 1
          ].some((spellBudget) => spellBudget > 0),
        ),
      );
    } else {
      setHasMagicCharacterClass(false);
    }
  }, [classArr]);

  React.useEffect(() => {
    console.log("hasMagicCharacterClass changed", hasMagicCharacterClass);
    if (hasMagicCharacterClass) {
      setMagicCharacterClass(
        classArr.find(
          (className) => classes[className as ClassNames]?.spellBudget,
        ),
      );
    } else {
      setMagicCharacterClass(undefined);
    }
  }, [hasMagicCharacterClass]);

  console.log(character);
  return (
    <Flex gap={16} vertical>
      <div>classArr: {...classArr}</div> {/* TODO: delete */}
      <div>magicCharacter: {hasMagicCharacterClass ? "true" : "false"}</div>
      <div>
        spells:{" "}
        {startingSpells
          ? startingSpells.map((spell) => spell.name).join(", ")
          : ""}
      </div>
      {/* TODO: delete */}
      <Flex gap={16}>
        <Flex gap={8}>
          <Typography.Text>Enable Supplemental Content</Typography.Text>
          <Switch
            checked={supplementalContent}
            onChange={onSupplementalContentChange}
          />
        </Flex>
        <Flex gap={8}>
          <Typography.Text>Use Combination Class</Typography.Text>
          <Switch />
        </Flex>
      </Flex>
      <Select
        options={getClassSelectOptions(character)}
        value={standardClass}
        onChange={onStandardClassChange}
        placeholder="Select a class"
      />
      {hasMagicCharacterClass && (
        <Card
          title={
            <span className="font-enchant text-3xl tracking-wide">
              Choose a spell
            </span>
          }
        >
          <Flex vertical gap={16}>
            <Typography.Text className="[&_p]:m-0">
              <div dangerouslySetInnerHTML={{ __html: classDescription }} />
            </Typography.Text>
            <Select
              options={spellSelectOptions}
              value={startingSpells?.[0].name}
              onChange={onStartingSpellChange}
            />
            {!!startingSpells?.length && (
              <Card
                title={
                  <span className="font-enchant text-3xl tracking-wide">
                    {startingSpells[1].name}
                  </span>
                }
                className="shadow-md"
              >
                <Flex
                  gap={16}
                  align="flex-start"
                  vertical={isMobile}
                  // className={descriptionClassNames}
                >
                  <Image src={spellImage} className="w-40" preview={false} />
                  <div>
                    <Descriptions
                      items={[
                        {
                          key: "1",
                          label: "Range",
                          children: startingSpells[1].range,
                        },
                        {
                          key: "2",
                          label: "Duration",
                          children: startingSpells[1].duration,
                        },
                      ]}
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: descriptionMarkdown,
                      }}
                      className="text-justify"
                    />
                  </div>
                </Flex>
              </Card>
            )}
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export default StepClass;
