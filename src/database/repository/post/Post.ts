import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import NotFoundError from "../../../errors/NotFoundError";
import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";
import { notificationRepository } from "../notificationRepository";

export default async function Post (data: {
    id_member: number;
    content: string;
    images: any[];
    type: 'default' | 'reply' | 'quote' | 'shared';
    target_id: number;
    spotify: {
        url: string;
        iframe_url: string;
        thumbnail_url: string;
        title: string;
    }
}) {
    let response = null;
    await Postgres.query().begin(async transaction => {
        await transaction`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

        let qTargetPost = null;
        if (data.target_id) {
            qTargetPost = (await transaction`
                SELECT 
                    id_post,
                    id_member
                FROM
                    post
                WHERE
                    id_post = ${data.target_id};
            `)[0];

            if (!qTargetPost) throw new NotFoundError("No se ha encontrado el post objetivo.");
        };

        const qInsert: Array<{ id_post: number }> = await transaction`
            INSERT INTO
                post (id_member, content_post, date_post, type, target_post_id)
            VALUES (
                ${data.id_member},
                ${data.content},
                ${new Date().toISOString()},
                ${data.type},
                ${data.target_id}
            )
            RETURNING id_post;
        `;
        const IDPost = qInsert[0].id_post;

        for (const image of data.images) {
            await transaction`
                INSERT INTO image (
                    source,
                    imgbb_id,
                    url,
                    delete_url,
                    type,
                    member_id,
                    post_id
                ) VALUES (
                    ${image.source},
                    ${image.imgbb_id || null},
                    ${image.url},
                    ${image.delete_url || null},
                    'media',
                    ${data.id_member},
                    ${IDPost}
                );
            `;
        }

        if (data.spotify) {
            (await transaction`
                INSERT INTO
                    embed (
                        type,
                        post_id,
                        source,
                        url,
                        title,
                        iframe_url,
                        thumbnail_url
                    )
                    VALUES (
                        'post',
                        ${IDPost},
                        'spotify',
                        ${data.spotify.url},
                        ${data.spotify.title},
                        ${data.spotify.iframe_url},
                        ${data.spotify.thumbnail_url}
                    );
            `);
        };

        response = await transaction`
            SELECT 
                p.id_post AS id,
                p.content_post AS content,
                p.date_post AS date,
                p.type AS type,
                p.target_post_id AS target_post_id,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count,
                EXISTS (
                    SELECT 1 FROM
                        upvote
                    WHERE 
                        id_post = p.id_post AND 
                        id_member_upvote = ${data.id_member}               
                ) as is_upvoted,
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
                        'comments_count', (SELECT COUNT(*) FROM post WHERE id_post_replied = tp.id_post),
                        'is_upvoted', EXISTS (
                            SELECT 1 FROM upvote
                            WHERE id_post = tp.id_post 
                            AND id_member_upvote = ${data.id_member}               
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
            LEFT JOIN
                embed spotify ON spotify.post_id = p.id_post AND spotify.type = 'post'
            WHERE
                p.id_post = ${IDPost}
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.type,
                p.target_post_id,
                m.id_member,
                icon.url,
                spotify.url,
                spotify.title,
                spotify.iframe_url,
                spotify.thumbnail_url;
        `;

        if (data.type != 'default' && qTargetPost) {
            if (data.id_member == qTargetPost.id_member) return;

            const qn = (await transaction`
                INSERT INTO 
                    notification (
                        id_member,
                        date_notification,
                        type_notification,
                        id_post_target_notification,
                        id_member_target_notification
                    )
                    VALUES (
                        ${qTargetPost.id_member},
                        NOW(),
                        ${data.type},
                        ${IDPost},
                        ${data.id_member}
                    );
            `)[0];

            const notification = await notificationRepository.TGetByID({
                id: qn.id_notification,
                transaction: transaction
            });

            const ms = WebSocket.members.get(qn.id_member);

            if (!ms) return;
            for (const s of ms.entries()) {
                WebSocket.io.to(s[0]).emit('socket-notification', notification);
            };
        };
    });
    return response[0];
};