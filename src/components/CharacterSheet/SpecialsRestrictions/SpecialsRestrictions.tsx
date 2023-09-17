import { List, Typography } from "antd";
import { marked } from "marked";
import { SpecialsRestrictionsProps } from "./definitions";
import { classes } from "../../../data/classes";
import { races } from "../../../data/races";
import { ClassNames, RaceNames } from "../../../data/definitions";

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
  // Gather the specials and restrictions for each class in the combination
  const classSpecials: string[] = [];
  const classRestrictions: string[] = [];
  characterData.class.forEach((cls) => {
    if (classes[cls as ClassNames]) {
      classSpecials.push(
        ...(classes[cls as ClassNames].details?.specials || [])
      );
      classRestrictions.push(
        ...(classes[cls as ClassNames].details?.restrictions || [])
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
          ...(races[characterData.race as RaceNames].details?.specials || []),
          ...classSpecials,
          ...(races[characterData.race as RaceNames].details?.restrictions ||
            []),
          ...classRestrictions,
        ]}
        renderItem={(item) => (
          <List.Item>
            <HtmlRender html={marked(item)} />
          </List.Item>
        )}
        className="print:border-0"
        size="small"
      />
    </div>
  );
}
