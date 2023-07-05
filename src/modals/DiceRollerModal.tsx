import { Button, Divider, Input, Modal, Space, Typography } from "antd";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { DiceRollerModalProps } from "./definitions";
import { useState, useRef } from "react";
import { InputRef } from "antd/lib/input";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

export default function DiceRollerModal({
  isDiceRollerModalOpen,
  handleCancel,
}: DiceRollerModalProps) {
  const [diceFormula, setDiceFormula] = useState<[number, number][]>([]);
  const inputRef = useRef<InputRef>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { textContent: die } = event.currentTarget as HTMLButtonElement;
    setDiceFormula((prevFormula) =>
      prevFormula.filter(([count, type]) => type !== +die!.split("d")[1])
    );
  };

  const DiceButton = ({ die }: { die: string }) => {
    const [dieCount, setDieCount] = useState(0);

    const handleLeftClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const { textContent: die } = event.currentTarget as HTMLButtonElement;
      const newDieCount = dieCount + 1;

      if (
        die &&
        diceFormula.some((dice) => dice.includes(+die!.split("d")[1]))
      ) {
        setDiceFormula((prevFormula) =>
          prevFormula.map((dice) =>
            dice.includes(+die!.split("d")[1]) ? [dice[0] + 1, dice[1]] : dice
          )
        );
      } else if (die) {
        setDiceFormula((prevFormula) => [
          ...prevFormula,
          [1, +die!.split("d")[1]],
        ]);
      }
      setDieCount(newDieCount);
    };

    return (
      <Button
        onAuxClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          setDieCount(0);
          handleContextMenu(event);
        }}
        onClick={(event) =>
          handleLeftClick(event as React.MouseEvent<HTMLButtonElement>)
        }
        onContextMenu={handleContextMenu}
        type="primary"
      >
        {`${dieCount > 0 ? dieCount : ""}${die}`}
      </Button>
    );
  };

  const handleRollClick = () => {
    if (inputRef.current && inputRef.current.input) {
      const result = roller.roll(inputRef.current.input.value).total;
      console.log(result);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return (
    <Modal
      title="Virtual Dice"
      open={isDiceRollerModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<ModalCloseIcon />}
      className="text-shipGray"
    >
      <Space.Compact className="w-full">
        <Input
          ref={inputRef}
          placeholder="Enter a dice formula to roll"
          value={diceFormula
            .map(([count, type]) => `${count}d${type}`)
            .join("+")}
          onChange={handleInputChange}
        />
        <Button type="primary" onClick={handleRollClick}>
          Roll
        </Button>
      </Space.Compact>
      <div className="flex justify-between my-4">
        <DiceButton die="d4" />
        <DiceButton die="d6" />
        <DiceButton die="d8" />
        <DiceButton die="d10" />
        <DiceButton die="d12" />
        <DiceButton die="d20" />
      </div>
      <Divider />
      <Typography.Paragraph type="secondary">
        Click to add a die to the formula. Right click to remove a die.
        Optionally, you can type a formula in the input box.
      </Typography.Paragraph>
    </Modal>
  );
}
