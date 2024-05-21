import { List } from "antd";
import classNames from "classnames";
import Markdown from "react-markdown";

interface SpecialsRestrictionsListItemProps {
  item: string;
}

const SpecialsRestrictionsListItem: React.FC<
  SpecialsRestrictionsListItemProps
> = ({ item }) => {
  return (
    <List.Item>
      <Markdown>{item}</Markdown>
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
