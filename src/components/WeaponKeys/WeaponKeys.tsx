import { Descriptions } from "antd";

export default function WeaponKeys({
  className,
}: React.ComponentPropsWithRef<"div">) {
  return (
    <Descriptions size="small" column={1} className={className}>
      <Descriptions.Item label="**">
        This weapon only does subduing damage
      </Descriptions.Item>
      <Descriptions.Item label="(E)">
        Entangling: This weapon may be used to snare or hold opponents.
      </Descriptions.Item>
      <Descriptions.Item label="†">
        Silver tip or blade, for use against lycanthropes.
      </Descriptions.Item>
    </Descriptions>
  );
}
