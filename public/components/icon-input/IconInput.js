import Helper from "../../Helper.js";
import ImageCropper from "../image-cropper/ImageCropper.js";

Helper.ImportCSS('/public/components/icon-input/styles/icon-input.css');

export default class IconInput {
    constructor () {
        this.changed = false;
        this.blob = null;

        this.container = document.createElement('div');
        this.container.classList.add('icon-input-container');

        this.label = document.createElement('label');
        this.label.classList.add('icon-input-label');
        this.label.setAttribute('for', 'icon-input-input');
        this.label.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
            <rect x="0.480469" y="0.660645" width="50" height="50" fill="#1A1A1A" fill-opacity="0.5"/>
            <path d="M19.0515 8.16064H31.9086V11.3239H35.0719V14.3851H41.3984V17.6504H44.5617V39.8953H41.3984V43.1606H9.66374V39.8953H6.39844V17.6504H9.66374V14.3851H15.8882V11.3239H19.0515V8.16064ZM19.2556 11.528V14.5892H16.0923V17.8545H9.76578V39.6913H41.1944V17.8545H34.9699V14.5892H31.7046V11.528H19.2556Z" fill="#FFFBDF"/>
            <path d="M19.05 17.6504H31.9071V20.8137H35.0704V33.6708H31.9071V36.8341H19.05V33.6708H15.8867V20.8137H19.05V17.6504ZM19.2541 21.0177V33.4667H31.703V21.0177H19.2541Z" fill="#FFFBDF"/>
            </svg>
        `;

        this.input = document.createElement('input');
        this.input.setAttribute('type', 'file');
        this.input.setAttribute('accept', 'image/png, image/jpeg, image/gif');
        this.input.hidden = true;
        this.input.setAttribute('id', 'icon-input-input');

        this.container.appendChild(this.input);
        this.container.appendChild(this.label);

        this.input.onchange = () => {
            const file = this.input.files[0];
            if (!file) return;

            // if (file.type === 'image/gif') {
            //     return new Alert("Los GIFs solo pueden ser agregados desde configuración.");
            // }

            this.cropper = new ImageCropper({
                aspectRatio: 1,
                file: file,
                onSubmit: (blob) => {
                    if (!blob) return;
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        this.set(e.target.result);
                    }

                    reader.readAsDataURL(blob);

                    this.changed = true;
                    this.blob = blob;
                }
            });

            this.input.files = null;
            this.input.value = null;
        }
    }

    setChanged = (changed) => {
        this.changed = changed;
    }

    isChanged = () => {
        return this.changed;
    }

    getBlob = () => {
        return this.blob;
    }

    set = (url) => {
        this.container.style.backgroundImage = `url(${url})`;
    }

    render = () => {
        return this.container;
    }

    remove = () => {
        this.container.remove();
    }
}