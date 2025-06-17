import AbstractView from '../AbstractView.js';
import {importCSS} from '../../helpers.js';
import Header from '../../components/header/Header.js';
import Separator from '../../components/separator/Separator.js';
import Alert from '../../components/alert/alert.js';
import Tab from '../../components/tab/Tab.js';
import Nav from '../../components/nav/Nav.js';
import ConfirmPopup from '../../components/confirm-popup/ConfirmPopup.js';
import Service from '../../modules/Service.js';

importCSS('/public/views/settings/styles/settings.css');

export default class extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('settings-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('settings-main');
        this.view.append(this.main);

        this.aside = document.createElement('aside');
        this.aside.classList.add('settings-aside');
        this.view.append(this.aside);

        this.header = new Header({
            text: 'Configuración'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.main.append(new Tab({
            href: '/settings/account',
            text: 'Cuenta'
        }));

        this.main.append(new Separator().render());

        this.main.append(new Tab({
            href: '/settings/security',
            text: 'Seguridad'
        }));

        this.main.append(new Separator().render());

        this.main.append(new Tab({
            text: 'Cerrar sesión',
            onClick: (e) => {
                new ConfirmPopup({
                    title: '¿Querés cerrar la sesión?',
                    description: 'Saldrás de tu cuenta y tendrás que volver a iniciar sesión con tus datos.',
                    confirmText: 'Cerrar sesión',
                    cancelText: 'Cancelar',
                    onConfirm: async () => {
                        e.stopPropagation();
                        new Alert("¡Cerraste la sesión!", { error: false });
                        Service.SignOut();
                    },
                    onCancel: null
                });
            }
        }));

        this.main.append(new Separator().render());
    };

    async init (params) {
        this.params = params;
        this.setTitle('Configuración');
        this.setView(this.view);
        this.nav.append(Nav);
    };
};