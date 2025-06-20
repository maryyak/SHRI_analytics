import CSVAnalyst from '../pages/CSVAnalyst/CSVAnalyst.tsx';
import CsvGenerator from '../pages/CSVGenerator/CSVGenerator.tsx';
import History from '../pages/History/History.tsx';

export const routes = [
  {
    path: '/csv-analyst',
    element: <CSVAnalyst />,
  },
  {
    path: '/csv-generator',
    element: <CsvGenerator />,
  },
  {
    path: '/history',
    element: <History />,
  },
];
