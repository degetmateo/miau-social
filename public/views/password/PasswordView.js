import FormUpdatePassword from "../../components/form-update-password/FormUpdatePassword.js";
import FormUpdateUsername from "../../components/form-update-username/FormUpdateUsername.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Separator from "../../components/separator/Separator.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/password/styles/password.css');

export default class PasswordView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('password-view');

        this.main = document.createElement('main');
        this.main.classList.add('password-main');
        this.view.append(this.main);

        this.aside = document.createElement('aside');
        this.aside.classList.add('password-aside');
        this.view.append(this.aside);

        this.header = new Header({
            text: 'Contraseña'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.main.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.formPassword = new FormUpdatePassword();
        this.main.append(this.formPassword);

        this.main.append(new Separator().render());
    };

    init () {
        this.view.append(Nav);
        this.setTitle('Contraseña');
        this.setView(this.view);
    };
};