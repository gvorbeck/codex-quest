import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "wouter";

const BreadcrumbHomeLink: React.FC = () => {
  return (
    <Link aria-label="Go back Home" to="/">
      <HomeOutlined className="mr-2" />
      <span>Home</span>
    </Link>
  );
};

export default BreadcrumbHomeLink;
