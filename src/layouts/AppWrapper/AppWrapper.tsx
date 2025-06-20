import React, { type ReactElement } from 'react';
import Header from '../../components/Header/Header.tsx';
import styles from './AppWrapper.module.css';

const AppWrapper = ({ children }: { children: ReactElement }) => {
  return (
    <div className={styles.layout}>
      <Header />
      {children}
    </div>
  );
};

export default AppWrapper;
