export function getDate(day?: number): string {
  if (!day) return '';

  const date = new Date(2024, 0, day);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}
