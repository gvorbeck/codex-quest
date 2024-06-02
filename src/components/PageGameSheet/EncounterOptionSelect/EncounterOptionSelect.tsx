import {
  EncounterDetails,
  EncounterEnvironment,
  Monster,
} from "@/data/definitions";
import { getEncounter } from "@/support/encounterSupport";
import { Button, Select, SelectProps, Typography } from "antd";

interface EncounterOptionSelectProps {
  label: string;
  options: SelectProps["options"];
  placeholder: string;
  onChange: (value: string) => void;
  value: string | undefined;
  type: EncounterEnvironment;
  typeOption: EncounterDetails;
  setResults: React.Dispatch<
    React.SetStateAction<string | Monster | undefined>
  >;
}

const EncounterOptionSelect: React.FC<EncounterOptionSelectProps> = ({
  label,
  options,
  placeholder,
  onChange,
  value,
  type,
  typeOption,
  setResults,
}) => {
  const handleGenerateClick = () =>
    setResults(getEncounter(type, typeOption) as any);

  return (
    <div>
      <Typography.Text className="block">{label}</Typography.Text>
      <Select
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <Button
        type="primary"
        className="mt-4 block"
        onClick={handleGenerateClick}
      >
        Generate Encounter
      </Button>
    </div>
  );
};

export default EncounterOptionSelect;
