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
                p.images_post AS images,
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
                    'icon_url', m.icon_url
                ) AS creator
            FROM
                post p
            LEFT JOIN
                member m ON p.id_member = m.id_member
            WHERE
                p.id_post_replied IS NULL AND
                (${data.id_member}::TEXT IS NULL OR p.id_member = ${data.id_member}) AND
                (${data.username}::TEXT IS NULL OR m.username_member = ${data.username})
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
                    'icon_url', m.icon_url
                ) AS creator
            FROM
                post p
            LEFT JOIN
                member m ON p.id_member = m.id_member
            LEFT JOIN
                follow f ON f.id_member_followed = p.id_member
            WHERE
                p.id_post_replied IS NULL AND
                f.id_member_follower = ${data.member.id}
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
                    'icon_url', m.icon_url
                ) AS creator
            FROM
                post p
            LEFT JOIN
                member m ON p.id_member = m.id_member
            WHERE
                p.id_post = ${data.id_post};
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
                    'icon_url', m.icon_url
                ) AS creator
            FROM
                post p
            LEFT JOIN
                member m ON p.id_member = m.id_member
            WHERE
                p.id_post_replied = ${data.id_post}
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
                        SELECT 1 FROM
                            upvote up
                        WHERE 
                            up.id_post = original.id_post AND 
                            up.id_member_upvote = ${data.id_member}               
                    ) as is_upvoted,
                    jsonb_build_object (
                        'id', member_original.id_member,
                        'name', member_original.name_member,
                        'username', member_original.username_member,
                        'role', member_original.role_member,
                        'icon_url', member_original.icon_url
                    ) AS creator
                FROM 
                    post original
                LEFT JOIN
                    member member_original ON original.id_member = member_original.id_member
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
                        SELECT 1 FROM
                            upvote up
                        WHERE 
                            up.id_post = replied.id_post AND 
                            up.id_member_upvote = ${data.id_member}               
                    ) as is_upvoted,
                    jsonb_build_object (
                        'id', member_replied.id_member,
                        'name', member_replied.name_member,
                        'username', member_replied.username_member,
                        'role', member_replied.role_member,
                        'icon_url', member_replied.icon_url
                    ) AS creator
                FROM 
                    post replied
                LEFT JOIN
                    member member_replied ON replied.id_member = member_replied.id_member
                INNER JOIN 
                    thread ph ON replied.id_post = ph.id_post_replied
            )
            SELECT * FROM 
                thread
            ORDER BY 
                id DESC;
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
    images: string[];
    id_replied_post: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT insert_post (
                ${data.id_member},
                ${data.content},
                ${new Date().toISOString()},
                ${data.images || []},
                ${data.id_replied_post}
            );
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

export const postRepository = {
    get,
    getFollowing,
    getById,
    getComments,
    getThread,
    post,
    remove
}