import Alert from "../../components/alert/alert.js";
import Button from "/public/components/button/button.js";
import {loadImage} from "../../helpers.js";

class FormUpdateIcon {
    constructor (role) {
        this.container = document.createElement('div');
        this.container.classList.add('form_update_icon-container');

        this.formUpdateIconURL = document.createElement('div');
        this.formUpdateIconURL.classList.add('form_update_icon_url-container');

        this.formUpdateIconURLMessage = document.createElement('div');
        this.formUpdateIconURLMessage.classList.add('form_update_icon_url-message');
        this.formUpdateIconURLMessage.innerHTML = `
            <h3>Actualiza tu icon con un enlace.</h3>
            <p>1) Ingresa un enlace a una imagen o GIF. La URL debe ser directa a la imagen. Se recomienda que la imagen sea cuadrada.</p>
            <p>2) Presiona el botón para cargar la imagen. Si el enlace no es valido, te lo haremos saber.</p>
        `;
        
        this.formUpdateIconURLInputContainer = document.createElement('div');
        this.formUpdateIconURLInputContainer.classList.add('form_update_icon_url-input-container');

        this.formUpdateIconURLInput = document.createElement('input');
        this.formUpdateIconURLInput.classList.add('form_update_icon_url-input');
        this.formUpdateIconURLInput.setAttribute('type', 'text');
        this.formUpdateIconURLInput.setAttribute('autocomplete', 'off');
        this.formUpdateIconURLInput.setAttribute('placeholder', 'Enlace');

        this.button = new Button({
            text: 'Enviar',
            appearance: 'default',
            onClick: this.submit
        });

        this.formUpdateIconURLInputContainer.appendChild(this.formUpdateIconURLInput);
        this.formUpdateIconURLInputContainer.appendChild(this.button.render());

        this.formUpdateIconURL.appendChild(this.formUpdateIconURLMessage);
        this.formUpdateIconURL.appendChild(this.formUpdateIconURLInputContainer);

        // this.EventFormIconURL();
            // this.formUpdateIconImage = document.createElement('div');
            // this.formUpdateIconImage.classList.add('form_update_icon_image-container');
    
            // this.formUpdateIconImageMessage = document.createElement('div');
            // this.formUpdateIconImageMessage.classList.add('form_update_icon_image-message');
            // this.formUpdateIconImageMessage.innerHTML = `
            //     <h3>Actualiza tu icon con una imagen.</h3>
            //     </div>
            //     <p>Selecciona una imagen de tu galería y recórtala. Por el momento, no se admiten GIFs con esta opción.</p>
            // `;
    
            // this.formUpdateIconImageInputContainer = document.createElement('div');
            // this.formUpdateIconImageInputContainer.classList.add('form_update_icon_image-input-container');
    
            // this.formUpdateIconImageLabel = document.createElement('label');
            // this.formUpdateIconImageLabel.setAttribute('for', "form_update_icon_image-input");
            // this.formUpdateIconImageLabel.classList.add('form_update_icon_image-label');
            // this.formUpdateIconImageLabel.textContent = 'Cargar';
    
            // this.formUpdateIconImageInput = document.createElement('input');
            // this.formUpdateIconImageInput.setAttribute('id', "form_update_icon_image-input");
            // this.formUpdateIconImageInput.classList.add('form_update_icon_image-input');
            // this.formUpdateIconImageInput.setAttribute('type', 'file');
            // this.formUpdateIconImageInput.setAttribute('accept', 'image/png, image/jpeg, image/gif');
            // this.formUpdateIconImageInput.hidden = true;
    
            // this.formUpdateIconImageButton = document.createElement('button');
            // this.formUpdateIconImageButton.classList.add('form_update_icon_url-button');
            // this.formUpdateIconImageButton.textContent = 'Enviar';
    
            // this.formUpdateIconImageCropperContainer = document.createElement('div');
            // this.formUpdateIconImageCropperContainer.classList.add('form_update_icon_image-cropper-container');
            // this.formUpdateIconImageCropperContainer.style.display = 'none';
    
            // this.formUpdateIconImageCropperImage = document.createElement('img');
            // this.formUpdateIconImageCropperContainer.appendChild(this.formUpdateIconImageCropperImage);
    
            // this.formUpdateIconImageInputContainer.appendChild(this.formUpdateIconImageLabel);
            // this.formUpdateIconImageInputContainer.appendChild(this.formUpdateIconImageInput);
            // this.formUpdateIconImageInputContainer.appendChild(this.formUpdateIconImageButton);
            
            // this.formUpdateIconImage.appendChild(this.formUpdateIconImageMessage);
            // this.formUpdateIconImage.appendChild(this.formUpdateIconImageInputContainer);
            // this.formUpdateIconImage.appendChild(this.formUpdateIconImageCropperContainer);
    
            this.container.appendChild(this.formUpdateIconURL);
            // this.container.appendChild(this.formUpdateIconImage);
            
            // this.EventFormIconImage();
    }

    getNode = () => {
        return this.container;
    };

    submit = async () => {
        if (!this.formUpdateIconURLInput.value) return new Alert('Tenés que ingresar un enlace.', { error: true });

        try {
            const image = await loadImage(this.formUpdateIconURLInput.value);
            this.formUpdateIconURLInput.value = '';

            const request = await fetch("/api/member/update/icon/url", {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('token'),
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    url: image.src
                })
            });
    
            const response = await request.json();
            if (!request.ok) return new Alert(response.error.message);
            
            window.app.member.icon_url = image.src;
            return new Alert('Imagen de perfil actualizada.');
        } catch (error) {
            return new Alert(error.message);
        }
    }

    EventFormIconImage = async () => {
        this.formUpdateIconImageInput.onchange = async (e) => {
            this.formUpdateIconImageCropperContainer.style.display = 'block';
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    this.formUpdateIconImageCropperImage.setAttribute('src', e.target.result); 
                    this.formUpdateIconImageCropperImage.style.display = 'block';
                    if (this.cropper) this.cropper.destroy();

                    this.cropper = new Cropper(this.formUpdateIconImageCropperImage, {
                        aspectRatio: 1, 
                        viewMode: 1,    
                    });
                };
        
                reader.readAsDataURL(file);
            }
        }

        this.formUpdateIconImageButton.onclick = async () => {
            if (this.cropper) {
                new Alert("Espere...");
                this.formUpdateIconImageCropperContainer.style.display = 'none';
                const canvas = this.cropper.getCroppedCanvas();
                const type = this.formUpdateIconImageInput.files[0].type;
                
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, `image.${type.split('/')[1]}`);

                    const request = await fetch('/api/member/update/icon/image', {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
                        body: formData
                    });

                    const response = await request.json();
                    if (!request.ok) return new Alert(response.error.message);
                    
                    window.app.member.icon_url = response.data.url;
                    return new Alert("Imagen de perfil actualizada.");
                }, type);
            } else {
                return new Alert('Tenés que seleccionar una imagen.', { error: true });
            }
        }
    }
}

export default new FormUpdateIcon();