import Alert from "../../components/alert/alert.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import {importCSS} from "../../helpers.js";
import {init} from "../../index.js";
import router from "../../router.js";
import {authenticationService} from "../../services/authenticationService.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/verification/styles/verify.css');

export default class VerifyView extends AbstractView {
    constructor () {
        super();
        this.data = null;
        this.query = null;

        this.view = document.createElement('div');
        this.view.classList.add('verify-view');

        this.main = document.createElement('main');
        this.main.classList.add('verify-main');
        this.view.append(this.main);
    }

    async init (data, query) {
        if (window.app.logged) {
            router.navigateTo('/home');
            return;
        }
        
        this.data = data;
        this.query = query;
        
        if (!this.query) {
            router.navigateTo('/');
            return;   
        }

        if (!this.query.token) {
            new Alert("Ha ocurrido un error de autorización.", { error: true });
            router.navigateTo('/');
            return;
        }

        this.setTitle('Verificar tu cuenta');
        this.setView(this.view);

        const loader = new ScreenSpinner();

        let response;
        try {
            response = await authenticationService.verify({ 
                token: this.query.token,
                platform: platform.description
            });
        } catch (error) {
            new Alert(error.message, { 
                error: true,
                timeout: 4000
            });
            loader.remove();
            router.navigateTo('/');
            return;
        }

        localStorage.setItem('token', response.token);
        delete response.token;

        window.app = {};
        window.app.logged = true;
        window.app.alerts = [];
        window.app.member = response;

        init();
        loader.remove();
        router.replace('/home');
        new Alert("Tu cuenta se ha activado correctamente.", { error: false });
    }
}