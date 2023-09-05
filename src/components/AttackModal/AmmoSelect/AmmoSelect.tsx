import { Select } from "antd";
import { AmmoSelectProps } from "./definitions";

export default function AmmoSelect({
  ammo,
  equipment,
  setAmmo,
}: AmmoSelectProps) {
  const options = ammo
    .map((ammoItem) => {
      const item = equipment.find((item) => item.name === ammoItem);
      return item
        ? { value: ammoItem, label: `${ammoItem} (${item.amount})` }
        : null;
    })
    .filter(
      (option): option is { value: string; label: string } => option !== null
    );

  const handleAmmoChange = (value: string) => {
    const selectedAmmoItem = equipment.find((item) => item.name === value);
    if (selectedAmmoItem) {
      setAmmo(selectedAmmoItem);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <label htmlFor="ammo">Ammunition</label>
      <Select id="ammo" options={options} onChange={handleAmmoChange} />
    </div>
  );
}
