import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { PATH_PLANS_NEW } from '../routes/paths.ts';
import { trainingPlanService } from '../services/trainingPlanService.ts';
import { renderWithRouter } from '../test/muiRouter.tsx';
import CreateTrainingPlanPage from './CreateTrainingPlanPage.tsx';

vi.mock('../services/trainingPlanService.ts', () => ({
  trainingPlanService: {
    create: vi.fn(),
  },
}));

describe('CreateTrainingPlanPage', () => {
  beforeEach(() => {
    vi.mocked(trainingPlanService.create).mockReset();
  });

  it('renders fields for name, description, dates, and planned days per week', () => {
    const view = renderWithRouter(
      [{ path: PATH_PLANS_NEW, element: <CreateTrainingPlanPage /> }],
      [PATH_PLANS_NEW],
    );

    expect(view.getByLabelText('Plan name')).toBeInTheDocument();
    expect(view.getByLabelText('Description')).toBeInTheDocument();
    expect(view.getByLabelText('Start date')).toBeInTheDocument();
    expect(view.getByLabelText('End date')).toBeInTheDocument();
    expect(view.getByLabelText('Planned days per week')).toBeInTheDocument();
  });

  it('shows inline validation that matches the shared validator when name is empty', async () => {
    const user = userEvent.setup();
    const view = renderWithRouter(
      [{ path: PATH_PLANS_NEW, element: <CreateTrainingPlanPage /> }],
      [PATH_PLANS_NEW],
    );

    await user.type(view.getByLabelText('Start date'), '2026-06-01');
    await user.type(view.getByLabelText('End date'), '2026-08-31');
    await user.clear(view.getByLabelText('Planned days per week'));
    await user.type(view.getByLabelText('Planned days per week'), '4');
    await user.click(view.getByRole('button', { name: /create plan$/i }));

    expect(view.getByText('Name is required.')).toBeInTheDocument();
    expect(trainingPlanService.create).not.toHaveBeenCalled();
  });

  it('shows inline validation when end date is before start date', async () => {
    const user = userEvent.setup();
    const view = renderWithRouter(
      [{ path: PATH_PLANS_NEW, element: <CreateTrainingPlanPage /> }],
      [PATH_PLANS_NEW],
    );

    await user.type(view.getByLabelText('Plan name'), 'Block A');
    await user.type(view.getByLabelText('Start date'), '2026-06-10');
    await user.type(view.getByLabelText('End date'), '2026-06-09');
    await user.type(view.getByLabelText('Planned days per week'), '3');
    await user.click(view.getByRole('button', { name: /create plan$/i }));

    expect(
      view.getByText('End date must be on or after the start date.'),
    ).toBeInTheDocument();
    expect(trainingPlanService.create).not.toHaveBeenCalled();
  });

  it('submits via trainingPlanService.create with valid input', async () => {
    const user = userEvent.setup();
    vi.mocked(trainingPlanService.create).mockResolvedValue({
      success: true,
      blockId: 'block-123',
    });

    const onCreateSuccess = vi.fn();
    const view = renderWithRouter(
      [
        {
          path: PATH_PLANS_NEW,
          element: <CreateTrainingPlanPage onCreateSuccess={onCreateSuccess} />,
        },
      ],
      [PATH_PLANS_NEW],
    );

    await user.type(view.getByLabelText('Plan name'), 'Summer');
    await user.type(view.getByLabelText('Start date'), '2026-06-01');
    await user.type(view.getByLabelText('End date'), '2026-08-31');
    await user.type(view.getByLabelText('Planned days per week'), '4');
    await user.click(view.getByRole('button', { name: /create plan$/i }));

    await waitFor(() => {
      expect(trainingPlanService.create).toHaveBeenCalledWith({
        name: 'Summer',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        plannedDaysPerWeek: 4,
        description: null,
      });
    });
    await waitFor(() => {
      expect(onCreateSuccess).toHaveBeenCalledWith('block-123');
    });
  });

  it('disables submit and shows loading while create is in progress', async () => {
    const user = userEvent.setup();
    vi.mocked(trainingPlanService.create).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ success: true, blockId: 'x' }),
            300,
          );
        }),
    );

    const view = renderWithRouter(
      [{ path: PATH_PLANS_NEW, element: <CreateTrainingPlanPage /> }],
      [PATH_PLANS_NEW],
    );

    await user.type(view.getByLabelText('Plan name'), 'P');
    await user.type(view.getByLabelText('Start date'), '2026-01-01');
    await user.type(view.getByLabelText('End date'), '2026-01-31');
    await user.type(view.getByLabelText('Planned days per week'), '3');
    await user.click(view.getByRole('button', { name: /create plan$/i }));

    expect(view.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('shows a friendly error when create fails', async () => {
    const user = userEvent.setup();
    vi.mocked(trainingPlanService.create).mockResolvedValue({
      success: false,
      message: 'You do not have permission to save this plan. Try signing in again.',
    });

    const view = renderWithRouter(
      [{ path: PATH_PLANS_NEW, element: <CreateTrainingPlanPage /> }],
      [PATH_PLANS_NEW],
    );

    await user.type(view.getByLabelText('Plan name'), 'P');
    await user.type(view.getByLabelText('Start date'), '2026-01-01');
    await user.type(view.getByLabelText('End date'), '2026-01-31');
    await user.type(view.getByLabelText('Planned days per week'), '3');
    await user.click(view.getByRole('button', { name: /create plan$/i }));

    await waitFor(() => {
      expect(
        view.getByText(
          'You do not have permission to save this plan. Try signing in again.',
        ),
      ).toBeInTheDocument();
    });
  });
});
