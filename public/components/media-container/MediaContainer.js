import {importCSS} from "../../helpers.js";
import ImageViewer from "../image-viewer/ImageViewer.js";

importCSS('/public/components/media-container/media-container.css');

export default class MediaContainer {
    constructor (data = {
        media: []
    }) {
        this.data = data;

        if (this.data.media.length <= 0) throw new Error('Se necesita al menos una imagen.');
        if (this.data.media.length > 4) throw new Error('Hasta 4 imagenes.');

        this.container = document.createElement('div');
        this.container.classList.add('media-container');
        this.container.classList.add('media-container--'+this.data.media.length);

        this.data.media = this.data.media.map(m => {
            const image = new Image();
            image.classList.add('media-container-image');
            image.src = m;
            image.onclick = () => new ImageViewer({ url: image.src });
            return image;
        });

        for (const media of this.data.media) {
            this.container.append(media);
        }
    }

    render (element) {
        element.append(this.container);
    }
}