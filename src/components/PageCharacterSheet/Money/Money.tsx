import React from "react";
import { Flex, Input } from "antd";
import { CostCurrency } from "@/data/definitions";
import { CharacterDataContext } from "@/store/CharacterContext";
import { useMoney } from "@/hooks/useMoney";
import { useDeviceType } from "@/hooks/useDeviceType";

const Money: React.FC<React.ComponentPropsWithRef<"div">> = ({ className }) => {
  const { isMobile } = useDeviceType();
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const {
    goldValue,
    setGoldValue,
    silverValue,
    setSilverValue,
    copperValue,
    setCopperValue,
    handleBlurAndEnter,
    handleChange,
    handleFocus,
  } = useMoney(character, setCharacter);
  return (
    <Flex className={className} gap={16} vertical={!isMobile}>
      {[
        ["gp", goldValue, setGoldValue, 1],
        ["sp", silverValue, setSilverValue, 10],
        ["cp", copperValue, setCopperValue, 100],
      ].map(([key, value, setFunc, multiplier]) => {
        const keyValue = key as CostCurrency;
        const setFuncTyped = setFunc as React.Dispatch<
          React.SetStateAction<string>
        >;
        const multiplierTyped = multiplier as number;

        return (
          <React.Fragment key={key as string}>
            <Input
              min={0}
              value={value as string}
              name={keyValue}
              onFocus={handleFocus}
              onChange={(e) => handleChange(e, setFuncTyped)}
              onBlur={() =>
                handleBlurAndEnter(
                  value as string,
                  setFuncTyped,
                  multiplierTyped,
                  keyValue,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBlurAndEnter(
                    value as string,
                    setFuncTyped,
                    multiplierTyped,
                    keyValue,
                  );
                }
              }}
              addonAfter={keyValue}
              disabled={!userIsOwner}
              id={keyValue}
            />
            <label htmlFor={key as string} className="hidden">
              {key as string}
            </label>
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default Money;
