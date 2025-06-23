import Alert from "../../components/alert/alert.js";
import CaptchaBadge from "../../components/captcha-badge/CaptchaBadge.js";
import Input from "../../components/input/input.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import Helper from "../../Helper.js";
import router from "../../router.js";
import {authenticationService} from "../../services/authenticationService.js";
import {grecaptchaService} from "../../services/grecaptchaService.js";
import Validators from "../../Validators.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/reset-password/reset-password.css');

export default class ResetPasswordView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('reset-password-view');

        this.main = document.createElement('main');
        this.main.classList.add('reset-password-main');
        this.view.append(this.main);

        this.form = document.createElement('form');
        this.form.classList.add('reset-password-form');
        this.main.append(this.form);

        this.passwordContainer = document.createElement('div');
        this.passwordContainer.classList.add('reset-password-container');
        this.form.append(this.passwordContainer);

        this.password = new Input({
            min: 8,
            max: 128,
            length: true,
            autocomplete: 'new-password',
            type: 'password',
            title: 'Escribí tu nueva contraseña'
        });
        this.passwordContainer.append(this.password.render());

        this.confirmationContainer = document.createElement('div');
        this.confirmationContainer.classList.add('reset-password-container');
        this.form.append(this.confirmationContainer);

        this.confirmation = new Input({
            min: 8,
            max: 128,
            length: true,
            autocomplete: 'new-password',
            type: 'password',
            title: 'Volvela a escribir'
        });
        this.confirmationContainer.append(this.confirmation.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('reset-password-container', 'reset-password-button-container');
        this.form.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.classList.add('reset-password-button');
        this.button.type = 'submit';
        this.button.textContent = 'Cambiar mi contraseña';
        this.button.onclick = (e) => {
            e.preventDefault();
            this.submit();
        }

        this.buttonContainer.append(this.button);

        this.form.append(new CaptchaBadge().render());
    }

    init (params, query) {
        this.params = params;
        this.query = query;

        if (!this.query) return router.navigateTo('/');
        if (!this.query.token) return router.navigateTo('/');

        this.setTitle('Crea una nueva contraseña');
        this.setView(this.view);
    }

    async submit () {
        const loader = new ScreenSpinner();
        try {
            Validators.Password(this.password.value);

            if (this.password.value !== this.confirmation.value) throw new Error('Las contraseñas no coinciden.');

            const grecaptchaToken = await grecaptchaService.execute();
            
            await authenticationService.resetPassword({
                grecaptcha_token: grecaptchaToken,
                token: this.query.token,
                password: this.password.value
            });

            this.password.set('');
            this.confirmation.set(' ');
            loader.remove();
            router.replace('/signin');
            return new Alert('Has cambiado tu contraseña correctamente.');
        } catch (error) {
            console.error(error);
            loader.remove();
            return new Alert(error.message, { error: true });
        }
    }
}