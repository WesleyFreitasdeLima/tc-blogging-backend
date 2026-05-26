import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import type { IPost } from "./interfaces/post.interface.js";
import { User } from "./user.entity.js";

@Entity({
  name: "post",
})
export class Post implements IPost {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column({
    name: "title",
    type: "varchar",
  })
  title!: string;

  @Column({
    name: "content",
    type: "varchar",
  })
  content!: string;

  @Column({
    name: "created_at",
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "created_by",
  })
  createdBy!: User;

  @Column({
    name: "updated_at",
    type: "timestamp without time zone",
  })
  updatedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "updated_by",
  })
  updatedBy?: User;

  @Column({
    name: "is_active",
    type: "integer",
  })
  isActive: boolean;

  constructor(data?: Partial<Post>) {
    Object.assign(this, data);

    this.createdAt ??= new Date();
    this.isActive ??= true;
  }
}
