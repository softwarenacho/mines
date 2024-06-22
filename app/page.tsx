'use client';

import { Suspense } from 'react';
import Mines from './_components/Mines';
import styles from './page.module.scss';

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Mines />
      </main>
    </Suspense>
  );
};

export default Home;
