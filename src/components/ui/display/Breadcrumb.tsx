import type { ReactNode } from "react";
import { Link } from "wouter";

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
    <svg
      className="w-4 h-4 text-zinc-500 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const sep = separator || defaultSeparator;

  return (
    <nav
      role="navigation"
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center space-x-2"
            >
              {/* Breadcrumb item */}
              <div className="flex items-center space-x-2">
                {item.icon && (
                  <span className="flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                
                {isCurrent ? (
                  <span
                    className="font-medium text-amber-400"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="text-zinc-300 hover:text-amber-400 transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm px-1 py-0.5"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-400 font-medium">{item.label}</span>
                )}
              </div>

              {/* Separator - only show if not the last item */}
              {!isLast && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {sep}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;