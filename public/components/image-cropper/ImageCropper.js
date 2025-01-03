import {importCSS} from "../../helpers.js";
import Button from "/public/components/button/button.js";

importCSS('/public/components/image-cropper/styles/image-cropper.css');

export default class ImageCropper {
    constructor (options = {
        aspectRatio: 1,
        file: null,
        onSubmit: () => {}
    }) {
        this.container = document.createElement('div');
        this.container.classList.add('image-cropper-overlay');
        document.getElementById('app').appendChild(this.container);

        this.editor = document.createElement('div');
        this.editor.classList.add('image-cropper-editor');
        this.container.appendChild(this.editor);

        this.header = document.createElement('div');
        this.header.classList.add('image-cropper-header');
        this.editor.appendChild(this.header);

        this.cancelButton = new Button({
            text: 'Cancelar',
            appearance: 'default',
            onClick: () => {
                this.container.remove();
                options.onSubmit(null);
            }
        });

        this.submitButton = new Button({
            text: 'Guardar',
            appearance: 'default',
            onClick: () => {
                this.container.remove();
                const canvas = this.cropper.getCroppedCanvas();
                canvas.toBlob((blob) => {
                    options.onSubmit(blob);
                });
            }
        });

        this.header.appendChild(this.cancelButton.render());
        this.header.appendChild(this.submitButton.render());

        this.image = document.createElement('img');
        this.image.classList.add('image-cropper-image');
        this.editor.appendChild(this.image);

        if (options.file) {
            this.reader = new FileReader();

            this.reader.onload = (e) => {
                this.image.src = e.target.result; 
                if (this.cropper) {
                    this.cropper.destroy();
                    this.cropper = null;
                }
    
                this.cropper = new Cropper(this.image, {
                    aspectRatio: options.aspectRatio, 
                    viewMode: 2    
                });
            };
    
            this.reader.readAsDataURL(options.file);
        }
    }
}