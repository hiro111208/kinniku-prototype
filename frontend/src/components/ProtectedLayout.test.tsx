import { screen, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import { PATH_DASHBOARD, PATH_HOME, PATH_PLANS_NEW } from "../routes/paths.ts";
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

  it("redirects guests away from the create training plan route to home", async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderWithRouter(
      [
        { path: PATH_HOME, element: <div data-testid="home-page">Home</div> },
        {
          element: <ProtectedLayout />,
          children: [
            {
              path: PATH_PLANS_NEW,
              element: <div data-testid="create-plan-outlet">Create plan</div>,
            },
          ],
        },
      ],
      [PATH_PLANS_NEW],
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("create-plan-outlet")).not.toBeInTheDocument();
  });

  it("renders the create training plan route when authenticated", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "1" } as User, loading: false });

    renderWithRouter(
      [
        { path: PATH_HOME, element: <div data-testid="home-page">Home</div> },
        {
          element: <ProtectedLayout />,
          children: [
            {
              path: PATH_PLANS_NEW,
              element: <div data-testid="create-plan-outlet">Create plan</div>,
            },
          ],
        },
      ],
      [PATH_PLANS_NEW],
    );

    expect(screen.getByTestId("create-plan-outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });
});
