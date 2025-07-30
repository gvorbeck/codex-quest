import { CharacterDataContext } from "@/store/CharacterContext";
import { Flex, Input } from "antd";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MoneyProps {}

const Money: React.FC<MoneyProps & React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character, characterDispatch, userIsOwner } =
    React.useContext(CharacterDataContext);
  const [gold, setGold] = React.useState(character.gold.toString());
  const [silver, setSilver] = React.useState(character.silver?.toString() || 0);
  const [copper, setCopper] = React.useState(character.copper?.toString() || 0);
  const [electrum, setElectrum] = React.useState(
    character.electrum?.toString() || 0,
  );
  const [platinum, setPlatinum] = React.useState(
    character.platinum?.toString() || 0,
  );

  React.useEffect(() => {
    setGold(character.gold.toString());
    setSilver(character.silver?.toString() || "0");
    setCopper(character.copper?.toString() || "0");
    setElectrum(character.electrum?.toString() || "0");
    setPlatinum(character.platinum?.toString() || "0");
  }, [
    character.gold,
    character.silver,
    character.copper,
    character.electrum,
    character.platinum,
  ]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "gold") {
      setGold(value);
    } else if (name === "silver") {
      setSilver(value);
    } else if (name === "copper") {
      setCopper(value);
    } else if (name === "electrum") {
      setElectrum(value);
    } else if (name === "platinum") {
      setPlatinum(value);
    }
  };

  const handleBlurOrEnter = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = handleArithmetic(
      value,
      character[name as "gold" | "silver" | "copper" | "electrum" | "platinum"],
    );

    if (name === "gold") {
      setGold(numericValue.toString());
    } else if (name === "silver") {
      setSilver(numericValue.toString());
    } else if (name === "copper") {
      setCopper(numericValue.toString());
    } else if (name === "electrum") {
      setElectrum(numericValue.toString());
    } else if (name === "platinum") {
      setPlatinum(numericValue.toString());
    }

    characterDispatch({
      type: "UPDATE",
      payload: {
        [name]: numericValue,
      },
    });
  };

  if (character.gold % 1 !== 0) {
    const [gold, silver, copper] = updateCurrency();
    characterDispatch({
      type: "UPDATE",
      payload: {
        gold,
        silver,
        copper,
      },
    });
  }

  if (character.platinum === undefined || character.electrum === undefined) {
    characterDispatch({
      type: "UPDATE",
      payload: {
        platinum: 0,
        electrum: 0,
      },
    });
  }

  const moneyData = [
    { state: gold, name: "gold", addOn: "GP" },
    { state: silver, name: "silver", addOn: "SP" },
    { state: copper, name: "copper", addOn: "CP" },
    { state: electrum, name: "electrum", addOn: "EP" },
    { state: platinum, name: "platinum", addOn: "PP" },
  ];

  const moneyInputs = moneyData.map((data) => (
    <Input
      key={data.name}
      min="0"
      disabled={!userIsOwner}
      value={data.state}
      name={data.name}
      addonAfter={data.addOn}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlurOrEnter}
      onPressEnter={(e) =>
        handleBlurOrEnter(e as unknown as React.FocusEvent<HTMLInputElement>)
      }
    />
  ));

  if (character.useCoinWeight === undefined) {
    characterDispatch({
      type: "UPDATE",
      payload: {
        useCoinWeight: true,
      },
    });
  }

  return (
    <Flex vertical gap={8} className={className}>
      {moneyInputs}
    </Flex>
  );
};

export default Money;
