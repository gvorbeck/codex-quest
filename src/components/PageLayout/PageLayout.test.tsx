import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./PageLayout";
import { render } from "@testing-library/react";
import "@/support/setupTests.js";

describe("PageLayout", () => {
  const { getByText } = render(
    <BrowserRouter>
      <PageLayout user={null} />
    </BrowserRouter>,
  );
  it("displays the welcome message", () => {
    expect(getByText(/Welcome to v2.0!/i)).toBeTruthy();
  });

  // it("renders floating buttons on the homepage", () => {
  //   expect(getByText("Create New Character")).toBeTruthy();
  // });

  it("renders the page footer", () => {
    expect(getByText("J. Garrett Vorbeck")).toBeTruthy();
  });
});
