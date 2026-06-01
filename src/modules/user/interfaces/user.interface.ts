import { UserRoleEnum } from "../../../enum/user-role.enum.js";

export interface IUser {
  id?: number;
  name: string;
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
  isActive: boolean;
}
