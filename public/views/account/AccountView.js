import FormUpdateUsername from "../../components/form-update-username/FormUpdateUsername.js";
import Header from "../../components/header/Header.js";
import Separator from "../../components/separator/Separator.js";
import Tab from "../../components/tab/Tab.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/account/styles/account.css');

export default class AccountView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('account-view');

        this.main = document.createElement('main');
        this.main.classList.add('account-main');
        this.view.append(this.main);

        this.aside = document.createElement('aside');
        this.aside.classList.add('account-aside');
        this.view.append(this.aside);

        this.header = new Header({
            text: 'Cuenta'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.main.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);
        this.main.append(new Tab({
            href: "/settings/account/username",
            text: "Nombre de usuario"
        }));
        this.main.append(new Separator().render());
    };

    init () {
        this.view.append(window.app.nav.getNode());
        this.setTitle('Configurá tu cuenta');
        this.setView(this.view);
    };
};