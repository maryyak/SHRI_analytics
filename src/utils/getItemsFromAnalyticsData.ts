import { getDate } from './getDate.ts';
import type { AggregateChunk } from '../api/agregate.ts';

export const getItemsFromAnalyticsData = (data?: AggregateChunk) => {
  return [
    { value: data?.total_spend_galactic, label: 'общие расходы в галактических кредитах' },
    { value: data?.less_spent_civ, label: 'цивилизация с минимальными расходами' },
    { value: data?.rows_affected, label: 'количество обработанных записей' },
    { value: getDate(data?.big_spent_at), label: 'день года с максимальными расходами' },
    { value: getDate(data?.less_spent_at), label: 'день года с минимальными расходами' },
    { value: data?.big_spent_value, label: 'максимальная сумма расходов за день' },
    { value: data?.big_spent_civ, label: 'цивилизация с максимальными расходами' },
    { value: data?.average_spend_galactic, label: 'средние расходы в галактических кредитах' },
  ];
};
