import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PATH_AFTER_AUTH, PATH_LOGIN } from "../routes/paths.ts";
import { login } from "../services/authService.ts";
import { renderWithRouter } from "../test/muiRouter.tsx";
import LoginPage from "./LoginPage.tsx";

vi.mock("../services/authService.ts", () => ({
  login: vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(login).mockReset();
  });

  it("submits credentials and navigates after successful login", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({
      success: true,
      user: { user: { uid: "x" } } as never,
    });

    const view = renderWithRouter(
      [
        { path: PATH_LOGIN, element: <LoginPage /> },
        { path: PATH_AFTER_AUTH, element: <div data-testid="after-auth">In app</div> },
      ],
      [PATH_LOGIN],
    );

    await user.type(view.getByLabelText("Email"), "hello@test.com");
    await user.type(view.getByLabelText("Password"), "password12");
    await user.click(view.getByRole("button", { name: /sign in$/i }));

    await waitFor(() => {
      expect(view.getByTestId("after-auth")).toBeInTheDocument();
    });
    expect(login).toHaveBeenCalledWith("hello@test.com", "password12");
  });

  it("shows an error alert when login fails", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({
      success: false,
      message: "Invalid credentials. Check your email and password.",
    });

    const view = renderWithRouter(
      [
        { path: PATH_LOGIN, element: <LoginPage /> },
        { path: PATH_AFTER_AUTH, element: <div data-testid="after-auth">In app</div> },
      ],
      [PATH_LOGIN],
    );

    await user.type(view.getByLabelText("Email"), "a@b.com");
    await user.type(view.getByLabelText("Password"), "wrong");
    await user.click(view.getByRole("button", { name: /sign in$/i }));

    await waitFor(() => {
      expect(
        view.getByText("Invalid credentials. Check your email and password."),
      ).toBeInTheDocument();
    });
    expect(view.queryByTestId("after-auth")).not.toBeInTheDocument();
  });
});
