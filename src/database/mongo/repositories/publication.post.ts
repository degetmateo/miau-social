import DatabaseError from "../../../errors/DatabaseError";
import mongodb from "../mongodb";
import Postgres from "../../Postgres";
import { UUID } from "mongodb";

const uuid = require('uuid');

export default async (data) => {
    try {
        const collection = mongodb.query().collection('publications');

        const member = (await Postgres.query()`
            SELECT 
                m.id_member as id,
                m.username_member as username,
                m.name_member as name,
                m.date_creation_member as created_at,
                m.bio_member as bio,
                icon.url AS icon_url,
                m.role_member as role
            FROM
                member m 
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            WHERE
                m.id_member = ${data.author.id};
        `)[0];

        const doc = await collection.insertOne({
            _id: new UUID(uuid.v7()) as any,
            type: "DEFAULT",
            root_id: null,
            parent_id: null,
            content: data.content,
            media: [{ type: "IMAGE", url: "https://pbs.twimg.com/media/HJHxMwvXIAAXPTZ?format=jpg&name=small" }],
            created_at: new Date().toISOString(),
            author: {
                id: data.author.id,
                name: member.name,
                username: member.username,
                pic_url: member.icon_url
            }
        });

        return doc;
    } catch (error) {
        console.error(error);
        throw new DatabaseError();
    };
};