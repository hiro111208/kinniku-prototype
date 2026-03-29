import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "./Loading.tsx";

const theme = createTheme();

describe("Loading", () => {
  it("renders a progress indicator", () => {
    render(
      <ThemeProvider theme={theme}>
        <Loading />
      </ThemeProvider>,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
