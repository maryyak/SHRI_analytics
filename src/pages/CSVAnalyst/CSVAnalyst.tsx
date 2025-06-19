import React from 'react';
import styles from "./CSVAnalyst.module.css"
import DropZone from "./components/DropZone/DropZone.tsx";
import {aggregateFile} from "../../api/agregate.ts";
import {useFileStore} from "../../store/fileStore.ts";
import {getDate} from "../../utils/getDate.ts";

const CsvAnalyst = () => {
    const {file, data, error, status, setStatus, setError, setData} = useFileStore();

    const parseFile = async (file: File) => {
        setStatus('parsing')
        setError(undefined);

        try {
            await aggregateFile(file, 10000, (chunk) => {
                setData(chunk);
            });
        } catch (e: unknown) {
            const message =
                e instanceof Error
                    ? e.message
                    : typeof e === 'string'
                        ? e
                        : 'упс, не то...';
            setError(message);
        } finally {
            setStatus('success')
        }
    };

    const items: { label: string; value: React.ReactNode }[] = [
        {value: data?.total_spend_galactic, label: 'общие расходы в галактических кредитах'},
        {value: data?.less_spent_civ, label: 'цивилизация с минимальными расходами'},
        {value: data?.rows_affected, label: 'количество обработанных записей'},
        {value: getDate(data?.big_spent_at), label: 'день года с максимальными расходами'},
        {value: getDate(data?.less_spent_at), label: 'день года с минимальными расходами'},
        {value: data?.big_spent_value, label: 'максимальная сумма расходов за день'},
        {value: data?.big_spent_civ, label: 'цивилизация с максимальными расходами'},
        {value: data?.average_spend_galactic, label: 'средние расходы в галактических кредитах'},
    ];

    return (
        <div className={styles.page}>
            <div className={styles.description}>
                Загрузите <span className={styles.bold}>csv</span> файл и получите <span
                className={styles.bold}>полную информацию</span> о нём за сверхнизкое время
            </div>
            <DropZone/>
            {!error && !status &&
                <button
                    className={`${styles.sendBtn} ${!file && styles.disabled}`}
                    disabled={!file}
                    onClick={() => parseFile(file!)}
                >
                    Отправить
                </button>
            }
            {data &&
                <div className={styles.grid}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.value}>{item.value}</div>
                            <div className={styles.label}>{item.label}</div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default CsvAnalyst;