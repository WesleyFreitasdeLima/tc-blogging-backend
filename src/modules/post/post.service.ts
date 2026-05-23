import PostRepository from "./post.repository.js";

class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  createPost(title: string, content: string, author: string) {
    return this.postRepository.create({ title, content, author });
  }

  getAllPosts() {
    return this.postRepository.findAll();
  }

  getPostById(id: number) {
    return this.postRepository.findById(id);
  }

  deletePostById(id: number) {
    return this.postRepository.deleteById(id);
  }
}

export default PostService;