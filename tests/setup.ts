import { appDataSource } from '../src/database/typeorm';
import { beforeAll, afterAll } from '@jest/globals';

beforeAll(async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});