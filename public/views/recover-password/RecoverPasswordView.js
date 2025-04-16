import Alert from "../../components/alert/alert.js";
import CaptchaBadge from "../../components/captcha-badge/CaptchaBadge.js";
import Input from "../../components/input/input.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {authenticationService} from "../../services/authenticationService.js";
import {grecaptchaService} from "../../services/grecaptchaService.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/recover-password/recover-password.css');

export default class RecoverPasswordView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('recover-password-view');

        this.main = document.createElement('main');
        this.main.classList.add('recover-password-main');
        this.view.append(this.main);

        this.form = document.createElement('form');
        this.form.classList.add('recover-password-form');
        this.main.append(this.form);

        this.titleContainer = document.createElement('div');
        this.titleContainer.classList.add('recover-password-title-container');
        this.form.append(this.titleContainer);

        this.title = document.createElement('span');
        this.title.classList.add('recover-password-title');
        this.title.textContent = 'Para recuperar tu contraseña, primero ingresá tu nombre de usuario.';
        this.titleContainer.append(this.title);

        this.forgotContainer = document.createElement('div');
        this.forgotContainer.classList.add('recover-password-forgot-container');
        this.form.append(this.forgotContainer);

        this.forgotMessage = document.createElement('span');
        this.forgotMessage.classList.add('recover-password-forgot');
        this.forgotMessage.textContent = '¿No recordás tu nombre de usuario? ';
        this.forgotContainer.append(this.forgotMessage);

        this.forgotButton = document.createElement('span');
        this.forgotButton.classList.add('link');
        this.forgotButton.textContent = 'Recuperalo.';
        this.forgotButton.onclick = (e) => {
            e.preventDefault();
            router.navigateTo('/recovery/username');
            return;
        }
        this.forgotMessage.append(this.forgotButton);

        this.usernameContainer = document.createElement('div');
        this.usernameContainer.classList.add('recover-password-container');
        this.form.append(this.usernameContainer);

        this.username = new Input({
            min: 0,
            max: 16,
            length: false,
            type: 'text',
            autocomplete: 'on',
            title: 'Escribí tu nombre de usuario'
        });
        this.usernameContainer.append(this.username.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('recover-password-container', 'recover-password-button-container');
        this.form.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.classList.add('recover-password-button');
        this.button.textContent = 'Recuperar mi contraseña';
        this.button.onclick = (e) => {
            e.preventDefault();
            this.submit();
            return;
        }
        this.buttonContainer.append(this.button);

        this.form.append(new CaptchaBadge().render());
    }

    init (params, query) {
        this.params = params;
        this.query = query;

        this.setTitle('Recuperar Contraseña');
        this.setView(this.view);
    }

    async submit () {
        const loader = new ScreenSpinner();
        try {
            if (!this.username.value) throw new Error('Tenés que escribir tu nombre de usuario.');
            if (!this.username.value.trim()) throw new Error('Tenés que escribir tu nombre de usuario.');

            const grecaptchaToken = await grecaptchaService.execute();
            await authenticationService.recoverPassword({
                token: grecaptchaToken,
                username: this.username.value
            });
            
            this.username.set('');
            this.forgotContainer.remove();
            this.usernameContainer.remove();
            this.buttonContainer.remove();
            this.title.textContent = 'Enviamos un correo con las instrucciones al email asociado de esta cuenta.';
            loader.remove();
        } catch (error) {
            loader.remove();
            return new Alert(error.message, { error: true });
        }
    }
}