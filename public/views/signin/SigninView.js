import Alert from "../../components/alert/alert.js";
import CaptchaBadge from "../../components/captcha-badge/CaptchaBadge.js";
import Input from "../../components/input/input.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import {importCSS} from "../../helpers.js";
import {init} from "../../index.js";
import router from "../../router.js";
import {authenticationService} from "../../services/authenticationService.js";
import AbstractView from "../AbstractView.js";
import { RECAPTCHA_KEY } from "../../config.js";

importCSS('/public/views/signin/styles/signin.css');

export default class SigninView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('div');
        this.view.classList.add('signin');

        this.main = document.createElement('main');
        this.main.classList.add('signin-main');
        this.view.append(this.main);

        this.form = document.createElement('form');
        this.form.classList.add('signin-form');
        this.main.append(this.form);

        this.title = document.createElement('span');
        this.title.classList.add('signin-title');
        this.title.textContent = 'Iniciá sesión en tu cuenta.';
        this.form.append(this.title);

        this.usernameContainer = document.createElement('div');
        this.usernameContainer.classList.add('signin-container');
        this.form.append(this.usernameContainer);

        this.username = new Input({
            title: 'Escribí tu nombre de usuario',
            type: 'text',
            min: 0,
            max: 16,
            autocomplete: 'on',
            length: false
        });
        this.usernameContainer.append(this.username.render());

        this.forgottenUsernameContainer = document.createElement('div');
        this.forgottenUsernameContainer.classList.add('signin-details');
        this.usernameContainer.append(this.forgottenUsernameContainer);

        this.forgottenUsername = document.createElement('span');
        this.forgottenUsername.classList.add('signin-text');
        this.forgottenUsername.textContent = '¿Olvidaste tu usuario?'
        this.forgottenUsernameContainer.append(this.forgottenUsername);

        this.forgottenUsernameURL = document.createElement('span');
        this.forgottenUsernameURL.classList.add('link');
        this.forgottenUsernameURL.textContent = 'Hacé click acá.';
        this.forgottenUsernameContainer.append(this.forgottenUsernameURL);

        this.passwordContainer = document.createElement('div');
        this.passwordContainer.classList.add('signin-container');
        this.form.append(this.passwordContainer);

        this.password = new Input({
            title: 'Escribí tu clave',
            type: 'password',
            min: 0,
            max: 128,
            autocomplete: 'current-password',
            length: false
        });
        this.passwordContainer.append(this.password.render());

        this.forgottenPasswordContainer = document.createElement('div');
        this.forgottenPasswordContainer.classList.add('signin-details');
        this.passwordContainer.append(this.forgottenPasswordContainer);

        this.forgottenPassword = document.createElement('span');
        this.forgottenPassword.classList.add('signin-text');
        this.forgottenPassword.textContent = '¿Olvidaste tu clave?'
        this.forgottenPasswordContainer.append(this.forgottenPassword);

        this.forgottenPasswordURL = document.createElement('span');
        this.forgottenPasswordURL.classList.add('link');
        this.forgottenPasswordURL.textContent = 'Hacé click acá.';
        this.forgottenPasswordContainer.append(this.forgottenPasswordURL);

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('signin-container', 'signin-container-button');
        this.form.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.classList.add('signin-button');
        this.button.type = 'submit';
        this.button.textContent = 'Iniciar sesión →';
        this.buttonContainer.append(this.button);

        this.form.append(new CaptchaBadge().render());

        this.forgottenUsernameURL.onclick = (e) => {
            e.preventDefault();
            router.navigateTo('/recovery/username');
            return;
        }

        this.forgottenPasswordURL.onclick = (e) => {
            e.preventDefault();
            router.navigateTo('/recovery/password');
            return;
        }

        this.button.onclick = (e) => {
            e.preventDefault();
            this.submit();
        }
    }

    async init (params) {
        this.params = params;

        this.setTitle('Iniciar Sesión');
        this.setView(this.view);
    }

    async submit () {
        if (!this.username.value) return new Alert('Tenés que escribir tu nombre de usuario.', { error: true });
        if (!this.username.value.trim()) return new Alert('Tenés que escribir tu nombre de usuario.', { error: true });
        if (!this.password.value) return new Alert('Tenés que escribir tu clave.', { error: true });
        if (!this.password.value.trim()) return new Alert('Tenés que escribir tu clave.', { error: true });
        
        const loader = new ScreenSpinner();

        grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_KEY, {
                action: 'submit'
            }).then(async (token) => {
                let response;
                try {
                    response = await authenticationService.signin({
                        username: this.username.value,
                        password: this.password.value,
                        captcha_token: token
                    });
                } catch (error) {
                    loader.remove();
                    new Alert(error.message, { error: true });
                    
                    if (error.code === 'account-not-activated') {
                        router.navigateTo('/recovery/activate');
                    }
                    
                    return;
                }

                localStorage.setItem('token', response.token);
                delete response.token;
                window.app = {};
                window.app.alerts = [];
                window.app.logged = true;
                window.app.member = response;
                init();

                this.username.set('');
                this.password.set('');

                loader.remove();
                router.navigateTo('/home');
                new Alert("Has iniciado sesión.", { error: false, timeout: 2000 });
            });
        });
    }
}