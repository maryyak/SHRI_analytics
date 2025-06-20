import React, { useState } from 'react';
import styles from './CSVGenerator.module.css';
import Spinner from '../../components/UI/Spinner/Spinner.tsx';
import { generateReport } from '../../api/generate.ts';

const CsvGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [isReady, setIsReady] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(undefined);

    try {
      await generateReport(0.01, 'off', '1000');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'упс, не то...';
      setError(msg);
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  const handleRestart = () => {
    setError(undefined);
    setIsReady(false);
  };

  return (
    <div className={styles.page}>
      <span className={styles.description}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </span>
      <div className={styles.generateInfo}>
        <div className={styles.generateBtn}>
          <button
            className={`${styles.button} ${error ? styles.error : loading ? styles.loading : isReady ? styles.success : ''}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Spinner /> : error ? 'Ошибка' : isReady ? 'Done!' : 'Начать генерацию'}
          </button>
          {(isReady || error) && (
            <span className={styles.removeBtn} onClick={handleRestart}>
              <svg
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.16675 20.3333L10.5001 11M10.5001 11L19.8334 1.66663M10.5001 11L1.16675 1.66663M10.5001 11L19.8334 20.3333"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
        {error ? (
          <span className={styles.errorText}>{error}</span>
        ) : loading ? (
          <span>идёт процесс генерации</span>
        ) : isReady ? (
          <span>файл сгенерирован!</span>
        ) : null}
      </div>
    </div>
  );
};

export default CsvGenerator;
