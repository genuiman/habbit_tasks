// src/pages/__tests__/HomePage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../HomePage';
import '@testing-library/jest-dom';

beforeEach(() => {
  localStorage.clear();
});

test('отображает пустой список привычек', () => {
  render(<HomePage />);
  expect(screen.getByText(/нет привычек/i)).toBeInTheDocument();
});

test('добавляет новую привычку', () => {
  render(<HomePage />);
  fireEvent.change(screen.getByPlaceholderText(/название привычки/i), {
    target: { value: 'Чтение' },
  });
  fireEvent.click(screen.getByText(/добавить/i));
  expect(screen.getByText(/Чтение/i)).toBeInTheDocument();
});

test('отмечает привычку на сегодня', () => {
  render(<HomePage />);
  fireEvent.change(screen.getByPlaceholderText(/название привычки/i), {
    target: { value: 'Медитация' },
  });
  fireEvent.click(screen.getByText(/добавить/i));
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});
