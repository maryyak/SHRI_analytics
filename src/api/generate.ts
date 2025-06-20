export async function generateReport(
  size: number,
  withErrors: 'on' | 'off' = 'off',
  maxSpend: string = '1000'
): Promise<void> {
  const params = new URLSearchParams({
    size: size.toString(),
    withErrors,
    maxSpend,
  });

  const res = await fetch(`http://127.0.0.1:3000/report?${params}`, {
    method: 'GET',
    headers: {
      Accept: 'text/csv',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'упс, не то...' }));
    throw new Error(err.error);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report_${size}GB.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
