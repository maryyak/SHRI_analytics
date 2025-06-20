# Сервис межгалактической аналитики

Веб-приложение для загрузки, анализа и генерации CSV-файлов с данными о галактических расходах.

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/maryyak/SHRI_analytics.git
cd SHRI_analytics
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск клиента

```bash
npm run dev
```

### 4. Запуск сервера

```bash
cd server
npm install
npm start
```

## Архитектура проекта

### Клиентская часть (React + Zustand + TypeScript)

```bash
src/
├── api/                # API-запросы к серверу
├── components/         # UI-компоненты (DropZone, Modal, Header и т.д.)
├── pages/              # Страницы приложения (CsvAnalyst, CsvGenerator, History)
├── routes/             # Роутинг
├── store/              # Zustand-стейты (fileStore, historyStore)
├── utils/              # Вспомогательные функции (getDate, getItemsFromAnalyticsData)
├── App.tsx             # Общая структура
└── main.tsx            # Входная точка приложения
```
