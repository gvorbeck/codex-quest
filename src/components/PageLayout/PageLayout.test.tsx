import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./PageLayout";
import { render, screen } from "@testing-library/react";

describe("PageLayout", () => {
  render(
    <BrowserRouter>
      <PageLayout user={null} />
    </BrowserRouter>,
  );

  it("expects the page header to be present", () => {
    const headerElement = screen.getByTestId("site-header");
    expect(document.body.contains(headerElement)).toBeTruthy();
  });

  it("expects the page content to be present", () => {
    const contentElement = screen.getByTestId("site-content");
    expect(document.body.contains(contentElement)).toBeTruthy();
  });

  it("expects the page footer to be present", () => {
    const footerElement = screen.getByTestId("site-footer");
    expect(document.body.contains(footerElement)).toBeTruthy();
  });
});
