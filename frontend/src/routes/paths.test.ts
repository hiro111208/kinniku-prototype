import { describe, expect, it } from "vitest";
import {
  PATH_AFTER_AUTH,
  PATH_DASHBOARD,
  PATH_HOME,
  PATH_LOGIN,
  PATH_PLANS_NEW,
  PATH_PLAN_DETAIL,
  PATH_PROFILE,
  PATH_SETTINGS,
  PATH_SIGNUP,
  pathToTrainingPlan,
} from "./paths.ts";

describe("paths", () => {
  it("uses dashboard as post-auth destination", () => {
    expect(PATH_AFTER_AUTH).toBe(PATH_DASHBOARD);
  });

  it("exports stable route strings", () => {
    expect(PATH_HOME).toBe("/");
    expect(PATH_DASHBOARD).toBe("/dashboard");
    expect(PATH_LOGIN).toBe("/login");
    expect(PATH_SIGNUP).toBe("/signup");
    expect(PATH_PROFILE).toBe("/profile");
    expect(PATH_SETTINGS).toBe("/settings");
    expect(PATH_PLANS_NEW).toBe("/plans/new");
    expect(PATH_PLAN_DETAIL).toBe("/plans/:planId");
    expect(pathToTrainingPlan("abc")).toBe("/plans/abc");
  });
});
