import { load } from 'cheerio';

import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/post/create', server.authenticate, async (req, res) => {
        const content = req.body.post.content;

        if (content.length > 400) {
            return res.json({
                ok: false,
                error: {
                    code: 'post',
                    message: 'Has superado el limite de caracteres (400).'
                }
            })
        }

        const user = req.body.user;
        const queryUserCreator = await Postgres.query() `
            SELECT * FROM
                base_user bu
            WHERE
                bu.username = ${user.username};
        `;
        
        if (!queryUserCreator[0]) return res.json({ ok:false, error: { code: 'auth', message: 'Error de autentificacion.' } });

        await Postgres.query()`
            SELECT insert_base_post (
                ${queryUserCreator[0].id},
                ${queryUserCreator[0].username},
                ${content},
                ${new Date().toISOString()},
                null
            );
        `;

        res.json({
            ok: true
        })
    })
}

function containsDisallowedTags (html: string, allowedTags: string[]) {
    const $ = load(html);
    const elements = $('*');

    let hasDisallowed = false;
    elements.each(function () {
        const tagName = $(this).prop('tagName').toLowerCase();
        if (!allowedTags.includes(tagName)) {
            hasDisallowed = true;
            return false;
        }
    });

    return hasDisallowed;
}