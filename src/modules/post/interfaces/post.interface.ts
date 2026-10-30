import type { Coment } from "../../coment/coment.entity.js";
import { User } from "../../user/user.entity.js";

export interface IPost {
  id?: number;
  title: string;
  content: string;
  coments?: Coment[];
  createdAt: Date;
  createdBy: User;
  updatedAt?: Date;
  updatedBy?: User;
  isActive: boolean;
}
