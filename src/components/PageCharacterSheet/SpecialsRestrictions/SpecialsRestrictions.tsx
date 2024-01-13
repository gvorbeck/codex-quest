import React from "react";
import { Tabs, type TabsProps } from "antd";
import { ClassNames, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { classes } from "@/data/classes";
import SpecialsRestrictionsList from "../SpecialsRestrictionsList/SpecialsRestrictionsList";
import { titleCaseToCamelCase } from "@/support/stringSupport";
import { classSplit } from "@/support/characterSupport";
import { CharacterDataContext } from "@/contexts/CharacterContext";

const SpecialsRestrictions: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character } = React.useContext(CharacterDataContext);
  const classArr = classSplit(character.class);
  const items: TabsProps["items"] = [
    {
      key: titleCaseToCamelCase(character.race),
      label: character.race,
      children: (
        <SpecialsRestrictionsList
          dataSource={[
            ...(races[character.race as RaceNames]?.details?.specials || []),
            ...(races[character.race as RaceNames]?.details?.restrictions ||
              []),
          ]}
        />
      ),
    },
    ...classArr.map((cls) => ({
      key: titleCaseToCamelCase(cls),
      label: cls,
      children: (
        <SpecialsRestrictionsList
          dataSource={[
            ...(classes[cls as ClassNames].details?.specials || []),
            ...(classes[cls as ClassNames].details?.restrictions || []),
          ]}
        />
      ),
    })),
  ];
  return <Tabs defaultActiveKey="1" items={items} className={className} />;
};

export default SpecialsRestrictions;
