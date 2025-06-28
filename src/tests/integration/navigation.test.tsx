import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import AppWrapper from '../../layouts/AppWrapper/AppWrapper.tsx';
import { routes } from '../../routes';

function renderFullApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppWrapper>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
          <Route path="*" element={<Navigate to="/csv-analyst" replace />} />
        </Routes>
      </AppWrapper>
    </MemoryRouter>
  );
}

describe('Интеграция навигации в App', () => {
  it('при первоначальном рендере загружается по умолчанию страница CSVAnalyst и активен соответствующий пункт', () => {
    renderFullApp('/csv-analyst');

    expect(screen.getByText(/Загрузите файл/i)).toBeInTheDocument();
    const analystLink = screen.getByRole('link', { name: /CSV Аналитик/i });
    expect(analystLink.className).toMatch(/active/);
  });

  it('при клике в Header пользователь переходит в CSVGenerator и подсвечивается соответствующий пункт меню', async () => {
    renderFullApp('/csv-analyst');

    const genLink = screen.getByRole('link', { name: /CSV Генератор/i });
    await userEvent.click(genLink);

    expect(await screen.findByTestId('generate-page')).toBeInTheDocument();
    expect(genLink.className).toMatch(/active/);
  });

  it('при клике в Header пользователь переходит в History и подсвечивается соответствующий пункт меню', async () => {
    renderFullApp('/csv-analyst');

    const histLink = screen.getByRole('link', { name: /История/i });
    await userEvent.click(histLink);

    expect(await screen.findByTestId('history-page')).toBeInTheDocument();
    expect(histLink.className).toMatch(/active/);
  });
});
