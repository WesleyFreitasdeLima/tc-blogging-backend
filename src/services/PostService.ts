class PostService {
  createPost(title: string, content: string, author: string) {
    return { id: 3, title, content, author };
  }

  getAllPosts() {
    return [
      { id: 1, title: "Primeiros passos com Express", content: "Express é uma ferramenta incrível...", author: "Dev" },
      { id: 2, title: "Dominando o MVC", content: "Arquitetura limpa facilita muito a manutenção...", author: "Dev" }
    ];
  }
}

export default PostService;