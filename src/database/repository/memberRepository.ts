import postgres from "postgres";
import GenericError from "../../errors/GenericError";
import DatabaseError from "../../errors/DatabaseError";
import Postgres from "../Postgres";
import NotFoundError from "../../errors/NotFoundError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { Member } from "../models/Member";
import InvalidArgumentError from "../../errors/InvalidArgumentError";
import Password from "../../helpers/Password";
import ImgBB from "../../helpers/ImgBB";
import UpdateUsername from "./member/UpdateUsername";
import UpdatePassword from "./member/UpdatePassword";

const getById = async (data: {
    transaction?: postgres.TransactionSql<{}>;
    id: number;
}) => {
    try {
        let response: any;

        const T = async (_transaction: postgres.TransactionSql<{}>) => {
            const qMember = await _transaction`
                SELECT 
                    m.id_member,
                    m.username_member,
                    m.name_member,
                    m.date_creation_member,
                    m.bio_member,
                    icon.url AS icon_url,
                    m.role_member
                FROM
                    member m 
                LEFT JOIN
                    image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                WHERE
                    m.id_member = ${data.id};
            `;

            if (!qMember[0]) throw new NotFoundError("No se ha encontrado al miembro.");
            response = qMember[0];
        }

        data.transaction ?
            await T(data.transaction) :
            await Postgres.query().begin(async t => T(t));

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getPrivateByUsername = async (data: {
    transaction?: postgres.TransactionSql<{}>;
    username: string;
}) => {
    try {
        let response: Member;

        const T = async (_transaction: postgres.TransactionSql<{}>) => {
            const qMember: Member[] = await _transaction`
                SELECT * FROM
                    member
                WHERE
                    username_member = ${data.username};
            `;

            if (!qMember[0]) throw new UnauthorizedError("Algunas de tus credenciales son incorrectas.");
            response = qMember[0];
        }

        data.transaction ?
            await T(data.transaction) :
            await Postgres.query().begin(async t => T(t));

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getByUsername = async (data: {
    id_logged_member: string;
    username: string;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                m.id,
                m.username,
                m.name,
                m.role,
                m.bio,
                m.created_at,
                m.location,
                m.link,
                i.url AS icon_url,
                b.url AS banner_url,
                (SELECT COUNT(*) FROM 
                    follow f 
                WHERE
                    f.oomfy_id_followed = m.id) AS followers_count,
                (SELECT COUNT(*) FROM 
                    follow f 
                WHERE
                    f.oomfy_id_follower = m.id) AS followed_count,
                EXISTS (
                    SELECT 1 FROM
                        follow f
                    WHERE 
                        f.oomfy_id_follower = ${data.id_logged_member} AND 
                        f.oomfy_id_followed = m.id
                ) as is_followed,
                EXISTS (
                    SELECT 1 FROM
                        follow f
                    WHERE
                        f.oomfy_id_follower = m.id AND
                        f.oomfy_id_followed = ${data.id_logged_member}    
                ) as is_follower
            FROM
                oomfy m
            LEFT JOIN
                icon i ON i.id = m.id
            LEFT JOIN
                banner b ON b.id = m.id
            WHERE
                m.username = ${data.username};
        `;

        if (!response[0]) throw new NotFoundError("Este usuario no existe.");
        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const updateName = async (data: {
    id_member: number;
    name: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                name_member = ${data.name}
            WHERE
                id_member = ${data.id_member};
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

const updateUsername = async (data: {
    id_member: number;
    username: string;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            await transaction`
                SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            `;

            const qUsername = await transaction`
                SELECT * FROM
                    member
                WHERE
                    id_member != ${data.id_member} AND
                    username_member = ${data.username};
            `;

            if (qUsername[0]) throw new InvalidArgumentError("Ese nombre de usuario ya está en uso.");

            await transaction`
                UPDATE
                    member
                SET
                    username_member = ${data.username}
                WHERE
                    id_member = ${data.id_member};
            `;
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

const updateBio = async (data: {
    id_member: number;
    bio: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                bio_member = ${data.bio}
            WHERE   
                id_member = ${data.id_member};
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

const updatePassword = async (data: {
    id_member: number;
    password: string;
    new_password: string;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            const qPassword: Array<{
                password_member: string;
            }> = await transaction`
                SELECT 
                    password_member 
                FROM
                    member
                WHERE
                    id_member = ${data.id_member};
            `;

            if (!qPassword[0]) throw new NotFoundError("No se ha encontrado al usuario.");

            if (!await Password.compare(data.password, qPassword[0].password_member)) throw new UnauthorizedError("Tu clave anterior es incorrecta.");

            await transaction`
                UPDATE
                    member
                SET
                    password_member = ${data.new_password}
                WHERE   
                    id_member = ${data.id_member};
            `;
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

const updateIcon = async (data: {
    id_member: number;
    imgbb_id?: string;
    url: string;
    delete_url?: string;
    source: 'imgbb' | 'other';
}) => {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            response = await transaction`
                SELECT * FROM
                    image
                WHERE
                    member_id = ${data.id_member} AND
                    type = 'icon';
            `;

            if (response[0]) {
                if (response[0].type === 'imgbb') await ImgBB.delete(response[0].delete_url);
                
                response = await transaction`
                    UPDATE  
                        image
                    SET
                        imgbb_id = ${data.imgbb_id || null},
                        url = ${data.url},
                        delete_url = ${data.delete_url || null},
                        source = ${data.source}
                    WHERE
                        member_id = ${data.id_member} AND
                        type = 'icon'
                    RETURNING 
                        url;
                `;
            } else {
                if (!response[0]) {
                    response = await transaction`
                        INSERT INTO image (
                            source,
                            imgbb_id,
                            url,
                            delete_url,
                            type,
                            member_id,
                            post_id
                        ) VALUES (
                            ${data.source},
                            ${data.imgbb_id || null},
                            ${data.url},
                            ${data.delete_url || null},
                            'icon',
                            ${data.id_member},
                            null
                        )
                        RETURNING url;
                    `;
                }
            }
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

const updateBanner = async (data: {
    id_member: number;
    imgbb_id?: string;
    url: string;
    delete_url?: string;
    source: 'imgbb' | 'other';
}) => {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            response = await transaction`
                SELECT * FROM
                    image
                WHERE
                    member_id = ${data.id_member} AND
                    type = 'banner';
            `;

            if (response[0]) {
                if (response[0].type === 'imgbb') await ImgBB.delete(response[0].delete_url);
                
                response = await transaction`
                    UPDATE  
                        image
                    SET
                        imgbb_id = ${data.imgbb_id || null},
                        url = ${data.url},
                        delete_url = ${data.delete_url || null},
                        source = ${data.source}
                    WHERE
                        member_id = ${data.id_member} AND
                        type = 'banner'
                    RETURNING 
                        url;
                `;
            } else {
                if (!response[0]) {
                    response = await transaction`
                        INSERT INTO image (
                            source,
                            imgbb_id,
                            url,
                            delete_url,
                            type,
                            member_id,
                            post_id
                        ) VALUES (
                            ${data.source},
                            ${data.imgbb_id || null},
                            ${data.url},
                            ${data.delete_url || null},
                            'banner',
                            ${data.id_member},
                            null
                        )
                        RETURNING url;
                    `;
                }
            }
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

const updateProfile = async (data: {
    id_member: number;
    name: string;
    bio: string;
    location: string;
    link: string;
    icon: {
        url: string;
        imgbb_id: string;
        delete_url: string;
        source: "imgbb" | "other";
    } | null,
    icon_action: 'none' | 'update' | 'delete';
    banner: {
        url: string;
        imgbb_id: string;
        delete_url: string;
        source: "imgbb" | "other";
    } | null;
    banner_action: 'none' | 'update' | 'delete';
}) => {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            await transaction`
                UPDATE
                    member
                SET
                    name_member = ${data.name},
                    bio_member = ${data.bio},
                    location = ${data.location},
                    link = ${data.link}
                WHERE
                    id_member = ${data.id_member};
            `;

            if (data.icon_action != 'none') {
                if (data.icon_action === 'delete') {
                    await transaction`
                        DELETE FROM
                            image
                        WHERE
                            member_id = ${data.id_member} AND
                            type = 'icon';
                    `;
                } else {
                    const queryIcon = await transaction`
                        SELECT * FROM
                            image
                        WHERE
                            member_id = ${data.id_member} AND
                            type = 'icon';
                    `;

                    if (queryIcon[0]) {
                        if (queryIcon[0].type === 'imgbb') await ImgBB.delete(queryIcon[0].delete_url);
                        
                        await transaction`
                            UPDATE  
                                image
                            SET
                                imgbb_id = ${data.icon.imgbb_id || null},
                                url = ${data.icon.url},
                                delete_url = ${data.icon.delete_url || null},
                                source = ${data.icon.source}
                            WHERE
                                member_id = ${data.id_member} AND
                                type = 'icon';
                        `;
                    } else {
                        if (!queryIcon[0]) {
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
                                    ${data.icon.source},
                                    ${data.icon.imgbb_id || null},
                                    ${data.icon.url},
                                    ${data.icon.delete_url || null},
                                    'icon',
                                    ${data.id_member},
                                    null
                                );
                            `;
                        }
                    }
                }
            }

            if (data.banner_action != 'none') {
                if (data.banner_action === 'delete') {
                    await transaction`
                        DELETE FROM
                            image
                        WHERE
                            member_id = ${data.id_member} AND
                            type = 'banner';
                    `;
                } else {
                    const queryBanner = await transaction`
                        SELECT * FROM
                            image
                        WHERE
                            member_id = ${data.id_member} AND
                            type = 'banner';
                    `;

                    if (queryBanner[0]) {
                        if (queryBanner[0].type === 'imgbb') await ImgBB.delete(queryBanner[0].delete_url);
                        
                        await transaction`
                            UPDATE  
                                image
                            SET
                                imgbb_id = ${data.banner.imgbb_id || null},
                                url = ${data.banner.url},
                                delete_url = ${data.banner.delete_url || null},
                                source = ${data.banner.source}
                            WHERE
                                member_id = ${data.id_member} AND
                                type = 'banner';
                        `;
                    } else {
                        if (!queryBanner[0]) {
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
                                    ${data.banner.source},
                                    ${data.banner.imgbb_id || null},
                                    ${data.banner.url},
                                    ${data.banner.delete_url || null},
                                    'banner',
                                    ${data.id_member},
                                    null
                                );
                            `;
                        }
                    }
                }
            }

            response = await transaction`
                SELECT 
                    m.id_member AS id,
                    m.username_member AS username,
                    m.name_member AS name,
                    m.role_member AS role,
                    m.bio_member AS bio,
                    m.date_creation_member AS created_at,
                    m.location AS location,
                    m.link AS link,
                    icon.url AS icon_url,
                    banner.url AS banner_url
                FROM
                    member m
                LEFT JOIN
                    image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                LEFT JOIN
                    image banner ON banner.member_id = m.id_member AND banner.type = 'banner'
                WHERE
                    m.id_member = ${data.id_member};
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

export const memberRepository = {
    getById,
    getPrivateByUsername,
    getByUsername,
    updateName,
    updateBio,
    updatePassword,
    updateIcon,
    updateBanner,
    updateProfile,

    UpdateUsername,
    UpdatePassword
}