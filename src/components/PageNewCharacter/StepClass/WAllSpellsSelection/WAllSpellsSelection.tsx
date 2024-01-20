import React from "react";
import spells from "@/data/spells.json";

interface WAllSpellsSelectionProps {}

console.log(spells);

const WAllSpellsSelection: React.FC<
  WAllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  return <div className={className}>WAllSpellsSelection</div>;
};

export default WAllSpellsSelection;
