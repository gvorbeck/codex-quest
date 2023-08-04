import { List, Typography } from "antd";
import { SpecialsRestrictionsProps } from "./definitions";

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
  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...characterData.specials.race,
          ...characterData.specials.class,
          ...characterData.restrictions.race,
          ...characterData.restrictions.class,
        ]}
        renderItem={(item) => (
          <List.Item>
            <HtmlRender html={item} />
          </List.Item>
        )}
        className="print:border-0"
      />
    </div>
  );
}
