import { Button, Form, Input, Modal } from "antd";
import CloseIcon from "../CloseIcon/CloseIcon";
import { GameData } from "../../data/definitions";
import { useEffect } from "react";

export default function NewGameModal({
  isNewGameModalOpen,
  handleCancel,
  addGameData,
}: {
  isNewGameModalOpen: boolean;
  handleCancel: () => void;
  addGameData: (gameData: GameData) => Promise<void>;
}) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    addGameData({ name: values.newGameTitle });
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal
      title="New Game"
      open={isNewGameModalOpen}
      onCancel={handleCancel}
      closeIcon={<CloseIcon />}
      footer={false}
    >
      <Form name="new_game_form" form={form} onFinish={onFinish}>
        <Form.Item
          label="Game Title"
          name="newGameTitle"
          rules={[
            {
              required: true,
              message: "Please input the title of the new game!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
