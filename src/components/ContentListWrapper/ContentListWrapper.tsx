import React from "react";
import { clsx } from "clsx";

interface ContentListWrapperProps {
  loading: boolean;
  loadingContent: React.ReactNode;
}

const ContentListWrapper: React.FC<
  ContentListWrapperProps & React.ComponentPropsWithRef<"div">
> = ({ className, children, loading, loadingContent }) => {
  const contentListWrapperClassNames = clsx(
    "relative transition-all duration-500",
    className,
  );

  const gridClassNames = clsx(
    "grid gap-6 items-start animate-fade-in",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  );

  return (
    <div className={contentListWrapperClassNames}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          {loadingContent}
        </div>
      ) : (
        <div className={gridClassNames}>{children}</div>
      )}
    </div>
  );
};

export default ContentListWrapper;
