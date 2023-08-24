import { Checkbox } from "antd";
import { ClassNamesTwo, classes } from "../../../../data/classes";
import { CombinationClassOptionsProps } from "./definitions";
import { races } from "../../../../data/races";
import { CheckboxChangeEvent } from "antd/es/checkbox";

export default function CombinationClassOptions({
  characterData,
  setCharacterData,
  checkedClasses,
  setCheckedClasses,
  raceKey,
}: CombinationClassOptionsProps) {
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

  const shouldDisableCheckbox = (
    checkedClasses: string[],
    className: string
  ) => {
    if (
      checkedClasses.includes(ClassNamesTwo.FIGHTER) &&
      className === ClassNamesTwo.THIEF
    ) {
      return true;
    }
    if (
      checkedClasses.includes(ClassNamesTwo.THIEF) &&
      className === ClassNamesTwo.FIGHTER
    ) {
      return true;
    }
    if (checkedClasses.length >= 2 && !checkedClasses.includes(className)) {
      return true;
    }
    return false;
  };

  return (
    <div className="grid gap-2 pl-4">
      {Object.values(classes).map(
        (choice) =>
          choice.name !== ClassNamesTwo.CUSTOM && (
            <Checkbox
              key={choice.name}
              onChange={onCheckboxChange}
              value={choice.name}
              checked={checkedClasses.includes(choice.name)}
              disabled={
                !races[raceKey]?.allowedCombinationClasses?.find(
                  (comboClassName) => choice.name === comboClassName
                ) || shouldDisableCheckbox(checkedClasses, choice.name)
              }
            >
              {choice.name}
            </Checkbox>
          )
      )}
    </div>
  );
}
