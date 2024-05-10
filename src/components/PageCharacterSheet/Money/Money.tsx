import { CharacterDataContext } from "@/store/CharacterContext";
import { Flex, Input } from "antd";
import React from "react";

interface MoneyProps {}

const Money: React.FC<MoneyProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const [gold, setGold] = React.useState(character.gold.toString());
  const [silver, setSilver] = React.useState(character.silver.toString());
  const [copper, setCopper] = React.useState(character.copper.toString());

  function updateCurrency() {
    let gold = character.gold;
    let silver = character.silver || 0;
    let copper = character.copper || 0;

    if (gold % 1 !== 0) {
      // Check if there's a fractional part
      const parts = gold.toString().split(".");
      const goldPart = parseInt(parts[0]);
      const silverPart = parseFloat("0." + parts[1]) * 10;

      const integerSilver = Math.floor(silverPart);
      const copperPart = (silverPart - integerSilver) * 10;

      // Update values
      gold = goldPart; // Update gold to be only the integer part
      silver += integerSilver; // Add calculated silver to existing silver
      copper += Math.round(copperPart); // Add calculated copper to existing copper, rounded to nearest whole

      // Handle overflows from copper to silver
      if (copper >= 10) {
        silver += Math.floor(copper / 10);
        copper = copper % 10;
      }

      // Handle overflows from silver to gold
      if (silver >= 10) {
        gold += Math.floor(silver / 10);
        silver = silver % 10;
      }
    }
    return [gold, silver, copper];
  }

  function handleArithmetic(value: string, current: number): number {
    if (value.startsWith("+") || value.startsWith("-")) {
      const modifier = parseInt(value.slice(1), 10);
      return value.startsWith("+")
        ? current + modifier
        : Math.max(current - modifier, 0);
    }
    return parseInt(value, 10) || 0; // Convert to number and handle NaN by returning 0
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setTimeout(() => {
      e.target.select();
    }, 50);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGold(value); // Update the input state with the raw string
  }

  function handleBlurOrEnter() {
    // Convert the input string to a number when focus is lost or enter is pressed
    const newValue = handleArithmetic(gold, character.gold);
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      gold: newValue,
    }));
    setGold(newValue.toString()); // Update the input state with the new number
  }

  if (character.gold % 1 !== 0) {
    const [gold, silver, copper] = updateCurrency();
    setCharacter((prevCharacter) => ({
      ...prevCharacter,
      gold,
      silver,
      copper,
    }));
  }

  const moneyData = [
    { state: gold, name: "gold", addOn: "GP" },
    { state: silver, name: "silver", addOn: "SP" },
    { state: copper, name: "copper", addOn: "CP" },
  ];

  const moneyInputs = moneyData.map((data) => (
    <Input
      key={data.name}
      min="0"
      value={data.state}
      name={data.name}
      addonAfter={data.addOn}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlurOrEnter}
      onPressEnter={handleBlurOrEnter}
    />
  ));

  return (
    <Flex vertical gap={8} className={className}>
      {moneyInputs}
    </Flex>
  );
};

export default Money;
// import React from "react";
// import { Flex, Input } from "antd";
// import { CostCurrency } from "@/data/definitions";
// import { CharacterDataContext } from "@/store/CharacterContext";
// import { useMoney } from "@/hooks/useMoney";
// import { useDeviceType } from "@/hooks/useDeviceType";
// // get rid of auto change. create silver and copper fields in CharData. Perform a check to see if those values exist and if not use the gold field's decimal values to calculate the silver and copper values. If they do exist, use those values to calculate the gold value.
// const Money: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
//   const { isMobile } = useDeviceType();
//   const { character, setCharacter, userIsOwner } =
//     React.useContext(CharacterDataContext);
//   const {
//     goldValue,
//     setGoldValue,
//     silverValue,
//     setSilverValue,
//     copperValue,
//     setCopperValue,
//     handleBlurAndEnter,
//     handleChange,
//     handleFocus,
//   } = useMoney(character, setCharacter);
//   return (
//     <Flex className={className} gap={16} vertical={!isMobile}>
//       {[
//         ["gp", goldValue, setGoldValue, 1],
//         ["sp", silverValue, setSilverValue, 10],
//         ["cp", copperValue, setCopperValue, 100],
//       ].map(([key, value, setFunc, multiplier]) => {
//         const keyValue = key as CostCurrency;
//         const setFuncTyped = setFunc as React.Dispatch<
//           React.SetStateAction<string>
//         >;
//         const multiplierTyped = multiplier as number;

//         return (
//           <React.Fragment key={key as string}>
//             <Input
//               min={0}
//               value={value as string}
//               name={keyValue}
//               onFocus={handleFocus}
//               onChange={(e) => handleChange(e, setFuncTyped)}
//               onBlur={() =>
//                 handleBlurAndEnter(
//                   value as string,
//                   setFuncTyped,
//                   multiplierTyped,
//                   keyValue,
//                 )
//               }
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleBlurAndEnter(
//                     value as string,
//                     setFuncTyped,
//                     multiplierTyped,
//                     keyValue,
//                   );
//                 }
//               }}
//               addonAfter={keyValue}
//               disabled={!userIsOwner}
//               id={keyValue}
//             />
//             <label htmlFor={key as string} className="hidden">
//               {key as string}
//             </label>
//           </React.Fragment>
//         );
//       })}
//     </Flex>
//   );
// };

// export default Money;
