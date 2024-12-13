import AbstractView from '../AbstractView.js';
import FormUpdateIcon from './FormUpdateIcon.js';
import FormLogout from './FormLogout.js';
import FormUpdateBio from './FormUpdateBio.js';
import FormUpdateName from './FormUpdateName.js';
import FormUpdateUsername from './FormUpdateUsername.js';
import FormUpdatePassword from './FormUpdatePassword.js';
import FormUpdateBannerURL from './FormUpdateBannerURL.js';
import FormUpdateBannerImage from './FormUpdateBannerImage.js';

export default class extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.setTitle('Configuración');
        this.clear();

        this.view = document.createElement('div');
        this.view.classList.add('settings-view');
        this.view.appendChild(window.app.nav.getNode());
        this.view.style.gridTemplateColumns = `min-content 1fr ${window.app.nav.getNode().innerWidth};`;
        this.main = document.createElement('div');
        this.main.classList.add('settings-main');
        this.view.appendChild(this.main);
        this.appContainer.appendChild(this.view);

        this.main.appendChild(FormLogout.getNode());
        this.main.appendChild(FormUpdateIcon.getNode());
        this.main.appendChild(new FormUpdateBannerURL().render());
        this.main.appendChild(new FormUpdateBannerImage().render());
        this.main.appendChild(FormUpdateBio.node());
        this.main.appendChild(FormUpdateName.node());
        this.main.appendChild(FormUpdateUsername.node());
        this.main.appendChild(FormUpdatePassword.node());
    }
}