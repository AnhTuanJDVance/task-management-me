import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { User } from "./User";


@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "varchar",
        length: 500,
        unique: true
    })
    token: string;


    @Column({
        type: "timestamp"
    })
    expiresAt: Date;


    @Column({
        type: "boolean",
        default: false
    })
    isRevoked: boolean;


    @ManyToOne(
        () => User,
        (user) => user.id
    )
    user: User;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;

}