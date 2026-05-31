import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { IUser } from "./interfaces/user.interface.js";
import type { UserRoleEnum } from "../../enum/user-role.enum.js";

@Entity({
  name: "users",
})
export class User implements IUser {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column({
    name: "name",
    type: "varchar",
  })
  name!: string;

  @Column({
    name: "username",
    type: "varchar",
  })
  username!: string;

  @Column({
    name: "password",
    type: "varchar",
  })
  password!: string;

  @Column({
    name: "email",
    type: "varchar",
  })
  email!: string;

  @Column({
    name: "role",
    type: "varchar",
  })
  role!: UserRoleEnum;

  @Column({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "is_active",
    type: "integer",
  })
  isActive: boolean;

  constructor(data?: Partial<User>) {
    Object.assign(this, data);

    this.createdAt ??= new Date();
    this.isActive ??= true;
  }
}
