import { describe, it, expect, beforeEach } from 'vitest';
import { type HistoryItem, STORAGE_KEY, useHistoryStore } from '../../store/historyStore';

describe('historyStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useHistoryStore.getState().clear();
  });

  it('при вызове метода load загружает из localStorage корректные данные', () => {
    const saved: HistoryItem[] = [
      { id: '1', fileName: 'a.csv', date: '2025-06-28', status: 'success' },
      { id: '2', fileName: 'b.csv', date: '2025-06-27', status: 'error', errorMessage: 'oops' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    expect(useHistoryStore.getState().items).toEqual([]);

    useHistoryStore.getState().load();
    expect(useHistoryStore.getState().items).toEqual(saved);
  });

  it('при вызове метода load игнорирует невалидные данные из localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json ');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    useHistoryStore.getState().load();
    expect(useHistoryStore.getState().items).toEqual([]);

    spy.mockRestore();
  });

  it('при вызове метода add добавляет элемент в начало списка и сохраняет в localStorage', () => {
    const item1: HistoryItem = { id: '1', fileName: 'a.csv', date: '2025-06-28', status: 'success' };
    const item2: HistoryItem = { id: '2', fileName: 'b.csv', date: '2025-06-29', status: 'error', errorMessage: 'fail' };

    useHistoryStore.getState().add(item1);
    expect(useHistoryStore.getState().items).toEqual([item1]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([item1]);

    useHistoryStore.getState().add(item2);
    expect(useHistoryStore.getState().items).toEqual([item2, item1]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([item2, item1]);
  });

  it('при вызове метода remove удаляет элемент по id и сохраняет изменения в localStorage', () => {
    const item1: HistoryItem = { id: '1', fileName: 'a.csv', date: '2025-06-28', status: 'success' };
    const item2: HistoryItem = { id: '2', fileName: 'b.csv', date: '2025-06-29', status: 'error' };
    useHistoryStore.getState().add(item1);
    useHistoryStore.getState().add(item2);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item1, item2]));

    useHistoryStore.getState().remove('1');
    expect(useHistoryStore.getState().items).toEqual([item2]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([item2]);
  });

  it('при вызове метода clear очищает items и localStorage', () => {
    const item: HistoryItem = { id: '1', fileName: 'a.csv', date: '2025-06-28', status: 'success' };
    useHistoryStore.getState().add(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]));

    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().items).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});