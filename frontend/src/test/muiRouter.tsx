import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render } from "@testing-library/react";
import type { RouteObject } from "react-router";
import { createMemoryRouter, RouterProvider } from "react-router";

const theme = createTheme();

export const renderWithRouter = (routes: RouteObject[], initialEntries: string[]) => {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
};
