import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PATH_DASHBOARD, PATH_PLANS_NEW } from '../routes/paths.ts';
import { renderWithRouter } from '../test/muiRouter.tsx';
import Dashboard from './Dashboard.tsx';

describe('Dashboard', () => {
  it('provides a discovery entry to the create training plan route', () => {
    renderWithRouter(
      [{ path: PATH_DASHBOARD, element: <Dashboard /> }],
      [PATH_DASHBOARD],
    );

    const link = screen.getByRole('link', { name: /new training plan/i });
    expect(link).toHaveAttribute('href', PATH_PLANS_NEW);
  });
});
