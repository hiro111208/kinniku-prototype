## Sprint 01 – User Stories

- **US-01: Sign up**
  - As a **new user**, I want to create an account using my email and password so that I can securely start using Kinniku.

  - [ ] **T-01-01: Decide signup data model**
    - Confirm required fields for signup (email, password, display name) and how they map to the `USER` entity (id, name, gender, bodyweight) defined in the ER diagram and requirements.

  - [ ] **T-01-02: Implement signup UI**
    - Create a signup page/component in React with Material-UI inputs for email, password, and display name, plus a primary submit button.

  - [ ] **T-01-03: Add client-side validation**
    - Validate email format, minimum password strength, and required fields; show clear inline error messages.

  - [ ] **T-01-04: Configure Firebase email/password auth**
    - Set up Firebase project configuration in the frontend and enable email/password auth in Firebase per the security and privacy requirements.

  - [ ] **T-01-05: Connect signup form to Firebase**
    - On submit, call Firebase to create the user account, handle loading states, and show success/failure feedback based on Firebase error codes.

  - [ ] **T-01-06: Initialize basic profile data**
    - After successful signup, create a corresponding `USER` record (or profile document) storing at least name, gender, bodyweight, and training experience, matching the onboarding/profile requirements.

  - [ ] **T-01-07: Handle post-signup flow**
    - Keep the user logged in after signup and redirect them to the appropriate first screen (e.g., onboarding/profile or training block setup).

  - [ ] **T-01-08: Basic error handling & logging**
    - Map common Firebase errors (e.g., email already in use, weak password) to friendly messages and ensure no sensitive data is logged, aligning with privacy requirements.

- **US-02: Log in**
  - As a **registered user**, I want to log in with my email and password so that I can access my personal training plans.

- **US-03: Log out**
  - As a **logged‑in user**, I want to log out from my account so that I can prevent others from accessing my data on a shared device.

- **US-04: Create training plan**
  - As a **logged‑in user**, I want to create a new training plan (with name, description, and basic settings) so that I can organize my workouts.

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
