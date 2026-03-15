## Conceptual ER Diagram – Powerlifting Workout App (MVP)

This ER diagram is derived from the current MVP requirements and describes the core data model at a conceptual level (no specific database technology implied). Prescription is per-set via `TRAINING_DAY_SET_PRESCRIPTION`, so each set can have different reps, weight, intensity, and rest.

```mermaid
erDiagram

  USER {
    string id
    string name
    string gender
    float bodyweight
    string training_experience
  }

  EXERCISE {
    string id
    string name
    boolean is_builtin
    string created_by_user_id
  }

  TRAINING_BLOCK {
    string id
    string user_id
    string name
    date start_date
    date end_date
    int planned_days_per_week
  }

  TRAINING_DAY_TEMPLATE {
    string id
    string? training_block_id         // nullable
    string label          // e.g. Day 1, Squat + Bench
    int? day_order         // position within the block/week, nullable
  }

  TRAINING_DAY_EXERCISE {
    string id
    string training_day_template_id
    string exercise_id
    int order_index
  }

  TRAINING_DAY_SET_PRESCRIPTION {
    string id
    string training_day_exercise_id
    int set_order
    int reps_planned
    float weight_kg            // optional; if null, use intensity or previous
    string intensity_type     // optional: percent_1rm or rpe
    float intensity_value
    int rest_seconds           // optional; rest after this set
  }

  USER ||--o{ TRAINING_BLOCK : "has"
  USER ||--o{ EXERCISE : "creates custom"

  TRAINING_BLOCK ||--o{ TRAINING_DAY_TEMPLATE : "contains"
  TRAINING_DAY_TEMPLATE ||--o{ TRAINING_DAY_EXERCISE : "includes"
  TRAINING_DAY_EXERCISE ||--o{ TRAINING_DAY_SET_PRESCRIPTION : "prescribes"

  EXERCISE ||--o{ TRAINING_DAY_EXERCISE : "is planned in"
```
