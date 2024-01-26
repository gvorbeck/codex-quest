import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./PageLayout";
import { render } from "@testing-library/react";
import { User } from "firebase/auth";

// Mock User
const user: User = true as unknown as User;

describe("PageLayout", () => {
  it("displays the welcome message", () => {
    const { getByText } = render(
      <BrowserRouter>
        <PageLayout user={null} />
      </BrowserRouter>,
    );
    expect(getByText(/Welcome to v2.0!/i)).toBeTruthy();
  });

  // it("navigates to new character page when button clicked", async () => {
  //   const navigate = vi.fn();
  //   vi.mock("react-router-dom", () => ({
  //     ...vi.importActual("react-router-dom"),
  //     useNavigate: () => navigate,
  //   }));

  //   const { getByRole } = render(
  //     <BrowserRouter>
  //       <PageLayout user={null} />
  //     </BrowserRouter>,
  //   );

  //   // Simulate click event
  //   fireEvent.click(getByRole("button", { name: /new character/i }));

  //   // Check if navigate was called with correct path
  //   expect(navigate).toHaveBeenCalledWith("/new-character");
  // });

  it("renders floating buttons on the homepage", () => {
    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useLocation: () => ({
        pathname: "/",
      }),
    }));

    const { getByText } = render(
      <BrowserRouter>
        <PageLayout user={null} />
      </BrowserRouter>,
    );

    expect(getByText("Create New Character")).toBeTruthy();
  });

  it("renders the page footer", () => {
    const { getByText } = render(
      <BrowserRouter>
        <PageLayout user={null} />
      </BrowserRouter>,
    );
    expect(getByText("All rights reserved")).toBeTruthy();
  });
});
