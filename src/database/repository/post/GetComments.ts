import Postgres from "../../Postgres";

export default async function GetComments (data: {
    member: any;
    id: number;
    offset: number;
}) {
    return await Postgres.query()`
        SELECT 
            p.id_post AS id,
            p.content_post AS content,
            p.date_post AS date,
            p.type,
            p.target_post_id,
            (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
            (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply') as comments_count,
            (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'quote') as quotes_count,
            (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'shared') as shared_count,
            EXISTS (
                SELECT 1 FROM
                    upvote
                WHERE 
                    id_post = p.id_post AND 
                    id_member_upvote = ${data.member.id}               
            ) as is_upvoted,
            EXISTS (
                SELECT 1 FROM
                    post
                WHERE
                    target_post_id = p.id_post AND
                    type = 'quote' AND
                    id_member = ${data.member.id}
            ) as is_quoted,
            EXISTS (
                SELECT 1 FROM
                    post
                WHERE
                    target_post_id = p.id_post AND
                    type = 'shared' AND
                    id_member = ${data.member.id}
            ) as is_shared,
            jsonb_build_object (
                'id', m.id_member,
                'name', m.name_member,
                'username', m.username_member,
                'role', m.role_member,
                'icon_url', icon.url
            ) AS creator,
            COALESCE(
                (
                    SELECT jsonb_agg(media.url ORDER BY media.id ASC)
                    FROM image media 
                    WHERE media.post_id = p.id_post AND media.type = 'media'
                ), '[]'::jsonb
            ) AS media,
            COALESCE((
                SELECT jsonb_build_object(
                    'id', tp.id_post,
                    'content', tp.content_post,
                    'date', tp.date_post,
                    'type', tp.type,
                    'target_post_id', tp.target_post_id,
                    'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                    'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
                    'quotes_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'quote'),
                    'shared_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'shared'),
                    'is_upvoted', EXISTS (
                        SELECT 1 FROM upvote
                        WHERE id_post = tp.id_post 
                        AND id_member_upvote = ${data.member.id}               
                    ),
                    'is_quoted', EXISTS (
                        SELECT 1 FROM
                            post
                        WHERE
                            target_post_id = tp.id_post AND
                            type = 'quote' AND
                            id_member = ${data.member.id}
                    ),
                    'is_shared', EXISTS (
                        SELECT 1 FROM
                            post
                        WHERE
                            target_post_id = tp.id_post AND
                            type = 'shared' AND
                            id_member = ${data.member.id}
                    ),
                    'creator', jsonb_build_object(
                        'id', tm.id_member,
                        'name', tm.name_member,
                        'username', tm.username_member,
                        'role', tm.role_member,
                        'icon_url', ticon.url
                    ),
                    'media', COALESCE((
                        SELECT jsonb_agg(tmedia.url ORDER BY tmedia.id ASC)
                        FROM image tmedia 
                        WHERE tmedia.post_id = tp.id_post AND tmedia.type = 'media'
                    ), '[]'::jsonb)
                )
                FROM post tp
                LEFT JOIN member tm ON tp.id_member = tm.id_member
                LEFT JOIN image ticon ON ticon.member_id = tm.id_member AND ticon.type = 'icon'
                WHERE tp.id_post = p.target_post_id
            ), 'null'::jsonb) AS target_post
        FROM
            post p
        LEFT JOIN
            member m ON p.id_member = m.id_member
        LEFT JOIN
            image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
        LEFT JOIN
            image media ON media.post_id = p.id_post AND media.type = 'media'
        WHERE
            p.target_post_id = ${data.id} AND
            p.type = 'reply'
        GROUP BY
            p.id_post,
            p.content_post,
            p.date_post,
            p.type,
            p.target_post_id,
            p.id_member,
            m.id_member,
            icon.url
        ORDER BY
            (CASE 
                WHEN p.id_member = ${data.member.id} THEN 0 
                ELSE 1
            END),
            p.date_post DESC
        LIMIT 20
        OFFSET ${data.offset};
    `;
};