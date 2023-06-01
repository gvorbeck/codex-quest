import { Table } from "antd";
import { CharacterDetails } from "../types";

export default function AttackBonus({
  character,
  setCharacter,
}: CharacterDetails) {
  function getAttackBonus() {
    const attackBonusTable: Record<string, number[]> = {
      Fighter: [
        0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10,
      ],
      Cleric: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
      "Magic-User": [
        0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7,
      ],
      Thief: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    };

    let classes = Object.keys(attackBonusTable);
    let maxAttackBonus = 0;

    for (let i = 0; i < classes.length; i++) {
      if (character.class.includes(classes[i])) {
        let attackBonus = attackBonusTable[classes[i]][character.level];
        if (attackBonus > maxAttackBonus) {
          maxAttackBonus = attackBonus;
        }
      }
    }

    return maxAttackBonus;
  }
  const dataSource = [
    { key: 1, label: "Attack Bonus", bonus: getAttackBonus() },
    {
      key: 2,
      label: "Melee Attack Bonus",
      bonus: getAttackBonus() + +character.abilities.modifiers.strength,
    },
    {
      key: 3,
      label: "Ranged Attack Bonus",
      bonus: getAttackBonus() + +character.abilities.modifiers.dexterity,
    },
  ];
  const columns = [
    { title: "Bonus", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "bonus", key: "bonus" },
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      showHeader={false}
      pagination={false}
    />
  );
}
