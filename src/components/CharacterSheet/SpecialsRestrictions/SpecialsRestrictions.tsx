import { List, Tabs, TabsProps, Typography } from "antd";
import { marked } from "marked";
import { SpecialsRestrictionsProps } from "./definitions";
import { classes } from "../../../data/classes";
import { races } from "../../../data/races";
import { ClassNames, RaceNames } from "../../../data/definitions";
import { titleCaseToCamelCase } from "../../../support/stringSupport";

// Ant Design's List component treats the input as a string and not as HTML.
// To render HTML, you need to use dangerouslySetInnerHTML prop in React.
// However, List.Item does not support dangerouslySetInnerHTML directly.
// To overcome this, HtmlRender component accepts the HTML string and renders it correctly.
const HtmlRender = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

const SpecialsRestrictionsList = ({ dataSource }: { dataSource: any[] }) => (
  <List
    bordered
    dataSource={dataSource}
    renderItem={(item) => (
      <List.Item>
        <HtmlRender html={marked(item)} />
      </List.Item>
    )}
    className="print:border-0"
    size="small"
  />
);

export default function SpecialsRestrictions({
  characterData,
  className,
}: SpecialsRestrictionsProps & React.ComponentPropsWithRef<"div">) {
  const items: TabsProps["items"] = [
    {
      key: titleCaseToCamelCase(characterData.race),
      label: characterData.race,
      children: (
        <SpecialsRestrictionsList
          dataSource={[
            ...(races[characterData.race as RaceNames].details?.specials || []),
            ...(races[characterData.race as RaceNames].details?.restrictions ||
              []),
          ]}
        />
      ),
    },
    ...characterData.class.map((cls) => ({
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

  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
