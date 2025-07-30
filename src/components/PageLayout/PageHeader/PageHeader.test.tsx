import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Router } from "wouter";
import PageHeader from "./PageHeader";
import { User } from "firebase/auth";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";

// PageHeader only checks for user null or not null, so we can pass in a boolean as a User.
const loggedInUser: User = true as unknown as User;

describe("PageHeader", () => {
  beforeEach(() => {
    cleanup();
  });

  it("expects the site title to be present", () => {
    render(
      <ThemeSwitcher>
        <Router>
          <PageHeader user={loggedInUser} />
        </Router>
      </ThemeSwitcher>,
    );

    const siteTitleElement = screen.getByTestId("site-title");
    expect(document.body.contains(siteTitleElement)).toBeTruthy();
  });

  it("expects the home link to be present", () => {
    render(
      <ThemeSwitcher>
        <Router>
          <PageHeader user={loggedInUser} />
        </Router>
      </ThemeSwitcher>,
    );

    const homeLinkElement = screen.getByTestId("home-link");
    expect(document.body.contains(homeLinkElement)).toBeTruthy();
    expect(homeLinkElement.getAttribute("href")).toBe("/");
  });

  it("expects the site title to be broken into two nodes", () => {
    render(
      <ThemeSwitcher>
        <Router>
          <PageHeader user={loggedInUser} />
        </Router>
      </ThemeSwitcher>,
    );

    const codex = screen.getByText("Codex");
    const quest = screen.getByText("Quest");
    expect(document.body.contains(codex)).toBeTruthy();
    expect(document.body.contains(quest)).toBeTruthy();
  });

  it("expects the logout button to be present when the user is logged in", () => {
    render(
      <ThemeSwitcher>
        <Router>
          <PageHeader user={loggedInUser} />
        </Router>
      </ThemeSwitcher>,
    );

    const logoutButton = screen.getByTestId("logout-button");
    expect(document.body.contains(logoutButton)).toBeTruthy();
  });

  it("expects the login button to be present when the user is logged out", () => {
    // PageHeader only checks for user null or not null, so we can pass in a boolean as a User.
    const loggedOutUser: User = null as unknown as User;

    render(
      <ThemeSwitcher>
        <Router>
          <PageHeader user={loggedOutUser} />
        </Router>
      </ThemeSwitcher>,
    );

    const loginButton = screen.getByTestId("login-button");
    expect(document.body.contains(loginButton)).toBeTruthy();
  });
});
