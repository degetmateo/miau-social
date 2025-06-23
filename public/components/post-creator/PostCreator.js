import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import Alert from "../alert/alert.js";
import ImageCropper from "../image-cropper/ImageCropper.js";
import ImagesContainer from "../images-container/ImagesContainer.js";
import SpotifyPopup from "../spotify-popup/SpotifyPopup.js";
import TenorSelector from "../tenor-selector/TenorSelector.js";
import Textarea from "../textarea/textarea.js";

Helper.ImportCSS('/public/components/post-creator/post-creator.css');

class PostCreator extends HTMLElement {
    constructor (data = {
        target_id: null,
        title: '¿Qué pensás?',
        type: 'default',
        alert: '¡Publicación enviada!'
    }) {
        super();
        this.data = data;
        
        this.has_spotify = false;
        this.spotify_url = null;

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
        

        this.embeds = document.createElement('div');
        this.embeds.classList.add('post-creator-embeds');
        this.editor.append(this.embeds);

        this.iframe = document.createElement('iframe');
        this.iframe.classList.add('post-creator-iframe');
        this.iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        // NOT LAZY
        this.iframe.loading = 'eager';
        this.iframe.style = 'border-radius: 12px;'
        this.iframe.width = '100%';
        this.iframe.height = '152';
        this.iframe.frameBorder = "0";
        this.iframe.allowFullscreen = true;

        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('post-creator-buttons-container');
        this.editor.append(this.buttonsContainer);

        this.editorButtonsContainer = document.createElement('div');
        this.editorButtonsContainer.classList.add('post-creator-editor-buttons-container');
        this.buttonsContainer.append(this.editorButtonsContainer);

        this.inputImages = document.createElement('input');
        this.inputImages.type = 'file';
        this.inputImages.accept = 'image/*, image/gif';
        this.inputImages.multiple = false;
        this.inputImages.style.display = 'none';

        this.inputImages.onchange = () => {
            if (this.inputImages.files.length > 4) {
                new Alert('Elige hasta un máximo de 4 imágenes o GIFs.', { error: true });
                this.inputImages.value = '';
                return;
            }

            const cropper = new ImageCropper({
                aspectRatio: null,
                file: this.inputImages.files[0],
                onSubmit: (blob) => {
                    this.imagesContainer.show();
                    this.imagesContainer.addImage({ src: URL.createObjectURL(blob), type: 'user' });
                    this.has_images = true;
                    this.inputImages.value = '';
                    this.inputImages.files = null;
                }
            });

            cropper.onCancel = () => {
                this.inputImages.value = '';
                this.inputImages.files = null;
            };
        };

        this.resetButton = document.createElement('button');
        this.resetButton.classList.add('post-creator-button', 'post-creator-button-reset');
        this.resetButton.type = 'button';
        this.resetButton.title = 'Reiniciar publicación';
        this.resetButton.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>';
        this.resetButton.addEventListener('click', () => this.reset());
        this.editorButtonsContainer.append(this.resetButton);

        this.imgButton = document.createElement('button');
        this.imgButton.classList.add('post-creator-button');
        this.imgButton.type = 'button';
        this.imgButton.title = 'Seleccionar imágenes';
        // this.imgButton.textContent = 'IMG';
        this.imgButton.innerHTML = '<i class="fa-solid fa-image"></i>';
        this.imgButton.addEventListener('click', () => this.inputImages.click());
        this.editorButtonsContainer.append(this.imgButton);

        this.gifButton = document.createElement('button');
        this.gifButton.classList.add('post-creator-button', 'post-creator-button-gif');
        this.gifButton.type = 'button';
        this.gifButton.title = 'Seleccionar GIFs';
        this.gifButton.textContent = 'GIF';
        this.gifButton.addEventListener('click', () => this.onTenor());
        this.editorButtonsContainer.append(this.gifButton);

        this.spotifyButton = document.createElement('button');
        this.spotifyButton.classList.add('post-creator-button');
        this.spotifyButton.type = 'button';
        this.spotifyButton.title = 'Agregar una canción de Spotify';
        this.spotifyButton.addEventListener('click', () => this.onSpotify());
        this.spotifyButton.innerHTML = '<i class="fa-brands fa-spotify"></i>';
        this.editorButtonsContainer.append(this.spotifyButton);

        this.postButtonContainer = document.createElement('div');
        this.postButtonContainer.classList.add('post-creator-post-button-container');
        this.buttonsContainer.append(this.postButtonContainer);

        this.postButton = document.createElement('button');
        this.postButton.classList.add('post-creator-button-post');
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

    reset () {
        this.imagesContainer.clear();
        this.imagesContainer.hide();
        this.textarea.set('');
        this.embeds.style.display = 'none';
        this.iframe.remove();
        this.embeds.innerHTML = '';
        this.spotify_url = null;
    };

    async onTenor() {
        new TenorSelector({ 
            onSubmit: (url) => {
                this.imagesContainer.addImage({ src: url, type: 'tenor' });
                this.imagesContainer.show();
            }
        });
    }

    onSpotify () {
        const popup = new SpotifyPopup();

        popup.onResponse = (song) => {
            this.spotify_url = song.url;
            this.embeds.style.display = 'block';
            this.iframe.title = song.title;
            this.iframe.src = song.iframe_url;
            this.embeds.append(this.iframe);
        };
    };

    async submit () {
        const imagesData = this.imagesContainer.getImages();
        let content = this.textarea.value;
        const spotifyValue = this.spotify_url;
        if (content) content = content.trim();
        if ((!content || content.length <= 0) && imagesData.length === 0 && !spotifyValue) return new Alert('No puedes enviar una publicación vacía.', { error: true, timeout: 4000 });

        new Alert('Enviando...', { error: false, timeout: null });
        this.reset();

        let response;
        try {
            response = await postService.post({ 
                content: content, 
                images: imagesData, 
                type: this.data.type,
                target_id: this.data.target_id,
                spotify_url: spotifyValue
            });
            this.response = response;
        } catch (error) {
            this.has_images = false;
            this.has_video = false;
            this.has_text = false;

            return new Alert(error.message, { error: true });
        }

        this.has_spotify = false;
        this.has_images = false;
        this.has_video = false;
        this.has_text = false;
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