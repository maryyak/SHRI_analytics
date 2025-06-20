import React from 'react';
import styles from './CSVAnalyst.module.css';
import { type AggregateChunk, aggregateFile } from '../../api/agregate.ts';
import { useFileStore } from '../../store/fileStore.ts';
import { useHistoryStore } from '../../store/historyStore.ts';
import { getItemsFromAnalyticsData } from '../../utils/getItemsFromAnalyticsData.ts';
import DropZone from '../../components/DropZone/DropZone.tsx';

const CsvAnalyst = () => {
  const { file, data, error, status, setStatus, setError, setData } = useFileStore();
  const add = useHistoryStore((state) => state.add);

  const parseFile = async (file: File) => {
    setStatus('parsing');
    setError(undefined);

    let finalData: AggregateChunk | undefined;

    try {
      await aggregateFile(file, 10000, (chunk) => {
        setData(chunk);
        finalData = chunk;
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'упс, не то...';
      setError(message);
      finalData = undefined;
    } finally {
      setStatus('success');

      if (finalData) {
        add({
          id: new Date().toISOString(),
          fileName: file.name,
          date: new Date().toLocaleDateString(),
          status: error ? 'error' : 'success',
          data: finalData,
        });
      }
    }
  };

  const items: { label: string; value: React.ReactNode }[] = getItemsFromAnalyticsData(data);

  return (
    <div className={styles.page}>
      <div className={styles.description}>
        Загрузите <span className={styles.bold}>csv</span> файл и получите{' '}
        <span className={styles.bold}>полную информацию</span> о нём за сверхнизкое время
      </div>
      <DropZone />
      {!error && !status && (
        <button
          className={`${styles.sendBtn} ${!file && styles.disabled}`}
          disabled={!file}
          onClick={() => parseFile(file!)}
        >
          Отправить
        </button>
      )}
      {data && (
        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.value}>{item.value}</div>
              <div className={styles.label}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CsvAnalyst;
