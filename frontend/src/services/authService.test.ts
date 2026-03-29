import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAuthErrorMessage,
  login,
  logout,
  signUp,
  subscribeAuthState,
} from "./authService.ts";
import { createInitialUserProfile } from "./userProfileService.ts";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  deleteUser: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("./firebase.ts", () => ({
  auth: {},
  db: {},
}));

vi.mock("./userProfileService.ts", () => ({
  createInitialUserProfile: vi.fn(),
}));

vi.mock("../utils/clientLog.ts", () => ({
  logAppError: vi.fn(),
}));

describe("getAuthErrorMessage", () => {
  it("maps known Firebase codes to user-facing copy", () => {
    expect(getAuthErrorMessage("auth/invalid-email")).toBe("Please enter a valid email address.");
    expect(getAuthErrorMessage("auth/wrong-password")).toBe("Incorrect password. Please try again.");
  });

  it("falls back for unknown codes", () => {
    expect(getAuthErrorMessage("auth/unknown-code")).toBe("Something went wrong. Please try again.");
  });
});

describe("subscribeAuthState", () => {
  it("forwards listener to onAuthStateChanged with app auth", () => {
    const onChange = vi.fn();
    const unsubscribe = vi.fn();
    vi.mocked(onAuthStateChanged).mockReturnValue(unsubscribe);

    const result = subscribeAuthState(onChange);

    expect(onAuthStateChanged).toHaveBeenCalledWith({}, onChange);
    expect(result).toBe(unsubscribe);
  });
});

describe("login", () => {
  beforeEach(() => {
    vi.mocked(signInWithEmailAndPassword).mockReset();
  });

  it("returns success when Firebase sign-in succeeds", async () => {
    const cred = { user: { uid: "u1" } };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(cred as never);

    const result = await login("  a@b.com  ", "secret");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, "a@b.com", "secret");
    expect(result).toEqual({ success: true, user: cred });
  });

  it("returns a friendly message on Firebase auth errors", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({ code: "auth/invalid-credential" });

    const result = await login("a@b.com", "wrong");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe(
        "Invalid credentials. Check your email and password.",
      );
    }
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.mocked(signOut).mockReset();
  });

  it("returns success when signOut succeeds", async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    const result = await logout();

    expect(signOut).toHaveBeenCalledWith({});
    expect(result).toEqual({ success: true });
  });

  it("returns failure when signOut throws", async () => {
    vi.mocked(signOut).mockRejectedValue({ code: "auth/network-request-failed" });

    const result = await logout();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Network error. Check your connection and try again.");
    }
  });
});

describe("signUp", () => {
  const mockUser = { uid: "new-user" } as User;

  beforeEach(() => {
    vi.mocked(createUserWithEmailAndPassword).mockReset();
    vi.mocked(updateProfile).mockReset();
    vi.mocked(createInitialUserProfile).mockReset();
    vi.mocked(deleteUser).mockReset();
  });

  it("returns success after account and profile are created", async () => {
    const userCredential = { user: mockUser };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(userCredential as never);
    vi.mocked(updateProfile).mockResolvedValue(undefined);
    vi.mocked(createInitialUserProfile).mockResolvedValue(undefined);

    const result = await signUp("  user@test.com  ", "password123!", "Display");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "user@test.com",
      "password123!",
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: "Display" });
    expect(createInitialUserProfile).toHaveBeenCalledWith("new-user", {
      name: "Display",
      email: "user@test.com",
    });
    expect(result).toEqual({ success: true, user: userCredential });
  });

  it("rolls back the Firebase user when profile creation fails", async () => {
    const userCredential = { user: mockUser };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(userCredential as never);
    vi.mocked(updateProfile).mockResolvedValue(undefined);
    vi.mocked(createInitialUserProfile).mockRejectedValue({ code: "permission-denied" });
    vi.mocked(deleteUser).mockResolvedValue(undefined);

    const result = await signUp("user@test.com", "password123!", "Name");

    expect(deleteUser).toHaveBeenCalledWith(mockUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe(
        "Could not save your profile. Check your connection and try again.",
      );
    }
  });

  it("maps Firebase sign-up errors to messages", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const result = await signUp("taken@test.com", "password123!");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("This email is already registered. Sign in instead.");
    }
    expect(updateProfile).not.toHaveBeenCalled();
  });
});
