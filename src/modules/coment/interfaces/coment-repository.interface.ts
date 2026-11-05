import type { IComent } from "./coment.interface.js";

export interface IComentRepository {
  findAll(
    post: number,
    page: number,
    limit: number,
    search: string | undefined,
  ): Promise<IComent[]>;
  findById(id: number): Promise<IComent | null>;
  create(post: IComent): Promise<IComent>;
  editById(id: number, post: IComent): Promise<IComent>;
  deleteById(id: number): Promise<boolean>;
}
