# Powerlifting Workout App – MVP Requirements

## 1. Purpose and Scope (MVP)

- **Purpose**: Help powerlifters plan and log training with a focus on the squat, bench press, and deadlift, **while still supporting any other exercises they use in their programs**, and see basic strength progress over time.
- **MVP scope**:
  - Focus on individual lifters (no coach/multi-user management).
  - Focus on structured powerlifting-style training (big three plus any accessory or supplemental work the user chooses).
  - Provide just enough tracking and visualization to support consistent training and basic progression.

## 2. Target User (MVP)

- **Primary user**: Novice to intermediate powerlifter who:
  - Trains the squat, bench, and deadlift regularly.
  - Also performs accessory and supplemental exercises (e.g., rows, presses, machine work, core work).
  - Wants to follow simple structured plans (blocks, weeks, days).
  - Wants to track sets (weight, reps, RPE) and see whether they are getting stronger.

## 3. Core Functional Requirements (MVP)

### 3.1 Onboarding and Profile

- **Profile**
  - **Must** allow the user to set:
    - Name or nickname.
    - Gender.
    - Bodyweight.
- **Initial goals**
  - **Must** allow setting current estimated 1RM and goal 1RM for:
    - Squat
    - Bench press
    - Deadlift
  - **Should** allow setting a target total.

### 3.2 Exercise Library (Powerlifting-Oriented, Not Limited)

- **Built-in exercises**
  - **Must** include competition-style:
    - Back squat
    - Bench press
    - Deadlift (conventional and sumo options)
  - **Should** include a broader set of common barbell, dumbbell, and machine exercises used in powerlifting-style training (e.g., overhead press, rows, pull-downs, curls, triceps work, core exercises).
- **Exercise data**
  - **Must** store for each exercise:
    - Name
    - Type (main lift / variation / accessory / other)
    - Primary muscle groups
  - **Should** optionally tag exercises by primary lift they support (squat / bench / deadlift / general).
- **Custom exercises**
  - **Must** allow users to add their own exercises with at least:
    - Name
    - Type
    - Primary muscle group(s)
  - **Should** allow users to edit or delete custom exercises.

### 3.3 Training Plans and Sessions

- **Training blocks**
  - **Must** allow creating a training block with:
    - Block name
    - Start and end dates
    - Planned number of training days per week.
- **Weekly plan**
  - **Must** allow defining, per week:
    - A set of training days (e.g., Day 1, Day 2, Day 3…).
    - For each day, an ordered list of exercises (including but not limited to the big three).
- **Exercise prescriptions**
  - **Must** allow defining, for each exercise in a day:
    - Number of sets and reps.
    - Target intensity as either:
      - Percentage of estimated 1RM (for applicable lifts), or
      - RPE target.
  - **Should** support simple “top set + back-off sets” patterns (e.g., 1×3 @8, then 3×5 @70%).

### 3.4 Workout Logging

- **Start session**
  - **Must** allow starting a workout from:
    - A planned day in the current block.
    - A quick “ad-hoc session” with manual exercise selection.
- **Per-set logging**
  - **Must** allow logging for each set:
    - Actual weight used.
    - Actual reps performed.
    - RPE (or similar effort rating).
  - **Must** allow adding short notes at session level (e.g., “felt tired”, “great session”).
- **Session status**
  - **Must** allow marking:
    - Workout as completed.
    - Workout as cancelled (if started but not finished).
  - **Should** allow marking workouts as partially completed.

### 3.5 Progress and History

- **Workout history**
  - **Must** provide a list of past workouts by date, with:
    - Exercises performed (highlighting the big three when present).
    - Basic summary (e.g., total sets for each big lift).
- **Lift progress**
  - **Must** estimate 1RM for squat, bench, and deadlift over time based on logged sets.
  - **Must** show trends for estimated 1RM for each of these lifts.
  - **Should** show recent best sets (weight × reps) for key lifts, including user-chosen non–big-three exercises.
- **Total progress**
  - **Should** show an estimated total (sum of squat, bench, and deadlift) and its trend.

## 4. Scheduling and Reminders (MVP)

- **Schedule**
  - **Must** allow assigning planned training days within a week (e.g., Mon, Wed, Fri).
  - **Should** display a simple “this week” view showing which days have planned or completed workouts.
- **Reminders**
  - **Should** allow enabling/disabling training day reminders.
  - **Should** allow setting a preferred reminder time for training days.

## 5. Non-Functional Requirements (MVP)

### 5.1 Usability

- **Must** allow the user to:
  - See today’s planned workout immediately.
  - Start logging a session within a few simple steps.
  - Log a set (weight, reps, RPE) quickly with minimal input.
- **Should** use terminology familiar to powerlifters (e.g., “1RM”, “top set”, “back-off”).

### 5.2 Performance and Reliability

- **Must** respond quickly when:
  - Adding sets.
  - Navigating between exercises in a workout.
  - Viewing recent history.
- **Must** avoid losing an in-progress session due to temporary interruptions (e.g., app switch or short inactivity).

### 5.3 Privacy and Data Control

- **Must** keep user training data private to the user.
- **Must** allow users to:
  - Edit their profile data.
  - Delete their account and associated data.

## 6. Out-of-Scope for MVP

- **Not included in MVP**:
  - Multi-lifter or coach management.
  - Social features (leaderboards, feeds, sharing).
  - Detailed recovery/readiness scoring.
  - Advanced analytics beyond basic 1RM and total trends.
  - Meet management (attempt selection, full meet logs).

## 7. MVP Success Criteria

- **Activation**
  - A new user completes onboarding and logs at least one full workout within their first week.
- **Engagement**
  - Active users log at least two training sessions per week on average over their first month.
- **Progress visibility**
  - Active users can see a clear change (up or down) in estimated 1RM for at least one lift after four weeks of use.
- **Satisfaction**
  - Average user rating on ease of logging and clarity of progress is at least 4 out of 5.
