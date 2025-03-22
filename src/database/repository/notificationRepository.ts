import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";

const get = async (data: {
    id_member: number;
    offset: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                n.id_notification AS id,
                n.date_notification AS date,
                n.type_notification AS type,
                n.status AS status,
                jsonb_build_object (
                    'id', n.id_member_target_notification,
                    'name', m.name_member,
                    'username', m.username_member,
                    'role', m.role_member,
                    'icon_url', icon.url
                ) AS target_member,
                jsonb_build_object (
                    'id', n.id_post_target_notification,
                    'id_post_replied', p.id_post_replied,
                    'content', p.content_post,
                    'date', p.date_post,
                    'images', p.images_post,
                    'media', COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}')
                ) AS target_post
            FROM 
                notification n
            JOIN 
                member m ON m.id_member = n.id_member_target_notification
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            LEFT JOIN 
                post p ON (n.type_notification IN ('comment', 'upvote') AND n.id_post_target_notification = p.id_post)
            LEFT JOIN
                image media ON media.post_id = p.id_post AND media.type = 'media'
            WHERE 
                n.id_member = ${data.id_member}
            GROUP BY
                n.id_notification,
                m.id_member,
                icon.url,
                p.id_post,
                media.url,
                p.id_post_replied,
                p.content_post,
                p.date_post,
                p.images_post
            ORDER BY 
                date_notification DESC
            LIMIT 20
            OFFSET ${data.offset};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const read = async (data: {
    id_member: number;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                notification
            SET
                status = 'seen'
            WHERE
                status = 'pending' AND
                id_member = ${data.id_member};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
        }
    }
}

export const notificationRepository = {
    get,
    read
}