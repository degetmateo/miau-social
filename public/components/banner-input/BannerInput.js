import {importCSS} from "../../helpers.js";
import ImageCropper from "../image-cropper/ImageCropper.js";

importCSS(`/public/components/banner-input/styles/banner-input.css`);

export default class BannerInput {
    constructor () {
        this.changed = false;
        this.blob = null;

        this.container = document.createElement('div');
        this.container.classList.add('banner-input-container');

        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('banner-input-buttons-container');

        this.buttonChange = document.createElement('div');
        this.buttonChange.classList.add('banner-input-button');
        this.buttonChange.innerHTML = `
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6081 0.886963H26.4653V4.05023H29.6285V7.11145H35.9551V10.3768H39.1183V32.6217H35.9551V35.887H4.22038V32.6217H0.955078V10.3768H4.22038V7.11145H10.4449V4.05023H13.6081V0.886963ZM13.8122 4.25431V7.31553H10.649V10.5808H4.32243V32.4176H35.751V10.5808H29.5265V7.31553H26.2612V4.25431H13.8122Z" fill="#FFFBDF"/>
            <path d="M13.6066 10.3767H26.4638V13.54H29.627V26.3971H26.4638V29.5604H13.6066V26.3971H10.4434V13.54H13.6066V10.3767ZM13.8107 13.7441V26.193H26.2597V13.7441H13.8107Z" fill="#FFFBDF"/>
            </svg>
        `;

        this.buttonDelete = document.createElement('div');
        this.buttonDelete.classList.add('banner-input-button');
        this.buttonDelete.innerHTML = `
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.720703 0.374512H7.14927V6.26737H13.0421V12.1602H18.3993V6.26737H24.2921V0.374512H30.7207V6.80308H24.8278V12.6959H18.935V18.0531H24.8278V23.9459H30.7207V30.3745H24.2921V24.4817H18.3993V18.5888H13.0421V24.4817H7.14927V30.3745H0.720703V23.9459H6.61356V18.0531H12.5064V12.6959H6.61356V6.80308H0.720703V0.374512Z" fill="#FFFBDF"/>
            </svg>
        `;

        this.input = document.createElement('input');
        this.input.type = 'file';
        this.input.accept = 'image/*';
        this.input.style.display = 'none';

        this.buttonsContainer.appendChild(this.buttonChange);
        this.buttonsContainer.appendChild(this.buttonDelete);
        this.container.appendChild(this.buttonsContainer);

        this.buttonDelete.onclick = () => {
            this.clear();
        }

        this.buttonChange.onclick = () => {
            this.input.click();
        }

        this.input.onchange = () => {
            const file = this.input.files[0];
            if (!file) return;

            this.cropper = new ImageCropper({
                aspectRatio: 3 / 1,
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

    clear = () => {
        this.changed = true;
        this.blob = null;
        this.container.style.backgroundImage = '';
    }

    render = () => {
        return this.container;
    }

    remove = () => {
        this.container.remove();
    }
}