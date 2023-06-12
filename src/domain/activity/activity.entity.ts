import { UserEntity } from "../user/user.entity";

export interface ActivityEntity {
    uuid?: string;
    nameActivity: string;
    creatorActivity: string;
    participantsActivity?: [string];
    publicationActivity?: [string];
    dateActivity: string;
    hoursActivity: [string];
    idLocation?: string;
    descriptionActivity?: string;
    privacyActivity: boolean;
    roleActivity: "verificado" | "common" | "empresa" ;
}