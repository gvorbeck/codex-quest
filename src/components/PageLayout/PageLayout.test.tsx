import { describe, it, expect, beforeEach } from "vitest";
import { Router } from "wouter";
import PageLayout from "./PageLayout";
import { render, screen, cleanup } from "@testing-library/react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

describe("PageLayout", () => {
  beforeEach(() => {
    cleanup();
    render(
      <ThemeSwitcher>
        <Router>
          <PageLayout user={null}>
            <div>Test content</div>
          </PageLayout>
        </Router>
      </ThemeSwitcher>,
    );
  });

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
