# Frontend Agent Instructions

This directory contains the frontend application.

## Tech Stack

- TypeScript
- React
- Vite
- Material UI
- React Router

## Directory Structure

- src/
  - components/ # reusable UI components
  - pages/ # page level components
  - hooks/ # custom React hooks
  - services/ # Firebase interaction
  - types/ # TypeScript types

## Component Guidelines

- Use functional components (ES6 arrow functions)
- Use React hooks
- Keep components small and focused
- Extract reusable UI into `components/`

## UI Guidelines

- Use Material UI components whenever possible
- Avoid custom CSS unless necessary
- Use the MUI `sx` prop for styling

## State Management

- Use React hooks (`useState`, `useEffect`)
- Use custom hooks for shared logic

## Firebase Usage

- Firebase logic should be implemented in `services/`
- UI components should not directly call Firebase

## Coding Rules

- Prefer TypeScript types over `any`
- Avoid large components (>200 lines)
- Extract logic into hooks
- Use const and arrow functions

## Naming Conventions

- Component: PascalCase
- Hooks: useXxx
- Non-Component Files: camelCase
- Folders: camelCase
