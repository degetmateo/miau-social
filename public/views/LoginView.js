import Alert from "../components/alert/alert.js";
import ScreenSpinner from "../components/screen-spinner/ScreenSpinner.js";
import {init} from "../index.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";

export default class LoginView extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.setTitle('Iniciar Sesion');
        this.clear();
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        await this.events();
    }

    async events () {
        const formRegister = document.getElementById('form-register');
        const formLogin = document.getElementById('form-login');
        formRegister.addEventListener('submit', this.eventRegister);
        formLogin.addEventListener('submit', this.eventLogin);
    }

    async eventRegister (event) {
        event.preventDefault();

        const inputUsername = document.getElementById('form-register-input-username');
        const inputPassword = document.getElementById('form-register-input-password');
        const inputPassConfirm = document.getElementById('form-register-input-password-confirmation');

        const username = inputUsername.value;
        const password = inputPassword.value;
        const passwordConfirmation = inputPassConfirm.value;

        if (password != passwordConfirmation) return new Alert('Las contraseñas no coinciden.');

        const spinner = new ScreenSpinner();

        const request = await fetch('/api/authentication/signin', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });

        const response = await request.json();
        spinner.remove();

        if (!request.ok) {
            return new Alert(response.error.message);
        }

        window.app = {};
        window.app.alerts = [];
        localStorage.setItem('token', response.data.token);
        delete response.data.token;
        window.app.member = response.data;

        init();
        navigateTo('/home');
    }

    async eventLogin (event) {
        event.preventDefault()
        const inputUsername = document.getElementById('form-login-input-username');
        const inputPassword = document.getElementById('form-login-input-password');

        const spinner = new ScreenSpinner();
        const request = await fetch('/api/authentication/login', {
            method: 'POST',
            headers: { "Content-Type": "Application/JSON" },
            body: JSON.stringify({ username: inputUsername.value, password: inputPassword.value })
        });

        const response = await request.json();
        spinner.remove();

        if (!request.ok) {
            return new Alert(response.error.message);
        }

        window.app = {};
        window.app.alerts = [];
        localStorage.setItem('token', response.data.token);
        delete response.data.token;
        window.app.member = response.data;

        init();
        navigateTo('/home');
    }
}

const VIEW_CONTENT = `
    <div>
        <div class="container-view-login">
            <div class="container-forms">
                <div class="container-form">
                    <p>Crear una Cuenta</p>
                    <form class="form" action="/" method="post" id="form-register">
                        <input placeholder="Nombre de Usuario" type="text" name="input-name" id="form-register-input-username" required>
                        <input placeholder="Contraseña" type="password" name="input-password" id="form-register-input-password" required>
                        <input placeholder="Confirmar Contraseña" type="password" name="input-password-confirmation" id="form-register-input-password-confirmation" required>
                        <button type="submit">Enviar</button>
                    </form>    
                </div>

                <div class="container-form">
                    <p>Iniciar Sesión</p>
                    <form class="form" action="/" method="post" id="form-login">
                        <input placeholder="Nombre de Usuario" type="text" name="form-login-input-name" id="form-login-input-username" required>
                        <input placeholder="Contraseña" type="password" name="form-login-input-password" id="form-login-input-password" required>
                        <button type="submit">Enviar</button>
                    </form> 
                </div>
            <div>
        </div>
    </div>
`;