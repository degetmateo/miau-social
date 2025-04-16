import FormSignup from "../../components/form-signup/FormSignup.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/signup/styles/signup.css');

export default class SignupView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('div');
        this.view.classList.add('signup');

        this.form = new FormSignup((data) => {

        });

        this.view.append(this.form.render());
    }

    async init (params) {
        this.params = params;

        this.setTitle('Registrarse');
        this.clear();

        this.app.append(this.view);
    }
}