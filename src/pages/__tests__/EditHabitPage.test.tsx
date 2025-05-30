// src/pages/__tests__/EditHabitPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditHabitPage from '../EditHabitPage';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

beforeEach(() => {
  const mockHabit = {
    id: '1',
    name: 'Йога',
    dates: [],
  };
  localStorage.setItem('habits', JSON.stringify([mockHabit]));
});

test('загружает привычку по ID', () => {
  render(
    <MemoryRouter initialEntries={['/edit/1']}>
      <Routes>
        <Route path="/edit/:id" element={<EditHabitPage />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByDisplayValue('Йога')).toBeInTheDocument();
});

test('сохраняет изменения привычки', () => {
  render(
    <MemoryRouter initialEntries={['/edit/1']}>
      <Routes>
        <Route path="/edit/:id" element={<EditHabitPage />} />
      </Routes>
    </MemoryRouter>
  );
  const input = screen.getByDisplayValue('Йога');
  fireEvent.change(input, { target: { value: 'Плавание' } });
  fireEvent.click(screen.getByText(/сохранить/i));
  const updatedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
  expect(updatedHabits[0].name).toBe('Плавание');
});

test('удаляет привычку', () => {
  render(
    <MemoryRouter initialEntries={['/edit/1']}>
      <Routes>
        <Route path="/edit/:id" element={<EditHabitPage />} />
      </Routes>
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/удалить/i));
  const updatedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
  expect(updatedHabits.length).toBe(0);
});
