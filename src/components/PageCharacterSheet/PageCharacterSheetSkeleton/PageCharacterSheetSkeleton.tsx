import { Flex, Skeleton } from "antd";
import classNames from "classnames";
import React from "react";

interface PageCharacterSheetSkeletonProps {}

const PageCharacterSheetSkeleton: React.FC<
  PageCharacterSheetSkeletonProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const skeletonClassNames = classNames("mt-10", className);
  return (
    <Flex align="center" gap={16} vertical className={skeletonClassNames}>
      <Skeleton.Avatar
        size={"large"}
        shape={"circle"}
        className="[&>span]:w-32 [&>span]:h-32"
        active
      />
      <Skeleton title={{ width: "100%" }} paragraph={{ rows: 10 }} active />
    </Flex>
  );
};

export default PageCharacterSheetSkeleton;
