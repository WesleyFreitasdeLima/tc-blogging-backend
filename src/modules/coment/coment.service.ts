import type { IComent } from "./interfaces/coment.interface.js";
import ComentRepository from "./coment.repository.js";

class ComentService {
  constructor(private readonly comenttRepository: ComentRepository) {}

  async getAllComents(
    post: number,
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IComent[]> {
    return await this.comenttRepository.findAll(post, page, limit, search);
  }

  async getComentById(id: number): Promise<IComent | null> {
    return await this.comenttRepository.findById(id);
  }

  async createComent(
    post: Omit<IComent, "id" | "createdAt" | "updatedAt" | "updatedBy">,
  ): Promise<IComent> {
    const newComent = Object.assign(post, {
      createdAt: new Date(),
    });

    return await this.comenttRepository.create(newComent);
  }

  async editComentById(
    id: number,
    updatedFields: Partial<Omit<IComent, "id" | "createdAt">>,
  ): Promise<IComent> {
    return await this.comenttRepository.editById(id, updatedFields);
  }

  async deleteComentById(id: number): Promise<boolean> {
    return await this.comenttRepository.deleteById(id);
  }
}

export default ComentService;
