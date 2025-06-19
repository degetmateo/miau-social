import InvalidArgumentError from "../errors/InvalidArgumentError";

class Spotify {
    async Fetch (url: string): Promise<{
        url: string;
        iframe_url: string;
        thumbnail_url: string;
        title: string;
    }> {
        const req = await fetch(`https://open.spotify.com/oembed?url=${url}`, {
            method: "GET"
        });

        if (!req.ok) throw new InvalidArgumentError('Spotify Error.');
        const res: any = await req.json();
        res.url = url;
        return res;
    };
};

export default new Spotify();