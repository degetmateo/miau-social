import {dataURLToBlob, importCSS} from "../../helpers.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Button from "../button/Button.js";
import Component from "../Component.js";

// import GIF from 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/+esm'
// import GIFUCT from '../../lib/gifuct.js';
import * as GIFUCT from 'https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm';
import GIF from '../../lib/gif.js';
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";
import Alert from "../alert/alert.js";

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
                        const buffer = await this.blob.arrayBuffer();
                        const gif = GIFUCT.parseGIF(buffer);
                        const frames = GIFUCT.decompressFrames(gif, true);
        
                        const cropData = this.cropper.getData();
        
                        const croppedGIF = new GIF({
                            workers: 2,
                            quality: 1,
                            workerScript: '/public/lib/gif.worker.js',
                            repeat: 0,
                            width: cropData.width,
                            height: cropData.height,
                            dither: 'Stucki-serpentine',
                            background: '#FFF',
                            transparent: null
                        });
        
                        for (const frame of frames) {
                            if (frame.patch.length !== frame.dims.width * frame.dims.height * 4) {
                                console.error("Los datos del frame no tienen el tamaño esperado.");
                                continue;
                            }
        
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
        
                            canvas.width = cropData.width;
                            canvas.height = cropData.height;
        
                            const data = new ImageData(
                                new Uint8ClampedArray(frame.patch),
                                frame.dims.width, 
                                frame.dims.height
                            );
        
                            ctx.putImageData(data, -cropData.x, -cropData.y);
        
                            croppedGIF.addFrame(ctx, {
                                delay: frame.delay,
                                disposal: frame.disposalType,
                                copy: true
                            });
                        }
                        
                        croppedGIF.on('finished', (blob) => {
                            options.onSubmit(blob);
                            this.close();
                            spinner.remove();
                        });
                        
                        croppedGIF.render();
                    } else {
                        const canvas = this.cropper.getCroppedCanvas();
                        
                        canvas.toBlob((blob) => {
                            options.onSubmit(blob);
                        });
        
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

        if (options.file) {
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