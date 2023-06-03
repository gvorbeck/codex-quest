import { CharacterDetails } from "../types";
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { CheckCircleTwoTone, EditTwoTone } from "@ant-design/icons";

export default function Description({
  character,
  setCharacter,
}: CharacterDetails) {
  const [editMode, setEditMode] = useState(false);
  const handleToggleEditMode = () => setEditMode(!editMode);
  return editMode ? (
    <div>
      <p>goodbye world</p>
      <Tooltip title="Save">
        <Button
          type="ghost"
          shape="circle"
          icon={<CheckCircleTwoTone />}
          onClick={handleToggleEditMode}
        />
      </Tooltip>
    </div>
  ) : (
    <div>
      <p>hello world</p>
      <Tooltip title="Edit">
        <Button
          type="ghost"
          shape="circle"
          icon={<EditTwoTone />}
          onClick={handleToggleEditMode}
        />
      </Tooltip>
    </div>
  );
}
