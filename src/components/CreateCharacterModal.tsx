import { useState } from "react";
import { Button, Modal, Steps, Typography } from "antd";
import CharAbilityScoreStep from "./CreateCharacterSteps/CharAbilityScoreStep";

const { Title } = Typography;

const steps = [
  {
    title: "Ability Scores",
    fullTitle: "Roll for Ability Scores",
    description: "Roll for your character's Abilities",
    content: <CharAbilityScoreStep />,
  },
  {
    title: "Race",
    fullTitle: "Choose a Race",
    description: "Select an available Race",
    content: "bar",
  },
  {
    title: "Class",
    fullTitle: "Choose a Class",
    description: "Select an available Class",
    content: "goo",
  },
  {
    title: "Hit Points",
    fullTitle: "Roll for Hit Points",
    description: "Roll for your character's Hit Points",
    content: "car",
  },
  {
    title: "Equipment",
    fullTitle: "Buy Equipment",
    description: "Equip your character",
    content: "hoo",
  },
  {
    title: "Name",
    fullTitle: "Name your character",
    description: "Give your character a name",
    content: "dar",
  },
];

type CreateCharacterModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function CreateCharacterModal(props: CreateCharacterModalProps) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <Modal
      title="Basic Modal"
      open={props.isModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <Steps current={current} items={items} />
      <section>
        <Title level={1}>{steps[current].fullTitle}</Title>
        <Title level={2}>{steps[current].description}</Title>
        {steps[current].content}
      </section>
      <div>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => console.log("foo")}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
}
