import { Typography } from "antd";
import { clsx } from "clsx";

export default function MissilesMiss() {
  const gridLayout = clsx("grid", "grid-cols-3", "grid-rows-5", "gap-[1px]");
  const gridItem = clsx(
    "[&>div]:bg-shipGray",
    "[&>div]:text-springWood",
    "[&>div]:text-center",
    "[&>div]:border",
    "[&>div]:border-seaBuckthorn",
    "[&>div]:border-solid",
    "[&>div]:py-1",
  );
  return (
    <>
      <div className="text-center">(behind)</div>
      <div className={`${gridLayout} ${gridItem}`}>
        <div className="col-start-2">0</div>
        <div className="col-start-1 row-start-2">7</div>
        <div className="col-start-2 row-start-2">8</div>
        <div className="col-start-3 row-start-2">9</div>
        <div className="col-start-1 row-start-3">5</div>
        <div className="col-start-2 row-start-3">Target</div>
        <div className="col-start-3 row-start-3">6</div>
        <div className="col-start-1 row-start-4">2</div>
        <div className="col-start-2 row-start-4">3</div>
        <div className="col-start-3 row-start-4">4</div>
        <div className="col-start-2 row-start-5">1</div>
      </div>
      <div className="text-center">(in front)</div>
      <Typography.Text type="secondary">
        Roll 1d10, and consult the diagram to determine where the missile hit.
        Each number represents a 10' square area.
      </Typography.Text>
    </>
  );
}
