import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CsvAnalyst from '../../pages/CSVAnalyst/CSVAnalyst.tsx';
import { useFileStore } from '../../store/fileStore.ts';
import { expect } from 'vitest';

const chunk1 = {
  rows_affected: 1,
  total_spend_galactic: 100,
  average_spend_galactic: 10,
  big_spent_at: 123456,
  big_spent_civ: 'monsters',
  big_spent_value: 10,
  less_spent_at: 123450,
  less_spent_civ: 'humans',
  less_spent_value: 10
}

const chunk2 = {
  rows_affected: 2,
  total_spend_galactic: 300,
  average_spend_galactic: 150,
  big_spent_at: 123460,
  big_spent_civ: 'monsters',
  big_spent_value: 200,
  less_spent_at: 123455,
  less_spent_civ: 'blobs',
  less_spent_value: 90
}

afterEach(() => {
  useFileStore.getState().setFile(undefined)
  useFileStore.getState().setData(undefined)
  useFileStore.getState().setError(undefined)
  useFileStore.getState().setStatus(undefined)
})

describe('CSVAnalyst', () => {
  it('во время обработки файла после нажатия на кнопку "отправить" последовательно отображает данные', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        body: new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder()
            controller.enqueue(encoder.encode(JSON.stringify(chunk1) + '\n'))
            setTimeout(() => {
              controller.enqueue(encoder.encode(JSON.stringify(chunk2)))
              controller.close()
            }, 100)
          }
        })
      })
    ))

    render(<CsvAnalyst />);

    await userEvent.upload(
      screen.getByLabelText(/Загрузить файл/i),
      new File(['id,value\n1,100\n2,200'], 'test.csv', { type: 'text/csv' })
    )
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }))

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('monsters')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument()
      expect(screen.getByText('blobs')).toBeInTheDocument()
    })

    expect(screen.getByText(/готово!/i)).toBeInTheDocument()
  });

  it('при неуспешном ответе после нажатия на кнопку отправки отображает сообщение об ошибке', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'ошибка сервера' })
      })
    ))

    render(<CsvAnalyst />)

    await userEvent.upload(
      screen.getByLabelText(/Загрузить файл/i),
      new File(['id,value\n1,100\n2,200'], 'test.csv', { type: 'text/csv' })
    )
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }))

    expect(await screen.findByText(/ошибка сервера/i)).toBeInTheDocument()
  })

  it('во время парсинга при получении потокового ответа с ошибкой отображается ошибка', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        body: new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(JSON.stringify({ rows_affected: 1 }) + '\n'));
            setTimeout(() => controller.error(new Error('stream broken')), 50);
          }
        })
      })
    ));

    render(<CsvAnalyst />);
    await userEvent.upload(
      screen.getByLabelText(/Загрузить файл/i),
      new File(['id,value\n1,100'], 'test.csv', { type: 'text/csv' })
    );
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }));

    expect(await screen.findByText(/stream broken/i)).toBeInTheDocument();
  });
})
