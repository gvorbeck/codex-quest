import { Button, Form, Input, Modal } from "antd";
import CloseIcon from "../CloseIcon/CloseIcon";

export default function NewGameModal({
  isNewGameModalOpen,
  handleCancel,
}: {
  isNewGameModalOpen: boolean;
  handleCancel: () => void;
}) {
  const onFinish = (values: any) => {
    console.log("Received values:", values);
  };
  return (
    <Modal
      title="New Game"
      open={isNewGameModalOpen}
      onCancel={handleCancel}
      closeIcon={<CloseIcon />}
    >
      <Form name="new_game_form" onFinish={onFinish}>
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
