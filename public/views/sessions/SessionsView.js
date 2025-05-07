import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import Separator from "../../components/separator/Separator.js";
import Tab from "../../components/tab/Tab.js";
import {importCSS} from "../../helpers.js";
import {sessionService} from "../../services/sessionService.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/sessions/styles/sessions.css');

export default class SessionsView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('sessions-view');

        this.main = document.createElement('main');
        this.main.classList.add('sessions-main');
        this.view.append(this.main);

        this.aside = document.createElement('aside');
        this.aside.classList.add('sessions-aside');
        this.view.append(this.aside);

        this.header = new Header({
            text: 'Sesiones'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.main.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.container = document.createElement('div');
        this.container.classList.add('sessions-container')

        this.main.append(this.container);
    };

    async init () {
        this.view.append(Nav);
        this.setTitle('Sesiones');
        this.setView(this.view);

        this.container.innerHTML = '';
        const loader = new ScreenSpinner();
        const sessions = await sessionService.get();

        for (const session of sessions) {
            const sContainer = document.createElement('div');
            sContainer.classList.add('session');

            const sIp = document.createElement('span');
            sIp.classList.add('session-ip');
            sIp.textContent = session.ip;

            const sPlatform = document.createElement('span');
            sPlatform.classList.add('session-platform');
            sPlatform.textContent = session.platform;

            sContainer.append(sIp);
            sContainer.append(sPlatform);

            this.container.append(sContainer);
            this.container.append(new Separator().render());
        };

        const mContainer = document.createElement('div');
        mContainer.classList.add('sessions-message');
        mContainer.textContent = 'Para cerrar las sesiones, cambiá tu contraseña.';
        this.container.append(mContainer);
        this.container.append(new Separator().render());

        loader.remove();
    };
};