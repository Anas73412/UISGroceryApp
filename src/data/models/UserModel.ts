import { Model } from "@nozbe/watermelondb";
import { DB_TABLES } from "../../utils/constants";
import { field } from "@nozbe/watermelondb/decorators";

export interface UserResponseModel{
        uid:string;
        email:string;
        name:string;
        profilePictureUrl?:string;
        createdAt?:string;
        hashedPassword:string;  
}

export class UserModel extends Model{
    static table: string = DB_TABLES.USER_TABLE;
    
    @field('uid') uid!:string;
    @field('email') email!:string;
    @field('name') name!:string;
    @field('profile_picture_url') profilePictureUrl?:string;
    @field('created_at') createdAt?:string;
    @field('hashed_password') hashedPassword!:string;
}

export const userCollection="users";

export interface UserDocument extends UserModel{
    hashedPassword:string;
}

