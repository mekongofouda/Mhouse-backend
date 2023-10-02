import { TypeShareEnum } from "src/enums/type.share.enum";
import { TimestampEntity } from "src/generics/timestamp.entity";
import { PostEntity } from "src/post/entities/post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Share extends TimestampEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        length: 20
    })
    refShare: string;

    @Column({
        length: 64
    })
    adress: string

    @Column({
        type: 'enum',
        enum: TypeShareEnum,
        default: TypeShareEnum.HOME_CARE,
        nullable: true
    })
    type: string

    @ManyToOne(
        type => PostEntity,
        (post) => post.shares
    )
    post : PostEntity; 

}
