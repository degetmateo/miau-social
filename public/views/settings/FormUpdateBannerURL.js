import Alert from "../../components/alert/alert.js";
import Button from "../../components/button/Button.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import { importCSS, loadImage } from "../../helpers.js";

importCSS('/public/views/settings/styles/form-update-banner-url.css');

class FormUpdateBannerURL {
    constructor () {
        this.container = document.createElement('div');
        this.container.classList.add('form-update-banner-url-container');
        
        this.messageContainer = document.createElement('div');
        this.messageContainer.classList.add('form-update-banner-url-message-container');

        this.title = document.createElement('h3');
        this.title.classList.add('form-update-banner-url-title');
        this.title.innerText = 'Actualiza tu banner con un enlace.';

        this.message = document.createElement('span');
        this.message.classList.add('form-update-banner-url-message');
        this.message.innerText = 'Puede ser una imagen o un GIF. Se recomienda una relación de aspecto de 3 : 1.';

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('form-update-banner-url-input-container');

        this.input = document.createElement('input');
        this.input.classList.add('form-update-banner-url-input');
        this.input.type = 'text';
        this.input.autocomplete = 'off';
        this.input.placeholder = 'Enlace';

        this.button = new Button({
            text: 'Enviar',
            appearance: 'default',
            onClick: this.submit
        });

        this.container.appendChild(this.messageContainer);
        this.container.appendChild(this.inputContainer);

        this.messageContainer.appendChild(this.title);
        this.messageContainer.appendChild(this.message);

        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.button.render());
    }

    submit = async () => {
        const value = this.input.value;
        if (!value) return new Alert("Tenés que ingresar un enlace.", { error: true });

        this.input.value = '';

        const spinner = new ScreenSpinner();
        try {
            await loadImage(value);
        } catch (error) {
            spinner.remove();
            return new Alert("La imagen no está disponible.");
        }

        try {
            const request = await fetch('/api/member/update/banner/url', {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "Content-Type": "Application/JSON"
                },   
                body: JSON.stringify({ url: value })
            });

            const response = await request.json();
            spinner.remove();
            if (!request.ok) return new Alert(response.error.message);
            window.app.member.banner_url = value;
            new Alert('¡Banner actualizado!', { error: false });
        } catch (error) {
            spinner.remove();
            return new Alert(error.message);
        }
    }

    render = () => {
        return this.container;
    }
}

export default FormUpdateBannerURL;