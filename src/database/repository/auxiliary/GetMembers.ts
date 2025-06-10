import Postgres from "../../Postgres";

export default async function GetMembers (data: {
    query: string;
    filter: 'posts' | 'members';
    offset: number;
}) {
    return await Postgres.query()`
        SELECT
            m.id_member AS id,
            m.username_member AS username,
            m.name_member AS name,
            m.bio_member AS bio,
            icon.url AS icon_url,
            m.role_member AS role
        FROM
            member m
        LEFT JOIN
            image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
        WHERE
            m.name_member ILIKE '%' || ${data.query} || '%' OR
            m.username_member ILIKE '%' || ${data.query} || '%' OR
            m.bio_member ILIKE '%' || ${data.query} || '%' OR
            m.location ILIKE '%' || ${data.query} || '%'
        ORDER BY
            CASE
                WHEN m.name_member ILIKE '%' || ${data.query} || '%' THEN 1
                WHEN m.username_member ILIKE '%' || ${data.query} || '%' THEN 2
                WHEN m.bio_member ILIKE '%' || ${data.query} || '%' THEN 3
                WHEN m.location ILIKE '%' || ${data.query} || '%' THEN 4
                ELSE 5
            END,
            m.name_member ASC
        OFFSET
            ${data.offset}
        LIMIT
            20;
    `;
};