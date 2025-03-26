import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import NotFoundError from "../../errors/NotFoundError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import Postgres from "../Postgres";

const get = async (data: {
    member: {
        id: number;
        username: string;
        role: string;
    };
    offset: number;
    id_member: number | null;
    username: string | null;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                p.id_post AS id,
                p.content_post AS content,
                p.date_post AS date,
                p.type,
                p.target_post_id,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply') as comments_count,
                EXISTS (
                    SELECT 1 FROM
                        upvote
                    WHERE 
                        id_post = p.id_post AND 
                        id_member_upvote = ${data.member.id}               
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
                COALESCE((
                    SELECT jsonb_build_object(
                        'id', tp.id_post,
                        'content', tp.content_post,
                        'date', tp.date_post,
                        'type', tp.type,
                        'target_post_id', tp.target_post_id,
                        'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                        'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
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
            WHERE
                p.id_post_replied IS NULL AND
                (${data.id_member}::TEXT IS NULL OR p.id_member = ${data.id_member}) AND
                (${data.username}::TEXT IS NULL OR m.username_member = ${data.username}) AND
                p.type != 'reply'
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.type,
                p.target_post_id,
                m.id_member,
                icon.url
            ORDER BY 
                p.date_post 
            DESC
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

const getFollowing = async (data: {
    member: {
        id: number;
        username: string;
        role: string;
    };
    offset: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                p.id_post AS id,
                p.content_post AS content,
                p.date_post AS date,
                p.type,
                p.target_post_id,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply') as comments_count,
                EXISTS (
                    SELECT 1 FROM
                        upvote
                    WHERE 
                        id_post = p.id_post AND 
                        id_member_upvote = ${data.member.id}               
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
                COALESCE((
                    SELECT jsonb_build_object(
                        'id', tp.id_post,
                        'content', tp.content_post,
                        'date', tp.date_post,
                        'type', tp.type,
                        'target_post_id', tp.target_post_id,
                        'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                        'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
                        'is_upvoted', EXISTS (
                            SELECT 1 FROM upvote
                            WHERE id_post = tp.id_post 
                            AND id_member_upvote = ${data.member.id}               
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
                follow f ON f.id_member_followed = p.id_member
            LEFT JOIN
                image media ON media.post_id = p.id_post AND media.type = 'media'
            WHERE
                f.id_member_follower = ${data.member.id} AND
                p.type != 'reply'
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.type,
                p.target_post_id,
                m.id_member,
                icon.url
            ORDER BY 
                p.date_post DESC
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

const getById = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                p.id_post AS id,
                p.content_post AS content,
                p.date_post AS date,
                p.type,
                p.target_post_id,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply') as comments_count,
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
                COALESCE((
                    SELECT jsonb_build_object(
                        'id', tp.id_post,
                        'content', tp.content_post,
                        'date', tp.date_post,
                        'type', tp.type,
                        'target_post_id', tp.target_post_id,
                        'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                        'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
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
            WHERE
                p.id_post = ${data.id_post}
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.type,
                p.target_post_id,
                m.id_member,
                icon.url;
        `;

        if (!response[0]) throw new NotFoundError("No se ha encontrado la publicación especificada.");

        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getComments = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                p.id_post AS id,
                p.content_post AS content,
                p.date_post AS date,
                p.type,
                p.target_post_id,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE target_post_id = p.id_post AND type = 'reply') as comments_count,
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
                COALESCE((
                    SELECT jsonb_build_object(
                        'id', tp.id_post,
                        'content', tp.content_post,
                        'date', tp.date_post,
                        'type', tp.type,
                        'target_post_id', tp.target_post_id,
                        'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                        'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
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
            WHERE
                p.target_post_id = ${data.id_post} AND
                p.type = 'reply'
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.type,
                p.target_post_id,
                m.id_member,
                icon.url
            ORDER BY 
                p.date_post DESC
            LIMIT 20;
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

const getThread = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        const response = await Postgres.query()`
            WITH RECURSIVE thread AS (
                SELECT 
                    original.id_post AS id,
                    original.content_post AS content,
                    original.date_post AS date,
                    original.target_post_id,
                    original.type,
                    (SELECT COUNT(*) FROM upvote up WHERE up.id_post = original.id_post) as upvotes_count,
                    (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = original.id_post AND pr.type = 'reply') as comments_count,
                    EXISTS (
                        SELECT 1 FROM upvote up
                        WHERE up.id_post = original.id_post 
                        AND up.id_member_upvote = ${data.id_member}               
                    ) as is_upvoted,
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
                    original.id_post = ${data.id_post}
                
                UNION ALL
                
                SELECT 
                    replied.id_post AS id,
                    replied.content_post AS content,
                    replied.date_post AS date,
                    replied.target_post_id,
                    replied.type,
                    (SELECT COUNT(*) FROM upvote up WHERE up.id_post = replied.id_post) as upvotes_count,
                    (SELECT COUNT(*) FROM post pr WHERE pr.target_post_id = replied.id_post AND pr.type = 'reply') as comments_count,
                    EXISTS (
                        SELECT 1 FROM upvote up
                        WHERE up.id_post = replied.id_post 
                        AND up.id_member_upvote = ${data.id_member}               
                    ) as is_upvoted,
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
                COALESCE((
                    SELECT jsonb_build_object(
                        'id', tp.id_post,
                        'content', tp.content_post,
                        'date', tp.date_post,
                        'type', tp.type,
                        'target_post_id', tp.target_post_id,
                        'upvotes_count', (SELECT COUNT(*) FROM upvote WHERE id_post = tp.id_post),
                        'comments_count', (SELECT COUNT(*) FROM post WHERE target_post_id = tp.id_post AND type = 'reply'),
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
                    WHERE tp.id_post = th.target_post_id
                ), 'null'::jsonb) AS target_post
            FROM 
                thread th
            LEFT JOIN 
                image media ON media.post_id = th.id AND media.type = 'media'
            GROUP BY 
                th.id, 
                th.content, 
                th.date, 
                th.upvotes_count, 
                th.comments_count, 
                th.is_upvoted, 
                th.creator,
                th.target_post_id,
                th.type
            ORDER BY 
                th.id DESC;
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

const post = async (data: {
    id_member: number;
    content: string;
    images: any[];
    type: 'default' | 'reply' | 'quote';
    target_id: number;
}) => {
    try {
        let response = null;
        await Postgres.query().begin(async transaction => {
            await transaction`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

            if (data.target_id) {
                const qRepliedPost = await transaction`
                    SELECT 
                        id_post
                    FROM
                        post
                    WHERE
                        id_post = ${data.target_id};
                `;
                if (!qRepliedPost[0]) throw new NotFoundError("No se ha encontrado el post objetivo.");
            }

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
                WHERE
                    p.id_post = ${IDPost}
                GROUP BY
                    p.id_post,
                    p.content_post,
                    p.date_post,
                    p.type,
                    p.target_post_id,
                    m.id_member,
                    icon.url;
            `;
        });

        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const remove = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            await transaction`
                DELETE FROM 
                    upvote
                WHERE
                    id_post = ${data.id_post};
            `;

            const qDeleteImages = await transaction`
                DELETE FROM 
                    image
                WHERE
                    post_id = ${data.id_post}
                RETURNING *;
            `;

            const qDelete = await transaction`
                DELETE FROM
                    post
                WHERE
                    id_post = ${data.id_post} AND
                    id_member = ${data.id_member}
                RETURNING *;
            `;

            if (!qDelete[0]) throw new UnauthorizedError("Error de autentificación.");
        });

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const removeAdmin = async (data: {
    id_post: number;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            await transaction`
                DELETE FROM 
                    upvote
                WHERE
                    id_post = ${data.id_post};
            `;

            const qDelete = await transaction`
                DELETE FROM
                    post
                WHERE
                    id_post = ${data.id_post}
                RETURNING *;
            `;

            if (!qDelete[0]) throw new DatabaseError("Ha ocurrido un error inesperado.");
        });

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

export const postRepository = {
    get,
    getFollowing,
    getById,
    getComments,
    getThread,
    post,
    remove,
    removeAdmin
}