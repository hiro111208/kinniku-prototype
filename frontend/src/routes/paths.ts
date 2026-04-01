/** Public landing; default route for signed-out users. */
export const PATH_HOME = '/';

/** Main app shell entry (dashboard). */
export const PATH_DASHBOARD = '/dashboard';

/** Alias: first screen after sign-in or sign-up. */
export const PATH_AFTER_AUTH = PATH_DASHBOARD;

export const PATH_LOGIN = '/login';

export const PATH_SIGNUP = '/signup';

export const PATH_PROFILE = '/profile';

export const PATH_SETTINGS = '/settings';

/** Create a new training block (plan). */
export const PATH_PLANS_NEW = '/plans/new';

/** Single-plan view (detail). Use `pathToTrainingPlan(id)` for navigation. */
export const PATH_PLAN_DETAIL = '/plans/:planId';

export const pathToTrainingPlan = (planId: string) => `/plans/${planId}`;
