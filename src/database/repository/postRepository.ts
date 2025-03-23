import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import NotFoundError from "../../errors/NotFoundError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import ImgBB from "../../helpers/ImgBB";
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
                p.images_post AS images,
                p.id_post_replied,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count,
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
                COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}') AS media
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
                (${data.username}::TEXT IS NULL OR m.username_member = ${data.username})
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.images_post,
                p.id_post_replied,
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
                p.images_post AS images,
                p.id_post_replied,
                (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count,
                (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count,
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
                COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}') AS media
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
                p.id_post_replied IS NULL AND
                f.id_member_follower = ${data.member.id}
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.images_post,
                p.id_post_replied,
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
                p.images_post AS images,
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
                COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}') AS media
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
                p.images_post,
                p.id_post_replied,
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
                p.images_post AS images,
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
                COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}') AS media
            FROM
                post p
            LEFT JOIN
                member m ON p.id_member = m.id_member
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            LEFT JOIN
                image media ON media.post_id = p.id_post AND media.type = 'media'
            WHERE
                p.id_post_replied = ${data.id_post}
            GROUP BY
                p.id_post,
                p.content_post,
                p.date_post,
                p.images_post,
                p.id_post_replied,
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
                    original.images_post AS images,
                    original.id_post_replied,
                    (SELECT COUNT(*) FROM upvote up WHERE up.id_post = original.id_post) as upvotes_count,
                    (SELECT COUNT(*) FROM post pr WHERE pr.id_post_replied = original.id_post) as comments_count,
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
                    replied.images_post AS images,
                    replied.id_post_replied,
                    (SELECT COUNT(*) FROM upvote up WHERE up.id_post = replied.id_post) as upvotes_count,
                    (SELECT COUNT(*) FROM post pr WHERE pr.id_post_replied = replied.id_post) as comments_count,
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
                    thread ph ON replied.id_post = ph.id_post_replied
            )

            SELECT 
                th.*,
                COALESCE(ARRAY_AGG(media.url) FILTER (WHERE media.url IS NOT NULL), '{}') AS media
            FROM 
                thread th
            LEFT JOIN 
                image media ON media.post_id = th.id AND media.type = 'media'
            GROUP BY 
                th.id, th.content, th.date, th.images, th.id_post_replied, th.upvotes_count, th.comments_count, th.is_upvoted, th.creator
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
    id_replied_post: number;
}) => {
    try {
        let IDPost = -1;
        await Postgres.query().begin(async transaction => {
            await transaction`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

            if (data.id_replied_post) {
                const qRepliedPost = await transaction`
                    SELECT 
                        id_post
                    FROM
                        post
                    WHERE
                        id_post = ${data.id_replied_post};
                `;
                if (!qRepliedPost[0]) throw new NotFoundError("No se ha encontrado el post al que estás respondiendo.");
            }

            const qInsert: Array<{ id_post: number }> = await transaction`
                INSERT INTO
                    post (id_member, content_post, date_post, id_post_replied)
                VALUES (
                    ${data.id_member},
                    ${data.content},
                    ${new Date().toISOString()},
                    ${data.id_replied_post}
                )
                RETURNING id_post;
            `;
            IDPost = qInsert[0].id_post;

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
        });

        return IDPost;
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