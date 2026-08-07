import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { User } from "./User";


@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "varchar",
        length: 50
    })
    type: string;


    @Column({
        type: "text"
    })
    content: string;


    @Column({
        type: "boolean",
        default: false
    })
    isRead: boolean;


    @ManyToOne(
        () => User
    )
    user: User;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}