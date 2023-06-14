import { Button, List, Typography } from "antd";
import { CharacterDetails } from "../types";
import { useState } from "react";

export default function Spells({ character }: CharacterDetails) {
  const [selectedSpell, setSelectedSpell] = useState<number | null>(null);
  return (
    <List
      dataSource={character.spells}
      renderItem={(item, index) => (
        <List.Item className="flex-col items-baseline">
          <Typography.Paragraph className="font-bold mb-3">
            {item.name}
          </Typography.Paragraph>
          <div className="flex flex-col text-right italic w-full">
            {item.range && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Range&nbsp;
                </Typography.Text>
                {item.range}
              </Typography.Text>
            )}
            {item.duration && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Duration&nbsp;
                </Typography.Text>
                {item.duration}
              </Typography.Text>
            )}
          </div>
          <Button
            type="primary"
            onClick={() =>
              setSelectedSpell(selectedSpell === index ? null : index)
            }
          >
            {selectedSpell === index ? "Hide Description" : "Show Description"}
          </Button>
          {selectedSpell === index && (
            <div className="mt-4">{item.description}</div>
          )}
        </List.Item>
      )}
    />
  );
}
