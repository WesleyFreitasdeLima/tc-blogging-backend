import type { Repository } from "typeorm";
import { appDataSource } from "../../database/typeorm.js";
import type { IComentRepository } from "./interfaces/coment-repository.interface.js";
import type { IComent } from "./interfaces/coment.interface.js";
import { Coment } from "./coment.entity.js";
import { AppNotFound } from "../../erros/not-found.js";

class ComentRepository implements IComentRepository {
  private ComentRepository: Repository<IComent>;

  constructor() {
    this.ComentRepository = appDataSource.getRepository(Coment);
  }

  async findAll(
    post: number,
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IComent[]> {
    const query = this.ComentRepository.createQueryBuilder("Coment")
      .leftJoinAndSelect("Coment.createdBy", "createdBy")
      .leftJoinAndSelect("Coment.updatedBy", "updatedBy");
    query.andWhere(
      `
        Coment.post = :post
      `,
      {
        post: post,
      },
    );

    if (search) {
      query.andWhere(
        `
        Coment.content ILIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findById(id: number): Promise<IComent | null> {
    
    return await this.ComentRepository.findOne({
      where: { id: id },
      relations: ["createdBy", "updatedBy"],
    });
  }

  create(user: Omit<IComent, "id">): Promise<IComent> {
    const entity = this.ComentRepository.create(user);

    return this.ComentRepository.save(entity);
  }

  async editById(
    id: number,
    updatedFields: Partial<Omit<IComent, "id">>,
  ): Promise<IComent> {
    const existingComent = await this.ComentRepository.findOne({
      where: { id },
    });

    if (!existingComent) {
      throw new AppNotFound("Coment");
    }

    Object.assign(existingComent, updatedFields);

    return this.ComentRepository.save(existingComent);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.ComentRepository.delete(id);

    if (!result.affected) {
      return false;
    }

    return result.affected > 0;
  }
}

export default ComentRepository;
