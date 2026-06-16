import { appDataSource } from '../src/database/typeorm';
import { beforeAll, afterAll, afterEach } from '@jest/globals';
import { cleanupTestData } from './cleanup';

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

afterEach(async () => {
  await cleanupTestData();
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});