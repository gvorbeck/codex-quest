import type { ReactNode } from "react";
import { Link } from "wouter";
import { Icon } from "@/components/ui";
import List, { ListItem } from "./List";
import { cn } from "@/constants/styles";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

function Breadcrumb({ items, separator, className = "" }: BreadcrumbProps) {
  // Default separator with proper spacing and styling
  const defaultSeparator = (
    <Icon
      name="chevron-right"
      size="sm"
      className="text-zinc-500 flex-shrink-0"
      aria-hidden={true}
    />
  );

  const sep = separator || defaultSeparator;
  const navClasses = cn("flex items-center text-sm", className);

  return (
    <nav role="navigation" aria-label="Breadcrumb" className={navClasses}>
      <List variant="breadcrumb" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <ListItem
              key={`${item.label}-${index}`}
              className="flex items-center"
            >
              {/* Breadcrumb item */}
              <div className="flex items-center gap-1.5">
                {item.icon && (
                  <span
                    className="flex items-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}

                {isCurrent ? (
                  <span
                    className="font-medium text-amber-400 leading-none"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="text-zinc-300 hover:text-amber-400 transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm px-1 py-0.5 leading-none"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-400 font-medium leading-none">
                    {item.label}
                  </span>
                )}
              </div>

              {/* Separator - only show if not the last item */}
              {!isLast && (
                <span
                  className="flex items-center flex-shrink-0 ml-2"
                  aria-hidden="true"
                >
                  {sep}
                </span>
              )}
            </ListItem>
          );
        })}
      </List>
    </nav>
  );
}

export default Breadcrumb;
