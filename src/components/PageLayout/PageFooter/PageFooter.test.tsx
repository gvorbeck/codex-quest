import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageFooter from "./PageFooter";
import { version, bfrpgRelease, bfrpgEdition } from "../../../../package.json";

describe("PageFooter", () => {
  it("renders the component correctly", () => {
    const { getByText } = render(
      <BrowserRouter>
        <PageFooter />
      </BrowserRouter>,
    );

    // Test for static text
    expect(
      getByText(`© ${new Date().getFullYear()} J. Garrett Vorbeck`),
    ).toBeTruthy();

    // Test for dynamic text
    expect(getByText(`CODEX.QUEST v${version}`)).toBeTruthy();
    expect(
      getByText(`current to ${bfrpgEdition} Edition (release ${bfrpgRelease})`),
    ).toBeTruthy();

    // Test for external links
    expect(
      getByText("Basic Fantasy Role-Playing Game").closest("a"),
    ).toHaveAttribute("href", "https://basicfantasy.org");
    expect(getByText("License").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/gvorbeck/codex-quest/blob/main/LICENSE",
    );
    expect(getByText("Contact").closest("a")).toHaveAttribute(
      "href",
      "mailto:me@iamgarrett.com",
    );

    // Test for react-router-dom Link
    const sourcesLink = getByText("Sources");
    expect(sourcesLink.closest("a")).toHaveAttribute("href", "/sources");
  });
});
