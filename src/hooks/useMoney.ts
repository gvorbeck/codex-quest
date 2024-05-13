import { CharData, CostCurrency } from "@/data/definitions";
import React from "react";

export function useMoney(
  character: CharData | null,
  setCharacter: (character: CharData) => void,
) {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setFunc(event.target.value);
  };

  const makeChange = () => {
    if (character) {
      let copper = character.gold * 100;
      const goldPieces = Math.floor(copper / 100);
      copper %= 100;
      const silverPieces = Math.floor(copper / 10);
      copper %= 10;
      const copperPieces = copper;

      return {
        gp: Math.round(goldPieces),
        sp: Math.round(silverPieces),
        cp: Math.round(copperPieces),
      };
    } else {
      // default object when characterData is null/undefined
      return { gp: 0, sp: 0, cp: 0 };
    }
  };
  const { gp, sp, cp } = makeChange();
  const [goldValue, setGoldValue] = React.useState(gp.toString());
  const [silverValue, setSilverValue] = React.useState(sp.toString());
  const [copperValue, setCopperValue] = React.useState(cp.toString());

  const handleUpdate = async (
    valueToSet: number,
    originalValue: number,
    multiplier: number,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (isNaN(valueToSet) || !setCharacter || !character) return;

    const newGoldValue =
      character.gold + (valueToSet - originalValue) / multiplier;
    setFunc(valueToSet.toString());
    setCharacter({
      ...character,
      gold: newGoldValue,
    });
  };

  const handleInputBlur = async (
    newValue: string,
    originalValue: number,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
    multiplier: number,
  ) => {
    let valueToSet: number = NaN;

    if (newValue.startsWith("+") || newValue.startsWith("-")) {
      const delta = parseInt(newValue.slice(1));
      if (isNaN(delta)) return;
      valueToSet = newValue.startsWith("+")
        ? originalValue + delta
        : Math.max(originalValue - delta, 0);
    } else {
      const value = parseInt(newValue);
      if (isNaN(value) || value < 0) return;
      valueToSet = value;
    }

    await handleUpdate(valueToSet, originalValue, multiplier, setFunc);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.select();
    }, 50);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    handleInputChange(e, setFunc);
  };

  const handleBlurAndEnter = (
    value: string,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
    multiplier: number,
    key: CostCurrency,
  ) => {
    const originalValue = (makeChange() as { [key: string]: number })[key];
    handleInputBlur(value, originalValue, setFunc, multiplier);
  };

  React.useEffect(() => {
    const { gp, sp, cp } = makeChange();
    setGoldValue(gp.toString());
    setSilverValue(sp.toString());
    setCopperValue(cp.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.gold]);

  return {
    goldValue,
    setGoldValue,
    silverValue,
    setSilverValue,
    copperValue,
    setCopperValue,
    handleFocus,
    handleChange,
    handleBlurAndEnter,
  };
}
