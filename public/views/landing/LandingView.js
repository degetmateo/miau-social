import Helper from "../../Helper.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/landing/styles/landing-view.css');

export default class LandingView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('div');
        this.view.classList.add('landing-view');

        this.main = document.createElement('main');
        this.main.classList.add('landing-main');
        this.view.append(this.main);

        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.classList.add('landing-buttons');
        this.main.append(this.buttonsContainer);

        this.signupContainer = document.createElement('div');
        this.signupContainer.classList.add('landing-form');
        this.buttonsContainer.append(this.signupContainer);

        this.signupTitle = document.createElement('span');
        this.signupTitle.classList.add('landing-title');
        this.signupTitle.textContent = '¿No tenés cuenta?';
        this.signupContainer.append(this.signupTitle);

        this.signupButton = document.createElement('button');
        this.signupButton.classList.add('landing-button');
        this.signupButton.textContent = 'Crear mi cuenta';
        this.signupButton.onclick = () => {
            router.navigateTo('/signup');
            return;
        };
        this.signupContainer.append(this.signupButton);

        this.signinContainer = document.createElement('div');
        this.signinContainer.classList.add('landing-form');
        this.buttonsContainer.append(this.signinContainer);

        this.signinTitle = document.createElement('span');
        this.signinTitle.classList.add('landing-title');
        this.signinTitle.textContent = '¿Ya tenés cuenta?';
        this.signinContainer.append(this.signinTitle);

        this.signinButton = document.createElement('button');
        this.signinButton.classList.add('landing-button');
        this.signinButton.textContent = 'Iniciar sesión';
        this.signinButton.onclick = () => {
            router.navigateTo('/signin');
            return;
        }
        this.signinContainer.append(this.signinButton);
    }

    async init (params) {
        this.params = params;
        
        if (window.app.logged) {
            router.navigateTo('/home');
            return;
        }

        this.setView(this.view);
        this.setTitle('Social Miau');
    }
}