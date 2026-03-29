import { waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PATH_AFTER_AUTH, PATH_SIGNUP } from "../routes/paths.ts";
import { signUp } from "../services/authService.ts";
import { renderWithRouter } from "../test/muiRouter.tsx";
import SignupPage from "./SignupPage.tsx";

vi.mock("../services/authService.ts", () => ({
  signUp: vi.fn(),
}));

describe("SignupPage", () => {
  beforeEach(() => {
    vi.mocked(signUp).mockReset();
  });

  it("does not call signUp when required fields fail validation", async () => {
    const user = userEvent.setup();

    const view = renderWithRouter(
      [
        { path: PATH_SIGNUP, element: <SignupPage /> },
        { path: PATH_AFTER_AUTH, element: <div data-testid="after-auth">In app</div> },
      ],
      [PATH_SIGNUP],
    );

    await user.click(view.getByRole("button", { name: /^next$/i }));

    expect(await view.findByText("First name is required")).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it("submits valid data and navigates after successful sign-up", async () => {
    const user = userEvent.setup();
    vi.mocked(signUp).mockResolvedValue({
      success: true,
      user: { user: { uid: "new" } } as never,
    });

    const view = renderWithRouter(
      [
        { path: PATH_SIGNUP, element: <SignupPage /> },
        { path: PATH_AFTER_AUTH, element: <div data-testid="after-auth">In app</div> },
      ],
      [PATH_SIGNUP],
    );

    const form = view.container.querySelector("form");
    expect(form).not.toBeNull();
    const textFields = within(form as HTMLElement).getAllByRole("textbox");
    await user.type(textFields[0], "Ada");
    await user.type(textFields[2], "adal");
    await user.type(textFields[3], "ada@example.com");
    const [passwordInput, confirmInput] = form!.querySelectorAll('input[type="password"]');
    await user.type(passwordInput, "password1");
    await user.type(confirmInput, "password1");
    await user.click(view.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(view.getByTestId("after-auth")).toBeInTheDocument();
    });
    expect(signUp).toHaveBeenCalledWith("ada@example.com", "password1", "Ada");
  });

  it("shows server-side error when signUp fails", async () => {
    const user = userEvent.setup();
    vi.mocked(signUp).mockResolvedValue({
      success: false,
      message: "This email is already registered. Sign in instead.",
    });

    const view = renderWithRouter(
      [
        { path: PATH_SIGNUP, element: <SignupPage /> },
        { path: PATH_AFTER_AUTH, element: <div data-testid="after-auth">In app</div> },
      ],
      [PATH_SIGNUP],
    );

    const form = view.container.querySelector("form");
    expect(form).not.toBeNull();
    const textFields = within(form as HTMLElement).getAllByRole("textbox");
    await user.type(textFields[0], "Ada");
    await user.type(textFields[2], "adal");
    await user.type(textFields[3], "taken@example.com");
    const [passwordInput, confirmInput] = form!.querySelectorAll('input[type="password"]');
    await user.type(passwordInput, "password1");
    await user.type(confirmInput, "password1");
    await user.click(view.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(
        view.getByText("This email is already registered. Sign in instead."),
      ).toBeInTheDocument();
    });
    expect(view.queryByTestId("after-auth")).not.toBeInTheDocument();
  });
});
