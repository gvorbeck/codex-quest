import React from "react";

interface LinkProps {
  to: string;
  title: string;
}

const Link: React.FC<
  LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ className, to, title, ...props }) => {
  return (
    <a
      href={to}
      className={className}
      rel="noopener noreferrer"
      title={title}
      target="_blank"
      {...props}
    >
      {title}
    </a>
  );
};

export default Link;
