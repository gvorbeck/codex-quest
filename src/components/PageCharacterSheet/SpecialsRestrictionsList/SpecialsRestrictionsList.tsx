import { List } from "antd";
import classNames from "classnames";
import { marked } from "marked";
import React from "react";

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
      renderItem={(item) => (
        <List.Item>
          <div dangerouslySetInnerHTML={{ __html: marked(item) }} />
        </List.Item>
      )}
      className={listClassNames}
      size="small"
    />
  );
};

export default SpecialsRestrictionsList;
