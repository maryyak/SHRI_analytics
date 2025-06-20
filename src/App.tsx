import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppWrapper from './layouts/AppWrapper/AppWrapper.tsx';
import { routes } from './routes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
          <Route path="*" element={<Navigate to="/csv-analyst" replace />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
