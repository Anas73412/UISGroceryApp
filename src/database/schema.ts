import { appSchema, tableSchema } from "@nozbe/watermelondb";
import { DB_TABLES } from "../utils/constants";


export const schema = appSchema({
    version: 1,
    tables:[
        
        tableSchema({
        name: DB_TABLES.USER_TABLE,
        columns: [
            { name: "name", type: "string" },
            { name: "email", type: "string" },
            { name: "uid", type: "string" },
            { name: "hashed_password", type: "string" },
            { name: "profile_picture_url", type: "string", isOptional: true },
            { name: "created_at", type: "number" },
        ]
    }),

    tableSchema({
        name: DB_TABLES.CONFIG_TABLE,
        columns: [
             { name: 'configId', type: 'number' },
        { name: 'configKey', type: 'string' },
        { name: 'configValue', type: 'string' },
        { name: 'status', type: 'number' },
        { name: 'createdAt', type: 'number' },
        { name: 'modifiedAt', type: 'number', isOptional: true }
        ]
    })

]
});