import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageFooter from "./PageFooter";
import { bfrpgRelease } from "../../../../package.json";

describe("PageFooter", () => {
  it("renders the component correctly", () => {
    const { getByText } = render(
      <BrowserRouter>
        <PageFooter />
      </BrowserRouter>,
    );

    const basicFantasyLink = getByText(
      "Basic Fantasy Role-Playing Game",
    ).closest("a");
    expect(basicFantasyLink).not.toBeNull();
    expect(basicFantasyLink?.getAttribute("href")).toBe(
      "https://basicfantasy.org",
    );

    const licenseLink = getByText("License").closest("a");
    expect(licenseLink).not.toBeNull();
    expect(licenseLink?.getAttribute("href")).toBe(
      "https://github.com/gvorbeck/codex-quest/blob/main/LICENSE",
    );

    const contactLink = getByText("Contact").closest("a");
    expect(contactLink).not.toBeNull();
    expect(contactLink?.getAttribute("href")).toBe("mailto:me@iamgarrett.com");
  });
});

describe("bfrpgRelease", () => {
  it("should be a string representing a number", () => {
    // Check if bfrpgRelease is a string that can be converted to a number
    const isNumeric = !isNaN(Number(bfrpgRelease));
    expect(isNumeric).toBe(true);
  });
});
