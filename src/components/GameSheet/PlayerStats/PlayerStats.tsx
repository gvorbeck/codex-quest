import React from "react";
import { Abilities, CharacterData } from "../../../data/definitions";
import { Button, Card, Descriptions, Typography } from "antd";
import { openInNewTab } from "../../../support/helpers";

interface PlayerStatsProps {
  player: CharacterData | undefined;
  userId: string;
  characterId: string;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  player,
  userId,
  characterId,
}) => {
  return (
    <>
      {player && (
        <Card
          title={player.name}
          extra={
            <Button
              type="primary"
              onClick={() => openInNewTab(`/u/${userId}/c/${characterId}`)}
            >
              Sheet
            </Button>
          }
        >
          <Descriptions></Descriptions>
          <div className="flex gap-2">
            {Object.entries(player.abilities.scores).map((ability) => {
              const key = ability[0] as keyof Abilities;
              return (
                <div
                  key={key}
                  className="flex flex-1 flex-col bg-shipGray text-springWood px-3 py-2 rounded text-center gap-1"
                >
                  <Typography.Text className="uppercase font-bold text-inherit">
                    {key.slice(0, 3)}
                  </Typography.Text>
                  <Typography.Text className="text-inherit">
                    {ability[1]}
                  </Typography.Text>
                  <Typography.Text className="text-inherit text-xs">
                    {player.abilities.modifiers[key]}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
};

export default PlayerStats;
