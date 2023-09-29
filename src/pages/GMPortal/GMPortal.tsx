import { UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useOutletContext } from "react-router-dom";

export default function GMPortal() {
  const outletContext = useOutletContext() as { className: string };

  return (
    <div className={`${outletContext.className} text-shipGray [&>*+*]:mt-4`}>
      <div className="flex gap-4 items-center">
        <Typography.Title
          level={2}
          className="m-0 font-enchant text-5xl tracking-wider text-shipGray"
        >
          GM Portal
        </Typography.Title>
        <Button type="primary" icon={<UsergroupAddOutlined />}>
          New Game
        </Button>
      </div>
      <div>
        {/*}
        <PlayerList />
        <AddPlayer />
        */}
      </div>
    </div>
  );
}
