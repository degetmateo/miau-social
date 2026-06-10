import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";
import Follow from "./follow/Follow";
import Unfollow from "./follow/Unfollow";

const follow = async (data: {
    id_member_follower: string;
    id_member_followed: string;
}) => {
    try {
        return Follow(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const unfollow = async (data: {
    id_member_follower: string;
    id_member_followed: string;
}) => {
    try {
        return Unfollow(data);
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
                m2.id,
                m2.name,
                m2.username,
                m2.role,
                m2.bio,
                i.url AS icon_url
            FROM
                follow f, oomfy m1, oomfy m2
            LEFT JOIN
                icon i ON i.id = m2.id
            WHERE
                m1.username = ${data.username} AND
                f.oomfy_id_follower = m1.id AND
                f.oomfy_id_followed = m2.id
            ORDER BY
                m2.created_at DESC
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
                m2.id,
                m2.username,
                m2.name,
                m2.role,
                m2.bio,
                i.url AS icon_url
            FROM
                follow f, oomfy m1, oomfy m2
            LEFT JOIN
                icon i ON i.id = m2.id
            WHERE
                m1.username = ${data.username} AND
                f.oomfy_id_follower = m2.id AND
                f.oomfy_id_followed = m1.id
            ORDER BY
                m2.created_at DESC
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

const getRandomFollowers = async (data: {
    member: any;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT
                m2.id,
                m2.username,
                m2.name,
                m2.role,
                m2.bio,
                i.url AS icon_url
            FROM
                follow f, oomfy m1, oomfy m2
            LEFT JOIN
                icon i ON i.id = m2.id
            WHERE
                m1.username = ${data.member.username} AND
                f.oomfy_id_follower = m2.id AND
                f.oomfy_id_followed = m1.id
            ORDER BY
                RANDOM()
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
};

export const followRepository = {
    follow,
    unfollow,
    getFollowed,
    getFollowers,
    getRandomFollowers
}