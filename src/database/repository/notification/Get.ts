import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export default async function Get (data: {
    id_member: number;
    offset: number;
}) {
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
                    'target_post_id', p.target_post_id,
                    'content', p.content_post,
                    'date', p.date_post,
                    'type', p.type,
                    'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post),
                    'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply'),
                    'quotes_count', (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'quote'),
                    'shared_count', (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'shared'),
                    'is_upvoted', EXISTS (
                        SELECT 1 FROM upvote
                        WHERE id_post = p.id_post 
                        AND id_member_upvote = ${data.id_member}               
                    ),
                    'is_quoted', EXISTS (
                        SELECT 1 FROM
                            post
                        WHERE
                            target_post_id = p.id_post AND
                            type = 'quote' AND
                            id_member = ${data.id_member}
                    ),
                    'is_shared', EXISTS (
                        SELECT 1 FROM
                            post
                        WHERE
                            target_post_id = p.id_post AND
                            type = 'shared' AND
                            id_member = ${data.id_member}
                    ),
                    'creator', jsonb_build_object(
                        'id', m.id_member,
                        'name', m.name_member,
                        'username', m.username_member,
                        'role', m.role_member,
                        'icon_url', icon.url
                    ),
                    'media', COALESCE((
                        SELECT jsonb_agg(tmedia.url ORDER BY tmedia.id ASC)
                        FROM image tmedia 
                        WHERE tmedia.post_id = p.id_post AND tmedia.type = 'media'
                    ), '[]'::jsonb),
                    'spotify', jsonb_build_object(
                        'id', spotify.id,
                        'title', spotify.title,
                        'iframe_url', spotify.iframe_url,
                        'thumbnail_url', spotify.thumbnail_url
                    ),
                    'target_post', COALESCE((
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
                                AND id_member_upvote = ${data.id_member}               
                            ),
                            'is_quoted', EXISTS (
                                SELECT 1 FROM
                                    post
                                WHERE
                                    target_post_id = tp.id_post AND
                                    type = 'quote' AND
                                    id_member = ${data.id_member}
                            ),
                            'is_shared', EXISTS (
                                SELECT 1 FROM
                                    post
                                WHERE
                                    target_post_id = tp.id_post AND
                                    type = 'shared' AND
                                    id_member = ${data.id_member}
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
                            ),
                            'target_post', COALESCE((
                                SELECT jsonb_build_object(
                                    'id', ttp.id_post,
                                    'content', ttp.content_post,
                                    'date', ttp.date_post,
                                    'type', ttp.type,
                                    'target_post_id', ttp.target_post_id,
                                    'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = ttp.id_post),
                                    'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = ttp.id_post AND type = 'reply'),
                                    'quotes_count', (SELECT COUNT(*) FROM post WHERE target_post_id = ttp.id_post AND type = 'quote'),
                                    'shared_count', (SELECT COUNT(*) FROM post WHERE target_post_id = ttp.id_post AND type = 'shared'),
                                    'is_upvoted', EXISTS (
                                        SELECT 1 FROM upvote
                                        WHERE id_post = ttp.id_post 
                                        AND id_member_upvote = ${data.id_member}               
                                    ),
                                    'creator', jsonb_build_object(
                                        'id', ttm.id_member,
                                        'name', ttm.name_member,
                                        'username', ttm.username_member,
                                        'role', ttm.role_member,
                                        'icon_url', tticon.url
                                    ),
                                    'media', COALESCE((
                                        SELECT jsonb_agg(ttmedia.url ORDER BY ttmedia.id ASC)
                                        FROM image ttmedia 
                                        WHERE ttmedia.post_id = ttp.id_post AND ttmedia.type = 'media'
                                    ), '[]'::jsonb),
                                    'spotify', jsonb_build_object(
                                        'id', ttspoty.id,
                                        'title', ttspoty.title,
                                        'iframe_url', ttspoty.iframe_url,
                                        'thumbnail_url', ttspoty.thumbnail_url
                                    )
                                )
                                FROM post ttp
                                LEFT JOIN member ttm ON ttp.id_member = ttm.id_member
                                LEFT JOIN image tticon ON tticon.member_id = ttm.id_member AND tticon.type = 'icon'
                                LEFT JOIN embed ttspoty ON ttspoty.post_id = ttp.id_post AND ttspoty.type = 'post'
                                WHERE ttp.id_post = tp.target_post_id
                            ), 'null'::jsonb)
                        )
                        FROM post tp
                        LEFT JOIN member tm ON tp.id_member = tm.id_member
                        LEFT JOIN image ticon ON ticon.member_id = tm.id_member AND ticon.type = 'icon'
                        LEFT JOIN embed tspoty ON tspoty.post_id = tp.id_post AND tspoty.type = 'post'
                        WHERE tp.id_post = p.target_post_id
                    ), 'null'::jsonb)
                ) AS target_post
            FROM 
                notification n
            JOIN 
                member m ON m.id_member = n.id_member_target_notification
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            LEFT JOIN 
                post p ON (n.type_notification IN ('reply', 'upvote', 'quote', 'shared') AND n.id_post_target_notification = p.id_post)
            LEFT JOIN
                image media ON media.post_id = p.id_post AND media.type = 'media'
            LEFT JOIN
                embed spotify ON spotify.post_id = p.id_post AND spotify.type = 'post'
            WHERE 
                n.id_member = ${data.id_member}
            GROUP BY
                n.id_notification,
                n.date_notification,
                n.type_notification,
                n.status,
                m.id_member,
                icon.url,
                p.id_post,
                p.target_post_id,
                p.content_post,
                p.date_post,
                p.type,
                spotify.id,
                spotify.url,
                spotify.title,
                spotify.iframe_url,
                spotify.thumbnail_url
            ORDER BY 
                n.date_notification DESC
            LIMIT 20
            OFFSET ${data.offset};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};