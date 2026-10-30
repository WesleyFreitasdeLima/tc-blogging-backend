import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { IComent } from "./interfaces/coment.interface.js";
import { User } from "../user/user.entity.js";
import { Post } from "../post/post.entity.js";

@Entity({
  name: "coment",
})
export class Coment implements IComent {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column({
    name: "content",
    type: "varchar",
  })
  content!: string;

  @ManyToOne(() => Post, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "post",
  })
  post?: Post;

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

  constructor(data?: Partial<Post>) {
    Object.assign(this, data);

    this.createdAt ??= new Date();
  }
}
