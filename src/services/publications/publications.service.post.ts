import { publicationsRepository } from "../../database/mongo/repositories/publications/publications.repository";
import InvalidArgumentError from "../../errors/InvalidArgumentError";
import ImgBB from "../../helpers/ImgBB";
import Spotify from "../../helpers/Spotify";
import { PARAMETERS } from "../../static/parameters";

export default async (data: {
    oomfyId: string;
    content: string;
    tenor: { src: string; index: number }[];
    images: { buffer: Express.Multer.File['buffer'], index: number }[];
    type: 'default' | 'reply' | 'quote';
    target_id: string;
    spotify_url: string | null;
}) => {
    if (data.content) data.content = data.content.trim();
    const isEmpty = 
    (!data.content || data.content.length <= 0) && 
    [...data.tenor, ...data.images].length <= 0 &&
    !data.spotify_url;
    
    if (isEmpty) throw new InvalidArgumentError("No puedes enviar una publicación vacia.");

    if (data.content && data.content.length > 0) {
        if (data.content.length > PARAMETERS.POST_CONTENT_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_CONTENT_MAX_LENGTH} carácteres.`);
    }

    if (data.images || data.tenor || data.images.length > 0 || data.tenor.length > 0) {
        if ([...data.tenor, ...data.images].length > PARAMETERS.POST_IMAGES_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_IMAGES_MAX_LENGTH} imágenes.`);
    }

    if (!['default', 'reply', 'quote', 'shared'].includes(data.type)) throw new InvalidArgumentError('Tipo de publicación inválida.');

    if (['reply', 'quote', 'shared'].includes(data.type)) {
        if (!data.target_id) {
            throw new InvalidArgumentError('TARGET_PUBLICATION_ID_NOT_FOUND');
        };
    };

    let checkedImages: {
        url: string;
        imgbb_id?: string;
        delete_url?: string;
        source: 'imgbb' | 'tenor' | 'other';
        index: number;
    }[] = [];

    for (const image of data.images) {
        const apiResponse = await ImgBB.upload({ buffer: image.buffer });

        checkedImages.push({
            url: apiResponse.data.url,
            imgbb_id: apiResponse.data.id,
            delete_url: apiResponse.data.delete_url,
            source: 'imgbb',
            index: image.index
        });
    }

    for (const gif of data.tenor) {
        checkedImages.push({
            url: gif.src,
            source: 'tenor',
            index: gif.index
        });
    }

    checkedImages = checkedImages.sort((a, b) => a.index - b.index);

    let spotifyResponse: { url: string; title: string; iframe_url: string; thumbnail_url: string; } = null;
    if (data.spotify_url) {
        spotifyResponse = await Spotify.Fetch(data.spotify_url);
    };

    const response = await publicationsRepository.post({
        oomfyId: data.oomfyId,
        content: data.content,
        images: checkedImages,
        type: data.type,
        targetPublicationId: data.target_id,
        spotify: spotifyResponse
    });

    return response;
};