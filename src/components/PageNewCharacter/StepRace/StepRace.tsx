import React from "react";
import { CharData, RaceNames } from "@/data/definitions";
import { Flex, SelectProps } from "antd";
import { getClassType, getRaceSelectOptions } from "@/support/characterSupport";
import { races } from "@/data/races";
import RaceClassSelector from "../RaceClassSelector/RaceClassSelector";
import RaceClassDescription from "../RaceClassDescription/RaceClassDescription";
import Options from "../StepClass/Options/Options";

interface StepRaceProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  setComboClass: (comboClass: boolean) => void;
  setComboClassSwitch: (comboClassSwitch: boolean) => void;
}

const StepRace: React.FC<
  StepRaceProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  setCharacter,
  setComboClass,
  setComboClassSwitch,
}) => {
  const [raceSelector, setRaceSelector] = React.useState<string>(
    character.race,
  );
  const [customRaceInput, setCustomRaceInput] = React.useState<string>("");
  const [supplementalContentSwitch, setSupplementalContentSwitch] =
    React.useState<boolean>(false);

  const raceSelectOptions: SelectProps["options"] = getRaceSelectOptions(
    character,
    !supplementalContentSwitch,
  );

  const handleSelectChange = (value: string) => {
    setRaceSelector(value);
    setComboClassSwitch(false);
  };

  const handleCustomRaceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCustomRaceInput(e.target.value);
    setCharacter({ ...character, race: e.target.value });
  };

  React.useEffect(() => {
    if (raceSelector !== "custom" && raceSelector !== "") {
      setCharacter({ ...character, race: raceSelector });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceSelector]);

  React.useEffect(
    () => {
      setComboClass(
        !!races[character.race as keyof typeof races]?.allowedCombinationClasses
          ?.length || false,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [character],
  );

  console.log(
    "raceSelector",
    raceSelector,
    !!raceSelector,
    getClassType([raceSelector]),
  );

  return (
    <Flex vertical className={className} gap={16}>
      <Options
        setComboClassSwitch={setComboClassSwitch}
        setSupplementalContentSwitch={setSupplementalContentSwitch}
        supplementalContentSwitch={supplementalContentSwitch}
      />
      <RaceClassSelector
        customInput={customRaceInput}
        handleCustomInputChange={handleCustomRaceInputChange}
        handleSelectChange={handleSelectChange}
        selectOptions={raceSelectOptions}
        selector={raceSelector}
        type="race"
      />
      {!!raceSelector && (
        <RaceClassDescription
          name={raceSelector}
          description={`${races[raceSelector as RaceNames]?.details
            ?.description}`}
        />
      )}
    </Flex>
  );
};

export default StepRace;
