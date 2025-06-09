import {URL_NO_IMAGE} from "../../consts.js";
import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import Alert from "../alert/alert.js";
import Button from "../button/Button.js";
import ImagesContainer from "../images-container/ImagesContainer.js";
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";
import TenorSelector from "../tenor-selector/TenorSelector.js";
import Textarea from "../textarea/textarea.js";

importCSS('/public/components/post-creator/styles/post-creator.css');

class PostCreator extends HTMLElement {
    constructor (data = {
        target_id: null,
        title: '¿Qué pensás?',
        type: 'default',
        alert: '¡Publicación enviada!'
    }) {
        super();
        this.data = data;

        this.has_text = false;
        this.has_images = false;
        this.has_video = false;

        this.onSubmit = () => {};
        this.classList.add('post-creator-container');

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('post-creator-icon-container');
        this.append(this.iconContainer);

        this.icon = document.createElement('div');
        this.icon.classList.add('post-creator-icon');
        this.iconContainer.append(this.icon);

        this.editor = document.createElement('div');
        this.editor.classList.add('post-creator-editor');
        this.append(this.editor);

        this.memberName = document.createElement('span');
        this.memberName.classList.add('post-creator-member-name');
        this.editor.append(this.memberName);

        this.textarea = new Textarea({
            min: 0,
            max: 500,
            title: this.data.title || '¿Qué pensás?',
            expand: true,
            onPaste: (file) => {
                try {
                    this.imagesContainer.show();
                    this.imagesContainer.addImage({ src: URL.createObjectURL(file), type: 'user' });
                    this.has_images = true;
                } catch (error) {
                    this.imagesContainer.hide();
                    this.has_images = false;
                };
            },
            onInput: (value) => {
                this.has_text = value.length > 0;
            }
        });

        this.editor.append(this.textarea.render());

        this.imagesContainer = new ImagesContainer({
            editable: true,
            onRemove: (images) => {
                this.has_images = images.length > 0;
            }
        });
        this.imagesContainer.hide();
        this.editor.append(this.imagesContainer.render());
        
        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('post-creator-buttons-container');
        this.editor.append(this.buttonsContainer);

        this.editorButtonsContainer = document.createElement('div');
        this.editorButtonsContainer.classList.add('post-creator-editor-buttons-container');
        this.buttonsContainer.append(this.editorButtonsContainer);

        this.inputImages = document.createElement('input');
        this.inputImages.type = 'file';
        this.inputImages.accept = 'image/*, image/gif';
        this.inputImages.multiple = true;
        this.inputImages.style.display = 'none';

        this.inputImages.onchange = () => {
            if (this.inputImages.files.length > 4) {
                new Alert('Elige hasta un máximo de 4 imágenes o GIFs.', { error: true });
                this.inputImages.value = '';
                this.inputImages.files = null;
                return;
            }

            this.has_images = true;

            this.imagesContainer.show();
            this.imagesContainer.addImages(this.inputImages.files);
        };

        this.imgButton = document.createElement('button');
        this.imgButton.classList.add('post-creator-button');
        this.imgButton.type = 'button';
        this.imgButton.textContent = 'IMG';
        this.imgButton.addEventListener('click', () => this.inputImages.click());
        this.editorButtonsContainer.append(this.imgButton);

        this.gifButton = document.createElement('button');
        this.gifButton.classList.add('post-creator-button');
        this.gifButton.type = 'button';
        this.gifButton.textContent = 'GIF';
        this.gifButton.addEventListener('click', () => this.onTenor());
        this.editorButtonsContainer.append(this.gifButton);

        this.inputVideo = document.createElement('input');
        this.inputVideo.type = 'file';
        this.inputVideo.accept = 'video/*';
        this.inputVideo.style.display = 'none';

        this.inputVideo.onchange = () => {
            if (this.inputImages.files.length > 1) {
                // new Alert('Elige hasta un máximo de 4 imágenes o GIFs.', { error: true });
                this.inputImages.value = '';
                this.inputImages.files = null;
                return;
            };

            // video size mayor a 100mb
            if (this.inputVideo.files[0].size > 100 * 1024 * 1024) {
                new Alert('Elige un video de hasta 100mb.', { error: true });
                this.inputVideo.value = '';
                this.inputVideo.files = null;
                return;
            };

            this.has_video = true;

            // this.imagesContainer.show();
            // this.imagesContainer.addImages(this.inputImages.files);
        };

        this.videoButton = new Button({
            appearance: 'default',
            text: 'VID',
            onClick: () => {
                this.inputVideo.click();
            }
        });

        // this.editorButtonsContainer.append(this.videoButton.render());

        this.postButtonContainer = document.createElement('div');
        this.postButtonContainer.classList.add('post-creator-post-button-container');
        this.buttonsContainer.append(this.postButtonContainer);

        this.postButton = document.createElement('button');
        this.postButton.classList.add('post-creator-button', 'post-creator-button-post');
        this.postButton.type = 'button';
        this.postButton.textContent = 'Publicar';
        this.postButton.addEventListener('click', () => this.submit());
        this.postButtonContainer.append(this.postButton);

        window.addEventListener('app-initialized', () => {
            this.icon.style.backgroundImage = `url(${window.app.member.icon_url || URL_NO_IMAGE})`;
            this.memberName.textContent = window.app.member.name;
        });
    }

    updateIcon (url) {
        this.icon.style.backgroundImage = `url(${url})`;
    }

    updateName (name) {
        this.memberName.textContent = name;
    }

    async onTenor() {
        new TenorSelector({ 
            onSubmit: (url) => {
                this.imagesContainer.addImage({ src: url, type: 'tenor' });
                this.imagesContainer.show();
            }
        });
    }

    async submit () {
        const imagesData = this.imagesContainer.getImages();
        let content = this.textarea.value;
        if (content) content = content.trim();
        if ((!content || content.length <= 0) && imagesData.length === 0) return new Alert('No puedes enviar una publicación vacía.', { error: true, timeout: 4000 });

        const loader = new ScreenSpinner();
        this.imagesContainer.clear();
        this.imagesContainer.hide();
        this.textarea.set('');

        let response;
        try {
            response = await postService.post({ 
                content: content, 
                images: imagesData, 
                type: this.data.type,
                target_id: this.data.target_id,

                has_images: this.has_images,
                has_video: this.has_video,
                has_text: this.has_text
            });
            this.response = response;
        } catch (error) {
            loader.remove();

            this.has_images = false;
            this.has_video = false;
            this.has_text = false;

            return new Alert(error.message, { error: true });
        }

        this.has_images = false;
        this.has_video = false;
        this.has_text = false;
        loader.remove();
        if (this.onsuccess) this.onsuccess();
        return new Alert(this.data.alert || '¡Publicación enviada!', { 
            error: false,
            onClick: () => {
                router.navigateTo(`/post/${response.id}/comments`);
            }
        });
    }

    onSuccess (func) {
        this.onsuccess = () => {
            func(this.response);
        };
    }
}

customElements.define('app-post-creator', PostCreator);
export default PostCreator;