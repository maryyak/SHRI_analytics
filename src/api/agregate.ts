export interface AggregateChunk {
  rows_affected: number;
  total_spend_galactic: number;
  average_spend_galactic: number;
  big_spent_at: number;
  big_spent_civ: string;
  big_spent_value: number;
  less_spent_at: number;
  less_spent_civ: string;
  less_spent_value: number;
}

export async function aggregateFile(
  file: File,
  rows: number,
  onChunk: (chunk: AggregateChunk) => void
): Promise<void> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`http://127.0.0.1:3000/aggregate?rows=${rows}`, {
    method: 'POST',
    body: form,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Ошибка агрегирования');
  }

  // читаем стрим и парсим по строкам
  const reader = res.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop()!; // последний может быть не полный

    for (const line of lines) {
      if (line.trim()) {
        try {
          const obj = JSON.parse(line);
          onChunk(obj);
        } catch {
          // пропускаем если парс не удался
        }
      }
    }
  }

  // последний
  if (buffer.trim()) {
    try {
      onChunk(JSON.parse(buffer));
    } catch (err) {
      console.log(err);
    }
  }
}
