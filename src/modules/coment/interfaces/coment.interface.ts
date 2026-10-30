import { User } from "../../user/user.entity.js";

export interface IComent {
  id?: number;
  content: string;
  createdAt: Date;
  createdBy: User;
  updatedAt?: Date;
  updatedBy?: User;
}
