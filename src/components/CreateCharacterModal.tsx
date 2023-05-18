import { Button, Modal, Steps } from "antd";
import { useState } from "react";

const steps = [
  {
    title: "Roll for Ability Score",
    description: "Start by discovering your character's abilities",
    content: "foo",
  },
  {
    title: "Choose a Race",
    description: "Select an available Race",
    content: "bar",
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
    description: item.description,
  }));

  const handleOk = () => {
    props.setIsModalOpen(false);
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  return (
    <Modal
      title="Basic Modal"
      open={props.isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Steps current={current} items={items} />
      <div>{steps[current].content}</div>
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
