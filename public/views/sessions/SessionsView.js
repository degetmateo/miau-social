import Alert from "../../components/alert/alert.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import Separator from "../../components/separator/Separator.js";
import Tab from "../../components/tab/Tab.js";
import {importCSS} from "../../helpers.js";
import router from "../../router.js";
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

        this.main.append(new Tab({
            text: "Cerrar todas las sesiones",
            onClick: async (e) => {
                e.stopPropagation();
                const loader = new ScreenSpinner();
                try {
                    await sessionService.close();
                    await this.loadSessions();
                } catch (error) {
                    new Alert(error.message, { error: true });
                };
                loader.remove();
            }
        }));

        this.main.append(new Separator().render());
        
        this.container = document.createElement('div');
        this.container.classList.add('sessions-container')
        this.main.append(this.container);
    };

    async init () {
        this.view.append(Nav);
        this.setTitle('Sesiones');
        this.setView(this.view);

        const loader = new ScreenSpinner();
        try {
            await this.loadSessions();
        } catch (error) {
            new Alert(error.message, { error: true });
        };
        loader.remove();
    };

    async loadSessions () {
        this.container.innerHTML = '';
        const sessions = await sessionService.get();

        for (const session of sessions) {
            const sContainer = document.createElement('div');
            sContainer.classList.add('session');

            const sIpContainer = document.createElement('div');
            sIpContainer.classList.add('session-ip-container');
            sContainer.append(sIpContainer);
            
            const sIp = document.createElement('span');
            sIp.classList.add('session-ip');
            sIp.textContent = session.ip;
            sIpContainer.append(sIp);

            const sActual = document.createElement('span');
            sActual.classList.add('session-ip-actual');
            sActual.textContent = 'SESIÓN ACTUAL';
            if (session.actual) sIpContainer.append(sActual);

            const sPlatform = document.createElement('span');
            sPlatform.classList.add('session-platform');
            sPlatform.textContent = session.platform;

            sContainer.append(sPlatform);

            this.container.append(sContainer);
            this.container.append(new Separator().render());
        };
    }
};