import BadGatewayError from "../errors/BadGatewayError";
import GenericError from "../errors/GenericError";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const get = async (data: {
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

    let response = null;
    try {
        const request = await fetch(SEARCH_URL, { method: "GET" });
        response = await request.json();
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new BadGatewayError();
        }    
    }

    return response;
}

export const tenorService = {
    get
}