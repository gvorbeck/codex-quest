import { Abilities, CharData } from "@/data/definitions";
import { rollDice } from "@/support/diceSupport";
import { Button, InputNumber, Space } from "antd";

interface AbilityRollerProps {
  ability: keyof Abilities;
  character: CharData;
  newCharacter?: boolean;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

function calculateModifier(score: number) {
  let modifier;
  if (score === null) modifier = "";
  if (score === 3) modifier = "-3";
  else if (score <= 5) modifier = "-2";
  else if (score <= 8) modifier = "-1";
  else if (score <= 12) modifier = "+0";
  else if (score <= 15) modifier = "+1";
  else if (score <= 17) modifier = "+2";
  else if (score === 18) modifier = "+3";
  return modifier;
}

const AbilityRoller: React.FC<
  AbilityRollerProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, newCharacter, ability }) => {
  function handleChange(value: number | null) {
    if (value === null) return;
    setCharacter((prevCharacter) => {
      return {
        ...prevCharacter,
        abilities: {
          scores: {
            ...prevCharacter.abilities.scores,
            [ability]: value,
          },
          modifiers: {
            ...prevCharacter.abilities.modifiers,
            [ability]: calculateModifier(value),
          },
        },
        // New Character resets to prevent exploits.
        race: newCharacter ? "" : prevCharacter.race,
        class: newCharacter ? [] : [...prevCharacter.class],
        hp: newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...prevCharacter.hp },
      };
    });
  }

  function handleFocus() {}

  function handleClick() {
    const rolledScore = rollDice("3d6");
    handleChange(rolledScore);
  }

  return (
    <Space.Compact className={className}>
      <InputNumber
        max={18}
        min={3}
        value={character.abilities.scores[ability] as number}
        onChange={handleChange}
        onFocus={handleFocus}
        type="number"
        className="pb-0.5"
      />
      {newCharacter && (
        <Button type="primary" onClick={handleClick}>
          Roll 3d6
        </Button>
      )}
    </Space.Compact>
  );
};

export default AbilityRoller;
// import { Space, InputNumber, Button } from "antd";
// import { AbilityRecord, CharData } from "@/data/definitions";
// import { rollDice } from "@/support/diceSupport";
// import { getModifier } from "@/support/statSupport";
// import { updateCharacter } from "@/support/pageNewCharacterSupport";

// type AbilityRollerProps = {
//   abilityValue: number;
//   character: CharData;
//   setCharacter: (character: CharData) => void;
//   record: AbilityRecord;
//   newCharacter?: boolean;
// };

// export default function AbilityRoller({
//   abilityValue,
//   record,
//   character,
//   setCharacter,
//   newCharacter,
// }: AbilityRollerProps) {
//   const rollAbilityScore = (ability: string, score?: number) => {
//     const newScore = score || rollDice("3d6");
//     const modifier = getModifier(newScore);
//     updateCharacter(
//       { [ability]: newScore },
//       { [ability]: modifier },
//       character,
//       setCharacter,
//       newCharacter,
//     );
//   };

//   const onChange = (value: number | null) => {
//     if (value === null) return;
//     if (value < 3) value = 3;
//     if (value > 18) value = 18;
//     rollAbilityScore(record.ability.toLowerCase(), value);
//   };

//   const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
//     event.target.select();
//   };

//   return (
//     <Space.Compact>
//       <InputNumber
//         id={record.ability.toLowerCase()}
//         max={18}
//         min={3}
//         defaultValue={0}
//         onChange={(event) => onChange(event)}
//         onFocus={handleFocus}
//         type="number"
//         value={abilityValue}
//         className="w-[50px] [&_input]:pl-2"
//       />
//       <Button
//         type="primary"
//         onClick={() => rollAbilityScore(record.ability.toLowerCase())}
//         className="px-2 shadow-none"
//       >
//         Roll 3d6
//       </Button>
//     </Space.Compact>
//   );
// }
