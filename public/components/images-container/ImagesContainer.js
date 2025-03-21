import {importCSS} from "../../helpers.js";
import Alert from "../alert/alert.js";
import ImageViewer from "../image-viewer/ImageViewer.js";

importCSS('/public/components/images-container/styles/images-container.css');

export default class ImagesContainer {
    constructor (data = {
        editable: false,
        maxHeight: 500
    }) {
        this.data = data;
        this.container = document.createElement('div');
        this.container.classList.add('images-container');
        this.images = [];
    }

    render () {
        return this.container;
    }

    addImage (data = {
        src,
        type
    }) {
        if (this.images.length >= 4) return new Alert("No puedes subir más de 4 imágenes.", {error: true});
        this.images.push(data);
        this.updateLayout();

        const imageContainer = document.createElement('div');
        imageContainer.style.backgroundImage = `url(${data.src})`;
        imageContainer.classList.add('images-container-image');

        imageContainer.onclick = () => {
            new ImageViewer({ url: data.src });
        }

        if (this.data.editable) {
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'X';
            deleteButton.classList.add('images-container-delete-button');
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                this.images = this.images.filter(i => i !== data);
                imageContainer.remove();
                this.updateLayout();
                if (this.images.length === 0) this.hide();
            };
            imageContainer.append(deleteButton);
        }

        this.container.append(imageContainer);
    }

    addImages (files) {
        if (files.length > 4) return new Alert("No puedes subir más de 4 imágenes.", {error: true});
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = () => {
                this.addImage({ src: reader.result, type: 'user' });
            };
            reader.readAsDataURL(file);
        }
    }

    updateLayout () {
        if (this.images.length === 1) {
            this.container.style.gridTemplateColumns = '1fr';
            this.container.style.gridTemplateRows = '1fr';
            const img = new Image();
            img.src = this.images[0].src;
            this.container.style.height = img.height + 'px';
        }

        if (this.images.length === 2) {
            this.container.style.gridTemplateColumns = '1fr 1fr';
            this.container.style.gridTemplateRows = '1fr';
        }

        if (this.images.length === 3) {
            this.container.style.gridTemplateColumns = '1fr 1fr 1fr';
            this.container.style.gridTemplateRows = '1fr';
        }

        if (this.images.length === 4) {
            this.container.style.gridTemplateColumns = '1fr 1fr';
            this.container.style.gridTemplateRows = '1fr 1fr';
        }
    }

    clear () {
        this.images = [];
        this.container.innerHTML = '';
    }

    getImages () {
        return this.images;
    }

    hide () {
        this.container.style.display = 'none';
    }

    show () {
        this.container.style.display = 'grid';
    }
}