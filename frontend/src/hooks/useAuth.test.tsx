import type { User } from "firebase/auth";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { subscribeAuthState } from "../services/authService.ts";
import { useAuth } from "./useAuth.ts";

vi.mock("../services/authService.ts", () => ({
  subscribeAuthState: vi.fn(),
}));

describe("useAuth", () => {
  it("exposes the user emitted by subscribeAuthState", async () => {
    const mockUser = { uid: "abc" } as User;
    vi.mocked(subscribeAuthState).mockImplementation((onChange) => {
      onChange(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBe(mockUser);
    });
  });

  it("handles signed-out state", async () => {
    vi.mocked(subscribeAuthState).mockImplementation((onChange) => {
      onChange(null);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
