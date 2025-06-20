import React, { useState } from 'react';
import styles from './DropZone.module.css';
import { useFileStore } from '../../store/fileStore.ts';
import Spinner from '../UI/Spinner/Spinner.tsx';

const DropZone: React.FC = () => {
  const { file, status, error, setStatus, setError, setFile, setData } = useFileStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.dataTransfer?.items;
    if (items?.length && items[0].kind === 'file') {
      setError(undefined);
    }
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
    setError(undefined);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files?.length) {
      const f = files[0];
      if (f.type === 'text/csv') {
        setError(undefined);
      } else {
        setError('упс, не то...');
      }
      setFile(f);
      e.dataTransfer.clearData();
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const f = files[0];
      if (f.type === 'text/csv') {
        setError(undefined);
      } else {
        setError('упс, не то...');
        console.log(error);
      }
      setFile(f);
      e.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setFile(undefined);
    setError(undefined);
    setStatus(undefined);
    setData(undefined);
  };

  return (
    <>
      <div
        className={`${styles.dropZone} ${
          isDragOver
            ? styles.dragOver
            : error
              ? styles.dropZoneError
              : file
                ? styles.dropZoneFile
                : ''
        }`}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={styles.uploadInfo}>
          <div className={styles.uploadBtn}>
            <label
              className={`${styles.button} ${error ? styles.error : status === 'success' ? styles.success : file || status === 'parsing' ? styles.uploaded : ''}`}
            >
              {status === 'parsing' ? <Spinner /> : file ? file.name : 'Загрузить файл'}
              <input
                type="file"
                accept=".csv,text/csv"
                className={styles.input}
                onChange={onInputChange}
              />
            </label>
            {status !== 'parsing' && file && (
              <span className={styles.removeBtn} onClick={handleRemoveFile}>
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
          ) : status === 'parsing' ? (
            <span>идёт парсинг файла</span>
          ) : status === 'success' ? (
            <span>готово!</span>
          ) : file ? (
            <span>файл загружен!</span>
          ) : (
            <span>или перетащите сюда</span>
          )}
        </div>
      </div>
    </>
  );
};

export default DropZone;
