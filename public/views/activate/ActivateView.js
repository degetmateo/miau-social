import Alert from "../../components/alert/alert.js";
import CaptchaBadge from "../../components/captcha-badge/CaptchaBadge.js";
import Input from "../../components/input/input.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import {importCSS} from "../../helpers.js";
import {authenticationService} from "../../services/authenticationService.js";
import Validator from "../../Validator.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/activate/styles/activate.css');

export default class ActivateView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('div');
        this.view.classList.add('activate-view');

        this.main = document.createElement('main');
        this.main.classList.add('activate-main');
        this.view.append(this.main);

        this.form = document.createElement('form');
        this.form.classList.add('activate-form');
        this.main.append(this.form);

        this.descriptionContainer = document.createElement('div');
        this.descriptionContainer.classList.add('activate-description-container');
        this.form.append(this.descriptionContainer);

        this.description = document.createElement('span');
        this.description.classList.add('activate-descripcion');
        this.description.textContent = 'Tenés que activar tu cuenta. Ingresá los datos. Si tu cuenta aún no tiene correo electrónico asociado, decidí ahora cuál va a ser.';
        this.descriptionContainer.append(this.description);

        this.usernameContainer = document.createElement('div');
        this.usernameContainer.classList.add('activate-container');
        this.form.append(this.usernameContainer);

        this.username = new Input({
            min: 0,
            max: 16,
            length: false,
            type: 'text',
            title: 'Escribí tu nombre de usuario',
            autocomplete: 'username'
        });
        this.usernameContainer.append(this.username.render());

        this.emailContainer = document.createElement('div');
        this.emailContainer.classList.add('activate-container');
        this.form.append(this.emailContainer);

        this.email = new Input({
            min: 0,
            max: 128,
            length: false,
            type: 'email',
            title: 'Escribí tu correo electrónico',
            autocomplete: 'email'
        });
        this.emailContainer.append(this.email.render());

        this.passwordContainer = document.createElement('div');
        this.passwordContainer.classList.add('activate-container');
        this.form.append(this.passwordContainer);

        this.password = new Input({
            min: 0,
            max: 128,
            length: false,
            type: 'password',
            title: 'Escribí tu clave',
            autocomplete: 'password'
        });
        this.passwordContainer.append(this.password.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('activate-container', 'activate-button-container');
        this.form.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.classList.add('activate-button');
        this.button.type = 'submit';
        this.button.textContent = 'Activar mi cuenta';
        this.button.onclick = (e) => {
            e.preventDefault();
            this.submit();
        }
        this.buttonContainer.append(this.button);

        this.form.append(new CaptchaBadge().render());
    }

    async init (params) {
        this.params = params;

        this.setTitle("Activar Cuenta");
        this.setView(this.view);
    }

    async submit () {
        if (!this.username.value) return new Alert("Ingresá tu nombre de usuario.", {error:true});
        if (!this.username.value.trim()) return new Alert("Ingresá tu nombre de usuario.",{error:true});
        if (!Validator.Email(this.email.value)) return new Alert("Ingresá un correo electrónico válido.", { error: true });
        if (!this.password.value) return new Alert("Ingresá tu clave.",{error:true});
        if (!this.password.value.trim()) return new Alert("Ingresá tu clave.",{error:true});

        const loader = new ScreenSpinner();

        grecaptcha.ready(() => {
            grecaptcha.execute('6LeMrAkrAAAAADDW0Gu_K5HfNWpSgx9zhyN0hl3O', {
                action: 'submit'
            }).then(async (token) => {
                let response;
                try {
                    response = await authenticationService.activate({
                        username: this.username.value,
                        email: this.email.value,
                        password: this.password.value,
                        captcha_token: token
                    });
                } catch (error) {
                    new Alert(error.message, { error: true });
                    loader.remove();
                    return;
                }

                this.username.set('');
                this.email.set('');
                this.password.set('');
                this.description.textContent = `Te hemos enviado un correo electrónico. Seguí las instrucciones.`;
                this.usernameContainer.remove();
                this.emailContainer.remove();
                this.passwordContainer.remove();
                this.buttonContainer.remove();
                loader.remove();
                return;
            });
        });
    }
}