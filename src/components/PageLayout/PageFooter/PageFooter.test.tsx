import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PageFooter from "./PageFooter";
import "@/support/setupTests.js";

describe("PageFooter", () => {
  render(
    <BrowserRouter>
      <PageFooter />
    </BrowserRouter>,
  );

  it("expects the copyright year to be present and current", () => {
    const copyrightYearElement = screen.getByTestId("copyright-year");
    expect(document.body.contains(copyrightYearElement)).toBeTruthy();
    const currentYear = new Date().getFullYear();
    expect(copyrightYearElement.textContent).toContain(currentYear);
  });

  it("expects the author link to be present", () => {
    const authorLinkElement = screen.getByTestId("author-link");
    expect(document.body.contains(authorLinkElement)).toBeTruthy();
  });

  it("expects the site title to be present", () => {
    const siteTitleElement = screen.getByTestId("site-title");
    expect(document.body.contains(siteTitleElement)).toBeTruthy();
  });

  it("expects the version number to be present", () => {
    const versionNumberElement = screen.getByTestId("version-number");
    expect(document.body.contains(versionNumberElement)).toBeTruthy();
  });

  it("expects the bfrpg link to be present, correct, and open in a new tab", () => {
    const bfrpgLinkElement = screen.getByTestId("bfrpg-link");
    expect(document.body.contains(bfrpgLinkElement)).toBeTruthy();
    expect(bfrpgLinkElement.getAttribute("href")).toBe(
      "https://basicfantasy.org",
    );
    expect(bfrpgLinkElement.getAttribute("target")).toBe("_blank");
  });

  it("expects the bfrpg edition to be present", () => {
    const bfrpgEditionElement = screen.getByTestId("bfrpg-edition");
    expect(document.body.contains(bfrpgEditionElement)).toBeTruthy();
  });

  it("expects the license link to be present", () => {
    const licenseLinkElement = screen.getByTestId("license-link");
    expect(document.body.contains(licenseLinkElement)).toBeTruthy();
    expect(licenseLinkElement.getAttribute("target")).toBe("_blank");
  });

  it("expects the contact link to be present", () => {
    const contactLinkElement = screen.getByTestId("contact-link");
    expect(document.body.contains(contactLinkElement)).toBeTruthy();
  });

  it("expects the github link to be present", () => {
    const githubLinkElement = screen.getByTestId("github-link");
    expect(document.body.contains(githubLinkElement)).toBeTruthy();
    expect(githubLinkElement.getAttribute("target")).toBe("_blank");
  });

  it("expects the privacy policy link to be present", () => {
    const privacyPolicyLinkElement = screen.getByTestId("privacy-policy-link");
    expect(document.body.contains(privacyPolicyLinkElement)).toBeTruthy();
    expect(privacyPolicyLinkElement.getAttribute("target")).toBe("_blank");
  });
});
