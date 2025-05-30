// src/pages/__tests__/StatsPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsPage from '../StatsPage';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

beforeEach(() => {
  const mockHabits = [
    {
      id: '1',
      name: 'Бег',
      dates: ['2025-05-28', '2025-05-29'],
    },
    {
      id: '2',
      name: 'Чтение',
      dates: ['2025-05-29'],
    },
  ];
  localStorage.setItem('habits', JSON.stringify(mockHabits));
});

test('рендерит график статистики', () => {
  render(<StatsPage />);
  const canvas = screen.getByTestId('stats-canvas');
  expect(canvas).toBeInTheDocument();
});
