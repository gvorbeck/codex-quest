import { useMarkdown } from "@/hooks/useMarkdown";
import { List } from "antd";
import classNames from "classnames";

interface SpecialsRestrictionsListItemProps {
  item: string;
}

const SpecialsRestrictionsListItem: React.FC<
  SpecialsRestrictionsListItemProps
> = ({ item }) => {
  const itemHtml = useMarkdown(item);

  return (
    <List.Item>
      <div dangerouslySetInnerHTML={{ __html: itemHtml }} />
    </List.Item>
  );
};

interface SpecialsRestrictionsListProps {
  dataSource: string[];
}

const SpecialsRestrictionsList: React.FC<
  SpecialsRestrictionsListProps & React.ComponentPropsWithRef<"div">
> = ({ className, dataSource }) => {
  const listClassNames = classNames("print:border-0", className);

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
