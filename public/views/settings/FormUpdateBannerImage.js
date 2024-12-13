import Alert from "../../components/alert/alert.js";
import {importCSS} from "../../helpers.js";

importCSS('/public/views/settings/styles/form-update-banner-image.css');

export default class FormUpdateBannerImage {
    constructor () {
        this.container = document.createElement('div');
        this.container.classList.add('form-update-banner-image-container');
        
        this.messageContainer = document.createElement('div');
        this.messageContainer.classList.add('form-update-banner-image-message-container');

        this.title = document.createElement('h3');
        this.title.classList.add('form-update-banner-image-title');
        this.title.innerText = 'Actualiza tu banner con una imagen.';

        this.message = document.createElement('span');
        this.message.classList.add('form-update-banner-image-message');
        this.message.innerText = 'Selecciona una imagen de tu galería. Por el momento, no se admiten GIFs en esta opción.';

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('form-update-banner-image-input-container');

        this.label = document.createElement('label');
        this.label.setAttribute('for', "form_update_banner_image-input");
        this.label.classList.add('form_update_banner_image-label');
        this.label.textContent = 'Cargar';

        this.input = document.createElement('input');
        this.input.setAttribute('id', "form_update_banner_image-input");
        this.input.classList.add('form_update_icon_image-input');
        this.input.setAttribute('type', 'file');
        this.input.setAttribute('accept', 'image/png, image/jpeg, image/gif');
        this.input.hidden = true;

        this.button = document.createElement('button');
        this.button.classList.add('form-update-banner-image-button');
        this.button.innerText = 'Enviar';

        this.cropperContainer = document.createElement('div');
        this.cropperContainer.classList.add('form_update_icon_image-cropper-container');
        this.cropperContainer.style.display = 'none';

        this.cropperImage = document.createElement('img');
        this.cropperContainer.appendChild(this.cropperImage);

        this.container.appendChild(this.messageContainer);
        this.container.appendChild(this.inputContainer);
        this.container.appendChild(this.cropperContainer);

        this.messageContainer.appendChild(this.title);
        this.messageContainer.appendChild(this.message);

        this.inputContainer.appendChild(this.label);
        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.button);

        this.input.onchange = (e) => {
            this.cropperContainer.style.display = 'block';
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    this.cropperImage.setAttribute('src', e.target.result); 
                    this.cropperImage.style.display = 'block';
                    if (this.cropper) this.cropper.destroy();

                    this.cropper = new Cropper(this.cropperImage, {
                        aspectRatio: 3 / 1, 
                        viewMode: 1,    
                    });
                };
        
                reader.readAsDataURL(file);
            }
        }

        this.button.onclick = async () => {
            if (this.cropper) {
                new Alert("Espere...");
                this.cropperContainer.style.display = 'none';
                const canvas = this.cropper.getCroppedCanvas();
                const type = this.input.files[0].type;
                
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, `image.${type.split('/')[1]}`);

                    const request = await fetch('/api/member/update/banner/image', {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
                        body: formData
                    });

                    const response = await request.json();
                    if (!request.ok) return new Alert(response.error.message);
                    
                    window.app.member.banner_url = response.data.url;
                    return new Alert("Banner actualizado correctamente.");
                }, type);
            } else {
                return new Alert('Tenés que seleccionar una imagen.', { error: true });
            }
        }
    }

    render = () => {
        return this.container;
    }
}