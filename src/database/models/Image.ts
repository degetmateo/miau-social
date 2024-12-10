export type DBImage = {
    id: number;
    member_id: number;
    post_id: number;
    type: DBImageType;
    source: DBImageSource;
    imgbb_id: string;
    url: string;
    delete_url: string;
}

export type DBImageType = 'icon' | 'banner' | 'post';
export type DBImageSource = 'imgbb' | 'other';

export class Image {
    private data: DBImage;
    constructor (data: DBImage) {
        this.data = data;
    }
}