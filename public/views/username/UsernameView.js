import FormUpdateUsername from "../../components/form-update-username/FormUpdateUsername.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Separator from "../../components/separator/Separator.js";
import Helper from "../../Helper.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/username/styles/username.css');

export default class UsernameView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('username-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('username-main');
        this.view.append(this.main);

        this.aside = document.createElement('aside');
        this.aside.classList.add('username-aside');
        this.view.append(this.aside);

        this.header = new Header({
            text: 'Nombre de usuario'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);
        this.formUsername = new FormUpdateUsername();
        this.main.append(this.formUsername);
        this.main.append(new Separator().render());
    };

    init () {
        this.nav.append(Nav);
        this.setTitle('Configurá tu nombre de usuario');
        this.setView(this.view);
        this.formUsername.username.set(window.app.member.username);
    };
};