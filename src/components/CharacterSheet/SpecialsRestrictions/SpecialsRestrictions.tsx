import { List, Typography } from "antd";
import { SpecialsRestrictionsProps } from "./definitions";
import { ClassNamesTwo, classes } from "../../../data/classes";
import { RaceNamesTwo, races } from "../../../data/races";

// Ant Design's List component treats the input as a string and not as HTML.
// To render HTML, you need to use dangerouslySetInnerHTML prop in React.
// However, List.Item does not support dangerouslySetInnerHTML directly.
// To overcome this, HtmlRender component accepts the HTML string and renders it correctly.
const HtmlRender = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default function SpecialsRestrictions({
  characterData,
  className,
}: SpecialsRestrictionsProps) {
  // Split the class string into individual classes
  const individualClasses = characterData.class.split(" ");

  // Gather the specials and restrictions for each class in the combination
  const classSpecials: string[] = [];
  const classRestrictions: string[] = [];
  individualClasses.forEach((cls) => {
    // const key = cls as keyof typeof classDetails;
    if (classes[cls as ClassNamesTwo]) {
      classSpecials.push(
        ...(classes[cls as ClassNamesTwo].details?.specials || [])
      );
      classRestrictions.push(
        ...(classes[cls as ClassNamesTwo].details?.restrictions || [])
      );
    }
  });

  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...(races[characterData.race as RaceNamesTwo].details?.specials ||
            []),
          ...classSpecials,
          ...(races[characterData.race as RaceNamesTwo].details?.restrictions ||
            []),
          ...classRestrictions,
        ]}
        renderItem={(item) => (
          <List.Item>
            <HtmlRender html={item} />
          </List.Item>
        )}
        className="print:border-0"
        size="small"
      />
    </div>
  );
}
