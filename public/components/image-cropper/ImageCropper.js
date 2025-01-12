import {dataURLToBlob, importCSS} from "../../helpers.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Button from "../button/Button.js";
import Component from "../Component.js";

import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";
import Alert from "../alert/alert.js";

// import * as GIFCropper from '../../lib/cropperjs-gif-all.js';

// import gifCropper from 'https://cdn.skypack.dev/gif-cropper';

importCSS('/public/components/image-cropper/styles/image-cropper.css');

export default class ImageCropper extends Component {
    constructor (options = {
        aspectRatio: 1,
        file: null,
        onSubmit: () => {}
    }) {
        super();
        this.options = options;
        this.observerId = 'image-cropper';
        EventsHandler.addObserver(this);

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
                options.onSubmit(null);
                this.close();
            }
        });

        this.submitButton = new Button({
            text: 'Guardar',
            appearance: 'default',
            onClick: async () => {
                const spinner = new ScreenSpinner();
                try {
                    if (options.file.type === 'image/gif') {
                        CropperjsGif.crop({
                            encoder: {
                                workers: 2,
                                quality: 10,
                                workerScript: "/public/lib/gif.worker.js"
                            },
                            src: this.image.src,
                            background: '#fff',
                            onerror: function(code, error){
                                console.log(code, error);
                                spinner.remove();
                                throw error;
                            }
                        },
                        this.cropper,
                        (blob) => {
                            options.onSubmit(blob);
                            spinner.remove();
                            this.close();
                        });
                    } else {
                        const canvas = this.cropper.getCroppedCanvas();
                        
                        canvas.toBlob((blob) => {
                            options.onSubmit(blob);
                        });
        
                        spinner.remove();
                        this.close();
                    }
                    
                } catch (error) {
                    new Alert("Ha ocurrido un error.", { error: true });
                    spinner.remove();
                    this.close();
                }
            }
        });

        this.header.appendChild(this.cancelButton.render());
        this.header.appendChild(this.submitButton.render());

        this.image = document.createElement('img');
        this.image.classList.add('image-cropper-image');
        this.editor.appendChild(this.image);

        if (!options.file) return this.close();

        try {
            this.reader = new FileReader();
    
            this.reader.onload = (e) => {
                this.image.src = e.target.result;
                this.blob = dataURLToBlob(e.target.result);
    
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
        } catch (error) {
            new Alert("Ha ocurrido un error.", { error: true });
            this.close();   
        }
    }

    close = () => {
        this.container.remove();
        EventsHandler.removeObserver(this);
    }
 
    onEscape = () => {
        this.close();
    }
}