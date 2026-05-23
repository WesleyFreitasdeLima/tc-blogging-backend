import type { Post } from "../modules/post/post.entity.js";
import type { User } from "../modules/user/user.entity.js";

const database: Post[] = [
	{ id: 1, title: "Primeiros passos com Express", content: "Express é uma ferramenta incrível...", author: "Dev" },
	{ id: 2, title: "Dominando o MVC", content: "Arquitetura limpa facilita muito a manutenção...", author: "Dev" }
];

const databaseUser: User[] = [
	{ id: 1, name: "Alice", email: "alice@example.com", password: "password123", role: "teacher" },
	{ id: 2, name: "Bob", email: "bob@example.com", password: "password123", role: "student" }
];

export { database, databaseUser };