import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";

const follow = async (data: {
    id_member_follower: number;
    id_member_followed: number;
}) => {
    try {
        const response = await Postgres.query()`
            INSERT INTO
                follow
            VALUES (
                ${data.id_member_follower},
                ${data.id_member_followed}
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

const unfollow = async (data: {
    id_member_follower: number;
    id_member_followed: number;
}) => {
    try {
        const response = await Postgres.query()`
            DELETE FROM
                follow
            WHERE
                id_member_follower = ${data.id_member_follower} AND
                id_member_followed = ${data.id_member_followed};
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

const getFollowed = async (data: {
    username: string;
    offset: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT
                m2.id_member AS id,
                m2.name_member AS name,
                m2.username_member AS username,
                m2.role_member AS role,
                m2.bio_member AS bio,
                m2.icon_url
            FROM
                follow f, member m1, member m2
            WHERE
                m1.username_member = ${data.username} AND
                f.id_member_follower = m1.id_member AND
                f.id_member_followed = m2.id_member
            ORDER BY
                m2.id_member DESC
            OFFSET
                ${data.offset}
            LIMIT
                20;
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

const getFollowers = async (data: {
    username: string;
    offset: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT
                m2.id_member AS id,
                m2.username_member AS username,
                m2.name_member AS name,
                m2.role_member AS role,
                m2.bio_member AS bio,
                m2.icon_url
            FROM
                follow f, member m1, member m2
            WHERE
                m1.username_member = ${data.username} AND
                f.id_member_follower = m2.id_member AND
                f.id_member_followed = m1.id_member
            ORDER BY
                m2.id_member DESC
            OFFSET
                ${data.offset}
            LIMIT
                20;
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

export const followRepository = {
    follow,
    unfollow,
    getFollowed,
    getFollowers
}