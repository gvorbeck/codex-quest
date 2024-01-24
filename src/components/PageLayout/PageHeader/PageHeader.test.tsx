import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PageHeader from "./PageHeader";
import { User } from "firebase/auth";

describe("PageHeader", () => {
  it("renders the component with a title", () => {
    // PageHeader only checks for user null or not null, so we can pass in a boolean as a User.
    const user: User = true as unknown as User;
    const { getByText } = render(
      <BrowserRouter>
        <PageHeader user={user} />
      </BrowserRouter>,
    );
    expect(getByText("Codex")).toBeTruthy();
    expect(getByText("Quest")).toBeTruthy();
    // TODO: Add Login/Logout button test
    console.error("PageHeader test todo!");
  });
});
