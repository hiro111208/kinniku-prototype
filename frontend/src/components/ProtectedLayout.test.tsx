import { screen, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { PATH_DASHBOARD, PATH_HOME } from "../routes/paths.ts";
import { renderWithRouter } from "../test/muiRouter.tsx";
import ProtectedLayout from "./ProtectedLayout.tsx";
import { useAuth } from "../hooks/useAuth.ts";

vi.mock("../hooks/useAuth.ts", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./Sidebar.tsx", () => ({
  default: () => <div data-testid="sidebar-stub" />,
}));

const mockUseAuth = vi.mocked(useAuth);

describe("ProtectedLayout", () => {
  it("shows loading while auth is resolving", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    renderWithRouter(
      [
        { path: PATH_HOME, element: <div data-testid="home-page">Home</div> },
        {
          element: <ProtectedLayout />,
          children: [
            {
              path: PATH_DASHBOARD,
              element: <div data-testid="protected-outlet">Protected</div>,
            },
          ],
        },
      ],
      [PATH_DASHBOARD],
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("redirects guests to home", async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderWithRouter(
      [
        { path: PATH_HOME, element: <div data-testid="home-page">Home</div> },
        {
          element: <ProtectedLayout />,
          children: [
            {
              path: PATH_DASHBOARD,
              element: <div data-testid="protected-outlet">Protected</div>,
            },
          ],
        },
      ],
      [PATH_DASHBOARD],
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("protected-outlet")).not.toBeInTheDocument();
  });

  it("renders the nested route when authenticated", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "1" } as User, loading: false });

    renderWithRouter(
      [
        { path: PATH_HOME, element: <div data-testid="home-page">Home</div> },
        {
          element: <ProtectedLayout />,
          children: [
            {
              path: PATH_DASHBOARD,
              element: <div data-testid="protected-outlet">Protected</div>,
            },
          ],
        },
      ],
      [PATH_DASHBOARD],
    );

    expect(screen.getByTestId("protected-outlet")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-stub")).toBeInTheDocument();
  });
});
