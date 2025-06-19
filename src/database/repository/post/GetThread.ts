import Postgres from "../../Postgres";

export default async function GetThread (data: {
    member: any;
    id: number;
    offset: number;
}) {
    return await Postgres.query()`
        WITH RECURSIVE thread AS (
            SELECT 
                original.id_post AS id,
                original.content_post AS content,
                original.date_post AS date,
                original.target_post_id,
                original.type,
                (SELECT COUNT(*) FROM upvote up WHERE up.id_post = original.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = original.id_post AND pr.type = 'reply') as comments_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = original.id_post AND pr.type = 'quote') as quotes_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = original.id_post AND pr.type = 'shared') as shared_count,
                EXISTS (
                    SELECT 1 FROM upvote up
                    WHERE up.id_post = original.id_post 
                    AND up.id_member_upvote = ${data.member.id}               
                ) as is_upvoted,
                EXISTS (
                    SELECT 1 FROM
                        post pq
                    WHERE
                        pq.target_post_id = original.id_post AND
                        pq.type = 'quote' AND
                        pq.id_member = ${data.member.id}
                ) as is_quoted,
                EXISTS (
                    SELECT 1 FROM
                        post pq
                    WHERE
                        pq.target_post_id = original.id_post AND
                        pq.type = 'shared' AND
                        pq.id_member = ${data.member.id}
                ) as is_shared,
                jsonb_build_object (
                    'id', member_original.id_member,
                    'name', member_original.name_member,
                    'username', member_original.username_member,
                    'role', member_original.role_member,
                    'icon_url', icon_original.url
                ) AS creator
            FROM 
                post original
            LEFT JOIN
                member member_original ON original.id_member = member_original.id_member
            LEFT JOIN
                image icon_original ON icon_original.member_id = member_original.id_member AND icon_original.type = 'icon'
            WHERE 
                original.id_post = ${data.id}
            
            UNION ALL
            
            SELECT 
                replied.id_post AS id,
                replied.content_post AS content,
                replied.date_post AS date,
                replied.target_post_id,
                replied.type,
                (SELECT COUNT(*) FROM upvote up WHERE up.id_post = replied.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = replied.id_post AND pr.type = 'reply') as comments_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = replied.id_post AND pr.type = 'quote') as quotes_count,
                (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = replied.id_post AND pr.type = 'shared') as shared_count,
                EXISTS (
                    SELECT 1 FROM upvote up
                    WHERE up.id_post = replied.id_post 
                    AND up.id_member_upvote = ${data.member.id}               
                ) as is_upvoted,
                EXISTS (
                    SELECT 1 FROM
                        post pq
                    WHERE
                        pq.target_post_id = replied.id_post AND
                        pq.type = 'quote' AND
                        pq.id_member = ${data.member.id}
                ) as is_quoted,
                EXISTS (
                    SELECT 1 FROM
                        post pq
                    WHERE
                        pq.target_post_id = replied.id_post AND
                        pq.type = 'shared' AND
                        pq.id_member = ${data.member.id}
                ) as is_shared,
                jsonb_build_object (
                    'id', member_replied.id_member,
                    'name', member_replied.name_member,
                    'username', member_replied.username_member,
                    'role', member_replied.role_member,
                    'icon_url', icon_replied.url
                ) AS creator
            FROM 
                post replied
            LEFT JOIN
                member member_replied ON replied.id_member = member_replied.id_member
            LEFT JOIN
                image icon_replied ON icon_replied.member_id = member_replied.id_member AND icon_replied.type = 'icon'
            INNER JOIN 
                thread ph ON replied.id_post = ph.target_post_id AND ph.type = 'reply'
        )

        SELECT 
            th.*,
            COALESCE(
                (
                    SELECT jsonb_agg(media.url ORDER BY media.id ASC)
                    FROM image media 
                    WHERE media.post_id = th.id AND media.type = 'media'
                ), '[]'::jsonb
            ) AS media,
            jsonb_build_object (
                'url', spotify.url,
                'title', spotify.title,
                'iframe_url', spotify.iframe_url,
                'thumbnail_url', spotify.thumbnail_url
            ) AS spotify,
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
                    ), '[]'::jsonb),
                    'spotify', jsonb_build_object(
                        'id', tspoty.id,
                        'title', tspoty.title,
                        'iframe_url', tspoty.iframe_url,
                        'thumbnail_url', tspoty.thumbnail_url
                    )
                )
                FROM post tp
                LEFT JOIN member tm ON tp.id_member = tm.id_member
                LEFT JOIN image ticon ON ticon.member_id = tm.id_member AND ticon.type = 'icon'
                LEFT JOIN embed tspoty ON tspoty.post_id = tp.id_post AND tspoty.type = 'post'
                WHERE tp.id_post = th.target_post_id
            ), 'null'::jsonb) AS target_post
        FROM 
            thread th
        LEFT JOIN 
            image media ON media.post_id = th.id AND media.type = 'media'
        LEFT JOIN
            embed spotify ON spotify.post_id = th.id AND spotify.type = 'post'
        WHERE
            th.id != ${data.id}
        GROUP BY 
            th.id, 
            th.content, 
            th.date, 
            th.upvotes_count, 
            th.comments_count, 
            th.is_upvoted, 
            th.creator,
            th.target_post_id,
            th.type,
            th.quotes_count,
            th.is_quoted,
            th.shared_count,
            th.is_shared
        ORDER BY 
            th.date 
        DESC
        LIMIT 10 
        OFFSET ${data.offset}; 
    `;
};