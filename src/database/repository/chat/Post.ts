import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import NotFoundError from "../../../errors/NotFoundError";
import Postgres from "../../Postgres";

export async function Post (data: {
    member: any;
    username: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async (transaction) => {
            const member = (await transaction`
                SELECT 
                    id_member as id,
                    name_member as name,
                    username_member as username,
                    role_member as role
                FROM 
                    member
                WHERE
                    username_member = ${data.username};
            `)[0];

            if (!member) throw new NotFoundError('Member not found.');
            if (member.id == data.member.id) throw new GenericError('You cannot create a chat with yourself.', 400);

            const chat = (await transaction`
                WITH matched_chat AS (
                SELECT p1.chat_id
                FROM participant p1
                JOIN participant p2 ON p1.chat_id = p2.chat_id
                JOIN chat c ON c.id = p1.chat_id
                WHERE c.type = 'private'
                    AND p1.member_id = ${data.member.id}
                    AND p2.member_id = ${member.id}
                LIMIT 1
                ),

                participants_json AS (
                SELECT
                    p.chat_id,
                    json_agg(
                    jsonb_build_object(
                        'id', p.id,
                        'member_id', p.member_id,
                        'joined_at', p.joined_at,
                        'role', p.role,
                        'member', jsonb_build_object(
                            'id', m.id_member,
                            'username', m.username_member,
                            'name', m.name_member,
                            'role', m.role_member,
                            'icon_url', i_icon.url,
                            'banner_url', i_banner.url
                        )
                    )
                    ) AS participants
                FROM participant p
                LEFT JOIN member m ON p.member_id = m.id_member
                LEFT JOIN image i_icon ON i_icon.member_id = m.id_member AND i_icon.type = 'icon'
                LEFT JOIN image i_banner ON i_banner.member_id = m.id_member AND i_banner.type = 'banner'
                WHERE p.chat_id IN (SELECT chat_id FROM matched_chat)
                GROUP BY p.chat_id
                ),

                last_messages_json AS (
                SELECT m.chat_id,
                        json_agg(
                        jsonb_build_object(
                            'id', m.id,
                            'member_id', m.member_id,
                            'content', m.content,
                            'created_at', m.created_at,
                            'updated_at', m.updated_at,
                            'status', m.status,
                            'target_message_id', m.target_message_id
                        )
                        ORDER BY m.created_at ASC
                        ) AS messages
                FROM (
                    SELECT *
                    FROM message
                    WHERE chat_id IN (SELECT chat_id FROM matched_chat)
                    ORDER BY chat_id, created_at DESC
                ) m
                GROUP BY m.chat_id
                )

                SELECT
                c.*,
                p.participants,
                COALESCE(m.messages, '[]'::json) AS messages
                FROM matched_chat c
                LEFT JOIN participants_json p ON c.chat_id = p.chat_id
                LEFT JOIN last_messages_json m ON c.chat_id = m.chat_id;
            `)[0];

            response = chat;

            if (!chat) {
                const newChat = (await transaction`
                    INSERT INTO 
                        chat (
                            created_at,
                            type,
                            updated_at
                        )
                        VALUES (
                            ${new Date()},
                            'private',
                            ${new Date()}
                        )
                    RETURNING
                        *;
                `)[0];

                const p1 = (await transaction`
                    INSERT INTO
                        participant (
                            member_id,
                            chat_id,
                            joined_at,
                            role
                        )
                        VALUES (
                            ${data.member.id},
                            ${newChat.id},
                            ${new Date()},
                            'member'
                        )
                    RETURNING
                        *;
                `)[0];

                const p2 = (await transaction`
                    INSERT INTO
                        participant (
                            member_id,
                            chat_id,
                            joined_at,
                            role
                        )
                        VALUES (
                            ${member.id},
                            ${newChat.id},
                            ${new Date()},
                            'member'
                        )
                    RETURNING
                        *;
                `)[0];

                const m1 = (await transaction`
                    SELECT
                        m.id_member as id,
                        m.username_member as username,
                        m.name_member as name,
                        m.role_member as role,
                        icon.url as icon_url
                    FROM

                        member m
                    LEFT JOIN 
                        image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                    WHERE
                        m.id_member = ${data.member.id};
                `)[0];

                p1.member = m1;

                const m2 = (await transaction`
                    SELECT
                        m.id_member as id,
                        m.username_member as username,
                        m.name_member as name,
                        m.role_member as role,
                        icon.url as icon_url
                    FROM
                        member m
                    LEFT JOIN 
                        image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                    WHERE
                        m.id_member = ${member.id};
                `)[0];

                p2.member = m2;

                response = newChat;
                response.chat_id = newChat.id;
                response.participants = [p1, p2];
                response.messages = [];
            };
        });

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError('Error while creating chat.');
        };
    };
};