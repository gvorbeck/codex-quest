import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PageHeader from "./PageHeader";
import { User } from "firebase/auth";
import "@/support/setupTests.js";

// PageHeader only checks for user null or not null, so we can pass in a boolean as a User.
const loggedInUser: User = true as unknown as User;

describe("PageHeader", () => {
  const { getByText, container } = render(
    <BrowserRouter>
      <PageHeader user={loggedInUser} />
    </BrowserRouter>,
  );

  it("renders the component with a site title separated", () => {
    expect(getByText("Codex")).toBeTruthy();
    expect(getByText("Quest")).toBeTruthy();
  });

  it("renders the logout button when the user is logged in", () => {
    const logoutButton = container.querySelector("button.logout");
    expect(logoutButton).toBeTruthy();
  });

  it("renders the login button when the user is logged out", () => {
    // PageHeader only checks for user null or not null, so we can pass in a boolean as a User.
    const loggedOutUser: User = null as unknown as User;

    const { container } = render(
      <BrowserRouter>
        <PageHeader user={loggedOutUser} />
      </BrowserRouter>,
    );

    const loginButton = container.querySelector("button.login");
    expect(loginButton).toBeTruthy();
  });
});
