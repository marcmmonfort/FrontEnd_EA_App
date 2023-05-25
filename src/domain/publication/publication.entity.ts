import { UserEntity } from "../user/user.entity";

export interface PublicationEntity {
    uuid?:string;
    idUser:string;
    likesPublication?:[string];
    textPublication?:string;
    photoPublication:string;
    commentsPublication?:[string];
}

