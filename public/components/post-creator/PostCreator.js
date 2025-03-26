import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import {tenorService} from "../../services/tenorService.js";
import Alert from "../alert/alert.js";
import Button from "../button/Button.js";
import ImagesContainer from "../images-container/ImagesContainer.js";
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";
import TenorSelector from "../tenor-selector/TenorSelector.js";
import Textarea from "../textarea/textarea.js";

importCSS('/public/components/post-creator/styles/post-creator.css');

class PostCreator {
    constructor (data = {
        target_id: null,
        title: '¿Qué pensás?',
        type: 'default',
        alert: '¡Publicación enviada!'
    }) {
        this.data = data;
        this.onSubmit = () => {};
        this.container = document.createElement('div');
        this.container.classList.add('post-creator-container');

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('post-creator-icon-container');
        this.container.append(this.iconContainer);

        this.icon = document.createElement('div');
        this.icon.classList.add('post-creator-icon');
        this.iconContainer.append(this.icon);

        this.editor = document.createElement('div');
        this.editor.classList.add('post-creator-editor');
        this.container.append(this.editor);

        this.memberName = document.createElement('span');
        this.memberName.classList.add('post-creator-member-name');
        this.editor.append(this.memberName);

        this.textarea = new Textarea({
            min: 0,
            max: 500,
            title: this.data.title || '¿Qué pensás?',
            expand: true,
            onPaste: (file) => {
                this.imagesContainer.show();
                this.imagesContainer.addImage({ src: URL.createObjectURL(file), type: 'user' });
            }
        });

        this.editor.append(this.textarea.render());

        this.imagesContainer = new ImagesContainer({ editable: true });
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

            this.imagesContainer.show();
            this.imagesContainer.addImages(this.inputImages.files);
        }

        this.imageButton = new Button({
            appearance: 'default',
            text: 'IMG',
            onClick: () => {
                this.inputImages.click();
            }
        });

        this.editorButtonsContainer.append(this.imageButton.render());

        this.gifButton = new Button({
            appearance: 'default',
            text: 'GIF',
            onClick: () => {
                this.onTenor();
            }
        });

        this.editorButtonsContainer.append(this.gifButton.render());

        this.postButtonContainer = document.createElement('div');
        this.postButtonContainer.classList.add('post-creator-post-button-container');
        this.buttonsContainer.append(this.postButtonContainer);

        this.postButton = new Button({
            appearance: 'default',
            text: 'Publicar',
            onClick: () => this.submit()
        });

        this.postButtonContainer.append(this.postButton.render());
    }

    render (element) {
        element.append(this.container);
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
        const content = this.textarea.value;
        if (!content && imagesData.length === 0) return new Alert('No puedes enviar una publicación vacía.', { error: true, timeout: 4000 });

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
                target_id: this.data.target_id
            });
            this.response = response;
        } catch (error) {
            loader.remove();
            return new Alert(error.message, { error: true });
        }

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

export default PostCreator;