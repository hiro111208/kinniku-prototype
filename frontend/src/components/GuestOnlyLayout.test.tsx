import { screen, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { PATH_AFTER_AUTH, PATH_LOGIN } from "../routes/paths.ts";
import { renderWithRouter } from "../test/muiRouter.tsx";
import GuestOnlyLayout from "./GuestOnlyLayout.tsx";
import { useAuth } from "../hooks/useAuth.ts";

vi.mock("../hooks/useAuth.ts", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

describe("GuestOnlyLayout", () => {
  it("shows loading while auth is resolving", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    renderWithRouter(
      [
        { path: PATH_AFTER_AUTH, element: <div data-testid="post-auth">App</div> },
        {
          element: <GuestOnlyLayout />,
          children: [
            { path: PATH_LOGIN, element: <div data-testid="login-outlet">Login</div> },
          ],
        },
      ],
      [PATH_LOGIN],
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("redirects signed-in users away from guest routes", async () => {
    mockUseAuth.mockReturnValue({ user: { uid: "1" } as User, loading: false });

    renderWithRouter(
      [
        { path: PATH_AFTER_AUTH, element: <div data-testid="post-auth">App</div> },
        {
          element: <GuestOnlyLayout />,
          children: [
            { path: PATH_LOGIN, element: <div data-testid="login-outlet">Login</div> },
          ],
        },
      ],
      [PATH_LOGIN],
    );

    await waitFor(() => {
      expect(screen.getByTestId("post-auth")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("login-outlet")).not.toBeInTheDocument();
  });

  it("renders guest child routes when signed out", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderWithRouter(
      [
        { path: PATH_AFTER_AUTH, element: <div data-testid="post-auth">App</div> },
        {
          element: <GuestOnlyLayout />,
          children: [
            { path: PATH_LOGIN, element: <div data-testid="login-outlet">Login</div> },
          ],
        },
      ],
      [PATH_LOGIN],
    );

    expect(screen.getByTestId("login-outlet")).toBeInTheDocument();
  });
});
