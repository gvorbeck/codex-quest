import { List } from "antd";
import { clsx } from "clsx";
import LightMarkdown from "@/components/LightMarkdown/LightMarkdown";

interface SpecialsRestrictionsListItemProps {
  item: string;
}

const SpecialsRestrictionsListItem: React.FC<
  SpecialsRestrictionsListItemProps
> = ({ item }) => {
  return (
    <List.Item>
      <LightMarkdown>{item}</LightMarkdown>
    </List.Item>
  );
};

interface SpecialsRestrictionsListProps {
  dataSource: string[];
}

const SpecialsRestrictionsList: React.FC<
  SpecialsRestrictionsListProps & React.ComponentPropsWithRef<"div">
> = ({ className, dataSource }) => {
  const listClassNames = clsx("print:border-0", className);

  return (
    <List
      bordered
      dataSource={dataSource}
      renderItem={(item) => <SpecialsRestrictionsListItem item={item} />}
      className={listClassNames}
      size="small"
    />
  );
};

export default SpecialsRestrictionsList;
