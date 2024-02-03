import React from "react";

interface MonstersProps {}

const Monsters: React.FC<
  MonstersProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  return <div className={className}>Monsters</div>;
};

export default Monsters;
