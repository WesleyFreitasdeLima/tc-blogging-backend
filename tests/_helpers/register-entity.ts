import { TestContext } from './test-context';

export function registerPost(id: number) {
  TestContext.posts.push(id);
}