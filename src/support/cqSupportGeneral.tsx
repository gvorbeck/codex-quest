import { BreadcrumbProps } from "antd";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";

export function breadcrumbItems(
  text: string,
  BreadcrumbIcon?: React.ElementType,
): BreadcrumbProps["items"] {
  const homeLink = { title: <BreadcrumbHomeLink /> };
  const location = {
    title: (
      <div>
        {BreadcrumbIcon && <BreadcrumbIcon className="mr-2" />}
        <span>{text}</span>
      </div>
    ),
  };
  return [homeLink, location];
}
