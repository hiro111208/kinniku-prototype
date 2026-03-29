## Sprint 01 – User Stories

- **US-01: Sign up**
  - As a **new user**, I want to create an account using my email and password so that I can securely start using Kinniku.

  - [x] **T-01-01: Decide signup data model**
    - Signup will require **email** and **password** for authentication plus an optional **display name**. Firebase Auth will own `email` and the password hash, while the app-level `USER` profile will store:
      - `id`: Firebase `uid`
      - `name`: display name (or derived from email before onboarding)
      - `gender`, `bodyweight`: collected/updated later during onboarding and profile edits, not required at initial signup.

  - [x] **T-01-02: Implement signup UI**
    - Implemented `SignupPage` with Material-UI fields for name, display name, password and confirm password, plus primary CTA and supporting layout mirroring the signup design. `App` now renders this page.

  - [x] **T-01-03: Add client-side validation**
    - Added basic form state and validation to `SignupPage` for required fields, password length, and matching confirmation, with inline error messages and a guarded submit handler.

  - [x] **T-01-04: Configure Firebase email/password auth**
    - Set up Firebase project configuration in the frontend and enable email/password auth in Firebase per the security and privacy requirements.

  - [x] **T-01-05: Connect signup form to Firebase**
    - Wired `SignupPage` to `authService.signUp`; added loading state (disabled button, spinner), success/error handling, and friendly messages for common Firebase Auth error codes (email-already-in-use, weak-password, invalid-email, etc.).

  - [x] **T-01-06: Initialize basic profile data**
    - After successful signup, create a corresponding `USER` record (or profile document) storing at least name, gender, bodyweight, matching the onboarding/profile requirements.

  - [x] **T-01-07: Set up core routes with React Router**
    - Introduce React Router in the frontend and define at least these routes:
      - `/signup` → `SignupPage`
      - `/login` → `LoginPage` (initially a simple placeholder)
      - `/` → landing or dashboard page (can initially be `HomePage`).
    - Ensure navigation between signup and login (e.g., “Sign in instead” link) uses React Router `Link` components instead of plain anchors.

  - [x] **T-01-08: Handle post-signup flow with navigation**
    - After successful signup, use React Router navigation (e.g., `useNavigate`) to redirect the user to the correct first screen (onboarding/profile or training plans list).

  - [x] **T-01-09: Basic error handling & logging**
    - Map common Firebase errors (e.g., email already in use, weak password) to friendly messages and ensure no sensitive data is logged, aligning with privacy requirements.

- **US-02: Log in**
  - As a **registered user**, I want to log in with my email and password so that I can access my personal training plans.

  - [x] **T-01-10: Implement login UI**
    - Create `LoginPage` with email/password inputs, validation, and loading state.

  - [x] **T-01-11: Add Firebase login service**
    - Implement `authService.login` (Firebase `signInWithEmailAndPassword`) returning a typed result.

  - [x] **T-01-12: Handle Firebase login errors**
    - Map common Firebase login error codes to friendly messages; avoid sensitive output.

  - [x] **T-01-13: Wire login form to auth**
    - Submit calls `authService.login`, shows inline error UI on failure, and clears loading state on completion.

  - [x] **T-01-14: Navigate after login**
    - On success, redirect with React Router navigation (MVP: send user to `/`).

- **US-03: Log out**
  - As a **logged‑in user**, I want to log out from my account so that I can prevent others from accessing my data on a shared device.

  - [x] **T-01-15: Add Firebase logout service**
    - Implement `authService.logout` using Firebase `signOut` on the shared `auth` instance; return a typed result (success vs. failure) and map or log errors consistently with `login` / `signUp` (no sensitive data in messages).

  - [x] **T-01-16: Know when the user is signed in**
    - Subscribe to Firebase auth state (e.g., `onAuthStateChanged`) via a small hook or layout wrapper so UI can show **Log out** only for authenticated users and hide or adjust it when signed out.

  - [x] **T-01-17: Log out control in the UI**
    - Add a **Log out** action (Material-UI button or menu item) in a sensible place for the MVP (e.g., app bar on `HomePage` or a shared layout): disabled/loading while sign-out is in progress, inline or snackbar error if sign-out fails.

  - [ ] **T-01-18: Navigate after logout**
    - On successful logout, redirect with React Router (e.g., `useNavigate`) to `/login` or a public landing route so the session is clearly ended on a shared device.

