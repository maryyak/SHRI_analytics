import { describe, it, expect, vi, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CsvGenerator from '../../pages/CSVGenerator/CSVGenerator.tsx';
import { generateReport } from '../../api/generate.ts';

vi.stubGlobal('createElement', (tag: string) => {
  if (tag === 'a') {
    return { click: vi.fn(), setAttribute: vi.fn(), style: {} };
  }
  return document.createElement(tag);
});

vi.mock('../../api/generate.ts', () => ({
  generateReport: vi.fn(),
}));

describe('CSV Generator', () => {
  it('при нажатии на кнопку генерации показывает индикатор загрузки, пока идёт генерация', async () => {
    vi.mock('../../api/generate.ts', () => ({
      generateReport: vi.fn(),
    }));

    let resolveReport: () => void;
    const reportPromise = new Promise<void>(res => { resolveReport = res; });
    (generateReport as Mock).mockReturnValue(reportPromise);

    render(<CsvGenerator />);
    const button = screen.getByRole('button', { name: /Начать генерацию/i });
    await userEvent.click(button);

    expect(await screen.findByTestId('spinner')).toBeInTheDocument();
    expect(button).toBeDisabled();

    resolveReport!();
    await waitFor(() =>
      expect(screen.getByText(/файл сгенерирован!/i)).toBeInTheDocument()
    );
    expect(button).toBeEnabled();
  });

  it('при нажатии на кнопку генерации при сетевой ошибке показывает сообщение об ошибке', async () => {
    (generateReport as Mock).mockRejectedValue(new Error('network down'));

    render(<CsvGenerator />);
    const button = screen.getByRole('button', { name: /Начать генерацию/i });

    await userEvent.click(button);

    expect(await screen.findByText(/network down/i)).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('при нажатии на кнопку генерации вызывается метод generateReport с правильными аргументами', async () => {
    (generateReport as Mock).mockResolvedValue(undefined);

    render(<CsvGenerator />);
    const button = screen.getByRole('button', { name: /Начать генерацию/i });

    await userEvent.click(button);

    expect(generateReport).toHaveBeenCalled();
    expect(generateReport).toHaveBeenCalledWith(0.001, 'off', '200');

    await waitFor(() =>
      expect(screen.getByText(/файл сгенерирован!/i)).toBeInTheDocument()
    );
  });
});