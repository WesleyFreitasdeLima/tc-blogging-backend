import { In } from 'typeorm';
import { appDataSource } from '../src/database/typeorm';
import { Post } from '../src/modules/post/post.entity';
import { User } from '../src/modules/user/user.entity';
import { TestContext } from './_helpers/test-context';

export async function cleanupTestData() {
  try {
    const postRepository = appDataSource.getRepository(Post);
    const userRepository = appDataSource.getRepository(User);

    if (TestContext.posts.length) {
      await postRepository.delete({
        id: In(TestContext.posts),
      });
    }

    if (TestContext.users.length) {
      await userRepository.delete({
        id: In(TestContext.users),
      });
    }
  } finally {
    TestContext.reset();
  }
}