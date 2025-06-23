import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Separator from "../../components/separator/Separator.js";
import Tab from "../../components/tab/Tab.js";
import Helper from "../../Helper.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS("/public/views/security/styles/security.css");

export default class SecurityView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('security-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('security-main');
        this.view.append(this.main);

        this.header = new Header({
            text: "Seguridad"
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.main.append(new Tab({
            href: "/settings/security/password",
            text: "Contraseña"
        }));

        this.main.append(new Separator().render());

        this.main.append(new Tab({
            href: "/settings/security/sessions",
            text: "Sesiones"
        }));

        this.main.append(new Separator().render());
    };

    init () {
        this.setTitle('Seguridad de la Cuenta');
        this.setView(this.view);
        this.nav.append(Nav);
    };
};