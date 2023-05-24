import { UserEntity } from "../user/user.entity";

export interface PublicationEntity {
    uuid:string;
    idUser:UserEntity;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:[string];
    commentsPublication?:[string];
    createdAt:string;
    updatedAt:string;
}

