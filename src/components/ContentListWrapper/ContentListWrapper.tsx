import React from "react";
import classNames from "classnames";

interface ContentListWrapperProps {
  loading: boolean;
  loadingContent: React.ReactNode;
}

const ContentListWrapper: React.FC<
  ContentListWrapperProps & React.ComponentPropsWithRef<"div">
> = ({ className, children, loading, loadingContent }) => {
  const contentListWrapperClassNames = classNames(
    "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start",
    className,
  );
  return (
    <div className={loading ? "" : contentListWrapperClassNames}>
      {loading ? loadingContent : children}
    </div>
  );
};

export default ContentListWrapper;
