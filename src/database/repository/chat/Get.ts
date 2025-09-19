import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export async function Get (data: {
    member: any;
    offset: number;
}) {
    try {
        return await Postgres.query()`
            WITH selected_chats AS (
                SELECT c.*
                FROM participant p1
                JOIN chat c ON c.id = p1.chat_id
                WHERE 
                    c.type = 'private' AND 
                    p1.member_id = ${data.member.id}
                OFFSET ${data.offset}
                LIMIT 20
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
                WHERE p.chat_id IN (SELECT id FROM selected_chats)
                GROUP BY p.chat_id
            ),

            last_messages_json AS (
                SELECT
                    m.chat_id,
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
                        ORDER BY m.created_at DESC
                    ) AS messages
                FROM (
                    SELECT *
                    FROM (
                        SELECT *,
                            ROW_NUMBER() OVER (PARTITION BY chat_id ORDER BY created_at DESC) AS rn
                        FROM message
                        WHERE chat_id IN (SELECT id FROM selected_chats)
                    ) sub
                    WHERE rn > 0
                    AND rn <= 0 + 20
                ) m
                GROUP BY m.chat_id
            ),

            latest_message_per_chat AS (
                SELECT chat_id, MAX(created_at) AS latest_message_at
                FROM message
                WHERE chat_id IN (SELECT id FROM selected_chats)
                GROUP BY chat_id
            )

            SELECT
                c.*,
                p.participants,
                COALESCE(m.messages, '[]'::json) AS messages,
                COALESCE(l.latest_message_at, '-infinity'::timestamp) AS latest_message_at
            FROM selected_chats c
            LEFT JOIN participants_json p ON c.id = p.chat_id
            LEFT JOIN last_messages_json m ON c.id = m.chat_id
            LEFT JOIN latest_message_per_chat l ON c.id = l.chat_id
            ORDER BY latest_message_at DESC;
        `;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError('Error while creating chat.');
        };
    };
};