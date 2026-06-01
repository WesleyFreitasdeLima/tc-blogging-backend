import { User } from "../../user/user.entity.js";

export interface IPost {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: User;
  updatedAt?: Date;
  updatedBy?: User;
  isActive: boolean;
}