- **US-04: Create training plan**
  - As a **logged‑in user**, I want to create a new training plan (with name, description, and basic settings) so that I can organize my workouts.

  - [ ] **T-01-19: Decide training plan document shape and storage path**
    - Align the product term **training plan** with the conceptual **`TRAINING_BLOCK`** in `docs/er_diagram.md` and training-block fields in `docs/requirements.md` §3.3: **name**, **start/end dates**, **planned days per week**.
    - Add an optional **description** on the document for the user-story wording (not shown on the ER diagram) so **US-06** (details) and **US-07** (edit same fields) stay consistent.
    - Choose a Firestore layout that makes **US-09** straightforward (e.g. subcollection under the authenticated user such as `users/{uid}/trainingPlans/{planId}` with `userId`/`ownerId` on the document for queries and rules).
    - Include **server/client timestamps** (e.g. `createdAt`, `updatedAt`) so **US-05** can sort or filter plans later without rework.

  - [ ] **T-01-20: TDD – validation for create-training-plan input**
    - **Red**: unit tests for a small pure module (e.g. `validateTrainingPlanCreateInput`) covering required **name**, **startDate** / **endDate** ordering (end on or after start), sensible bounds for **plannedDaysPerWeek** (e.g. 1–7), and optional **description** constraints if you cap length.
    - **Green**: implement the validator; reuse it from both the service layer and the form submit path so **US-07** can share the same rules later.

  - [ ] **T-01-21: TDD – `trainingPlanService.create` (Firestore write)**
    - **Red**: service tests with mocked Firestore (and mocked `auth` / current uid) asserting: rejects when there is no signed-in user; passes only validated input; written payload includes owner uid and timestamps; returns the new document id (or equivalent) for navigation.
    - **Green**: implement `trainingPlanService.create` alongside existing Firebase patterns (see `userProfileService` / `firebase.ts`).
    - **Refactor**: map Firestore errors to user-safe messages (no sensitive data), consistent with **US-01** / **US-02** auth error handling.

  - [ ] **T-01-22: TDD – create-training-plan UI**
    - **Red**: component tests for a **Create training plan** screen (or dialog): fields for name, description, and basic settings (dates + planned days per week); inline validation matches **T-01-20**; submit shows loading; failed create shows a friendly error; successful create invokes a callback or observable success path for routing tests.
    - **Green**: implement the page with Material-UI, matching patterns from **SignupPage** / **LoginPage** (controlled fields, accessibility labels).

  - [ ] **T-01-23: Protected route and discovery entry**
    - **Red**: router test that unauthenticated access to the create route redirects or is blocked per **ProtectedLayout** (depends on **US-01**–**US-03**); authenticated user can reach the create flow.
    - **Green**: register a route (e.g. `/plans/new`) under the protected shell; add a clear entry point from the post-login home or a placeholder plans hub so **US-05** can later replace/enhance navigation without changing the create URL.

  - [ ] **T-01-24: Post-create navigation (feeds US-05 / US-06)**
    - **Red**: test that after a successful create, the app navigates to a stable target—prefer **`/plans/:planId`** to support **US-06** when that route exists; if the detail route is not implemented yet, document a temporary redirect to `/` or `/plans` and add a follow-up task under **US-06** to switch the target.
    - **Green**: wire `useNavigate` (or equivalent) on success with the id from **T-01-21**.

  - [ ] **T-01-25: Owner-only create in Firestore rules (supports US-09)**
    - **Red**: where possible, rules unit tests or emulator-based tests that reject creates under another user’s path and allow creates under `request.auth.uid`.
    - **Green**: update Firestore security rules so training plans are only creatable/readable/updatable/deletable by their owner; keep **US-08** / **US-07** in mind so rules stay path-based and do not hard-code only “create”.
    - Note: **US-10** (per-set done) applies to planned work inside a plan and does not need to be implemented in **US-04**; creating the plan document is enough to unblock list, detail, edit, and later workout UI.

- **US-05: View list of training plans**
  - As a **logged‑in user**, I want to see a list of my training plans so that I can quickly find and open an existing plan.

- **US-06: View training plan details**
  - As a **logged‑in user**, I want to open a specific training plan and see its details so that I can review what I am supposed to do.

- **US-07: Update training plan**
  - As a **logged‑in user**, I want to edit an existing training plan (e.g., change its name, description, or basic settings) so that it always reflects my current goals.

- **US-08: Delete training plan**
  - As a **logged‑in user**, I want to delete a training plan I no longer need so that my list stays clean and manageable.

- **US-09: Restrict plans to owner**
  - As a **user**, I want only my own training plans to be visible and editable in my account so that my data remains private and secure.

- **US-10: Mark training set as done**
  - As a **logged‑in user following a training plan**, I want to click a "Done" (or similar) action on each training set so that I can track my progress through the workout in real time.
