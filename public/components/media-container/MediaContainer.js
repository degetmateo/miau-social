import {importCSS} from "../../helpers.js";
import ImageViewer from "../image-viewer/ImageViewer.js";

importCSS('/public/components/media-container/media-container.css');

export default class MediaContainer {
    constructor (data = {
        media: [],
        editable: false
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
            if (this.data.editable) this.addDeleteButton(image);
            return image;
        });

        for (const media of this.data.media) {
            this.container.append(media);
        }
    }

    render (element) {
        element.append(this.container);
    }

    addMedia (src) {
        if (this.data.media.length === 4) throw new Error("Maximo de imagenes alcanzado.");

        const image = new Image();
        image.classList.add('media-container-image');
        image.src = src;
        image.onclick = () => new ImageViewer({ url: image.src });

        this.container.classList.remove('media-container--'+this.data.media.length);
        this.data.media.push(image);
        this.container.classList.add('media-container--'+this.data.media.length);
    }

    addDeleteButton (image) {
        const button = document.createElement('button');
        button.classLists.add('media-container-image-delete-button');
        button.textContent = 'x';
        image.append(button);
        button.onclick = () => {
            this.container.classList.remove('media-container--'+this.data.media.length);
            this.data.media = this.data.media.filter(m => m != image);
            image.remove();
            this.container.classList.add('media-container--'+this.data.media.length);
        }
    }

    getMedia () {
        return this.data.media;
    }
}