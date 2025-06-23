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

Helper.ImportCSS('/public/views/recover-username/recover-username.css');

export default class RecoverUsernameView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('recover-username-view');

        this.main = document.createElement('main');
        this.main.classList.add('recover-username-main');
        this.view.append(this.main);

        this.form = document.createElement('form');
        this.form.classList.add('recover-username-form');
        this.main.append(this.form);

        this.titleContainer = document.createElement('div');
        this.titleContainer.classList.add('recover-username-title-container');
        this.form.append(this.titleContainer);

        this.title = document.createElement('span');
        this.title.classList.add('recover-username-title');
        this.title.textContent = 'Para recuperar tu usuario, tenés que ingresar el correo electrónico asociado.';
        this.titleContainer.append(this.title);

        this.emailContainer = document.createElement('div');
        this.emailContainer.classList.add('recover-username-container');
        this.form.append(this.emailContainer);

        this.email = new Input({
            min: 0,
            max: 128,
            length: false,
            type: 'email',
            autocomplete: 'on',
            title: 'Escribí tu correo electrónico'
        });
        this.emailContainer.append(this.email.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('recover-username-container', 'recover-username-button-container');
        this.form.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.classList.add('recover-username-button');
        this.button.textContent = 'Recuperar mi usuario';
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

        this.setTitle('Recupera tu usuario');
        this.setView(this.view);
    }

    async submit () {
        const loader = new ScreenSpinner();
        try {
            Validators.Email(this.email.value);

            const grecaptcha_token = await grecaptchaService.execute();
            await authenticationService.recoverUsername({
                token: grecaptcha_token,
                email: this.email.value
            });
            loader.remove();
            router.navigateTo('/');
            return new Alert('Revisa la bandeja de entrada o la carpeta spam de tu correo electrónico.');
        } catch (error) {
            loader.remove();
            return new Alert(error.message, { error: true });
        }
    }
}