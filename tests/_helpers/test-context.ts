export class TestContext {
  static users: number[] = [];
  static posts: number[] = [];

  static reset() {
    this.users = [];
    this.posts = [];
  }
}