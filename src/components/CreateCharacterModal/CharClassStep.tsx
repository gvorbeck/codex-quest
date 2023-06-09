import { Checkbox, Col, Radio, Row, Space, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect } from "react";
import { CharClassStepProps } from "../types";
import spellsData from "../../data/spells.json";

const classChoices = ["Cleric", "Fighter", "Magic-User", "Thief"];
const readMagic = spellsData.filter((spell) => spell.name === "Read Magic");
const classDetails = {
  cleric: {
    specials: [
      "Clerics can cast spells of divine nature starting at 2nd level",
      "Clerics have the power to Turn the Undead",
    ],
    restrictions: [
      "Clerics may wear any armor, but may only use blunt weapons (specifically including warhammer, mace, maul, club, quarterstaff, and sling)",
    ],
  },
  fighter: {
    specials: [
      "Although they are not skilled in the ways of magic, Fighters can nonetheless use many magic items, including but not limited to magical weapons and armor",
    ],
    restrictions: [],
  },
  "magic-user": {
    specials: [
      "Magic-User begins play knowing read magic and one other spell of first level",
    ],
    restrictions: [
      "The only weapons they become proficient with are the dagger and the walking staff (or cudgel)",
      "Magic-Users may not wear armor of any sort nor use a shield as such things interfere with spellcasting",
    ],
  },
  thief: {
    specials: ["Thieves have a number of special abilities (see table)"],
    restrictions: [
      "Thieves may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort",
    ],
  },
};

export default function CharClassStep({
  characterData,
  setCharacterData,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
  selectedSpell,
  setSelectedSpell,
}: CharClassStepProps) {
  // const [firstSpell, setFirstSpell] = useState<SpellType | null>(null);

  useEffect(() => {
    if (comboClass) {
      const firstClass =
        checkedClasses[0]?.toLowerCase() as keyof typeof classDetails;
      const secondClass =
        checkedClasses[1]?.toLowerCase() as keyof typeof classDetails;
      const firstClassRestrictions = firstClass
        ? classDetails[firstClass].restrictions
        : [];
      const firstClassSpecials = firstClass
        ? classDetails[firstClass].specials
        : [];
      const secondClassRestrictions = secondClass
        ? classDetails[secondClass].restrictions
        : [];
      const secondClassSpecials = secondClass
        ? classDetails[secondClass].specials
        : [];

      setCharacterData({
        ...characterData,
        class: checkedClasses.join(" "),
        restrictions: {
          race: characterData.restrictions.race,
          class: [...firstClassRestrictions, ...secondClassRestrictions],
        },
        specials: {
          race: characterData.specials.race,
          class: [...firstClassSpecials, ...secondClassSpecials],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedClasses, comboClass]);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedClasses([...checkedClasses, e.target.value]);
    } else {
      setCheckedClasses(
        checkedClasses.filter((item) => item !== e.target.value)
      );
    }
    setCharacterData({
      ...characterData,
      hp: { dice: "", points: 0, max: 0, desc: "" },
    });
  };

  const onClassRadioChange = (e: RadioChangeEvent) => {
    const classValue = e.target.value;
    setSelectedSpell(null);
    const spells = classValue === "Magic-User" ? readMagic : [];
    const thisClass = e.target.value
      .toString()
      .toLowerCase() as keyof typeof classDetails;

    setCharacterData({
      ...characterData,
      class: classValue,
      hp: { dice: "", points: 0, max: 0, desc: "" },
      spells,
      restrictions: {
        race: characterData.restrictions.race,
        class: [...classDetails[thisClass].restrictions],
      },
      specials: {
        race: characterData.specials.race,
        class: [...classDetails[thisClass].specials],
      },
    });
  };

  const onSpellRadioChange = (e: RadioChangeEvent) => {
    const foundSpell = spellsData.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setSelectedSpell(foundSpell);
      setCharacterData({
        ...characterData,
        spells: [...readMagic, foundSpell],
      });
    }
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked !== comboClass) {
      // Only update the playerClass if the switch has actually been toggled
      // Clear whenever the switch is clicked
      setCheckedClasses([]);
      setCharacterData({
        ...characterData,
        class: "",
        hp: { dice: "", points: 0, max: 0, desc: "" },
      });
    }
    setComboClass(checked);
  };

  return (
    <>
      {characterData.race === "Elf" && (
        <div>
          <Switch
            checked={comboClass}
            onChange={onSwitchChange}
            unCheckedChildren="Single Class"
            checkedChildren="Combination Class"
          />
        </div>
      )}
      <Row className="mt-6">
        <Col span={4}>
          {comboClass ? (
            <Space direction="vertical">
              {classChoices.map((choice) => (
                <Checkbox
                  key={choice}
                  onChange={onCheckboxChange}
                  value={choice}
                  checked={checkedClasses.includes(choice)}
                  disabled={
                    choice === "Cleric" ||
                    (choice === "Fighter" &&
                      checkedClasses.includes("Thief")) ||
                    (choice === "Thief" &&
                      checkedClasses.includes("Fighter")) ||
                    (choice === "Fighter" &&
                      +characterData.abilities.scores.strength < 9) ||
                    (choice === "Magic-User" &&
                      +characterData.abilities.scores.intelligence < 9) ||
                    (choice === "Thief" &&
                      +characterData.abilities.scores.dexterity < 9)
                  }
                >
                  {choice}
                </Checkbox>
              ))}
            </Space>
          ) : (
            <Radio.Group
              value={characterData.class}
              onChange={onClassRadioChange}
            >
              <Space direction="vertical">
                {classChoices.map((choice) => (
                  <Radio
                    key={choice}
                    value={choice}
                    disabled={
                      (characterData.race === "Dwarf" &&
                        choice === "Magic-User") ||
                      (characterData.race === "Halfling" &&
                        choice === "Magic-User") ||
                      (choice === "Cleric" &&
                        +characterData.abilities.scores.wisdom < 9) ||
                      (choice === "Fighter" &&
                        +characterData.abilities.scores.strength < 9) ||
                      (choice === "Magic-User" &&
                        +characterData.abilities.scores.intelligence < 9) ||
                      (choice === "Thief" &&
                        +characterData.abilities.scores.dexterity < 9)
                    }
                  >
                    {choice}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}
        </Col>
        <Col span={20}>
          {characterData.class.includes("Magic-User") && (
            <Radio.Group
              onChange={onSpellRadioChange}
              value={selectedSpell ? selectedSpell.name : null}
              className="flex flex-wrap items-center gap-2 border-0 border-solid border-l-zorba border-l-2 pl-7"
            >
              {/* <Space direction="vertical"> */}
              {spellsData
                .filter(
                  (spell) =>
                    spell.level["magic-user"] === 1 &&
                    spell.name !== "Read Magic"
                )
                .map((spell) => (
                  <Radio
                    key={spell.name}
                    value={spell.name}
                    className="flex-25"
                  >
                    {spell.name}
                  </Radio>
                ))}
              {/* </Space> */}
            </Radio.Group>
          )}
        </Col>
      </Row>
    </>
  );
}
