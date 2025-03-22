import InvalidArgumentError from "../errors/InvalidArgumentError";

const get = async (data: {
    member: {
        id: number;
        username: string;
        role: string;
    };
    pos: string | null;
    args: string | null;
}) => {
    if (!data.args) throw new InvalidArgumentError("Args is needed.");
    if (data.args && typeof data.args !== "string") throw new InvalidArgumentError("Args must be a string.");
    if (data.args.length < 1) throw new InvalidArgumentError("Args cannot be empty.");
    if (data.args.length > 100) throw new InvalidArgumentError("Args cannot be longer than 100 characters.");

    const LIMIT = 20;
    const TENOR_URL = 'https://tenor.googleapis.com/v2/search?';
    const TENOR_KEY = process.env.TENOR_KEY;
    const SEARCH_URL = `${TENOR_URL}q=${data.args}&key=${TENOR_KEY}&limit=${LIMIT}&contentfilter=off&media_filter=minimal${ data.pos ? `&pos=${data.pos}` : '' }`;

    const request = await fetch(SEARCH_URL, { method: "GET" });
    const response = await request.json();
    return response;
}

export const tenorService = {
    get
}