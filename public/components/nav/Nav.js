import {importCSS} from "../../helpers.js";
import MemberRole from "../member-role/MemberRole.js";
import NavButton from "../nav-button/NavButton.js";

importCSS('/public/components/nav/nav.css');

class Nav extends HTMLElement {
    constructor () {
        super();
        this.observerId = 'nav';
        this.classList.add('nav');
        this.buttons = document.createElement('div');
        this.buttons.classList.add('nav-buttons');
        this.append(this.buttons);

        this.buttonHome = new NavButton({
            pathname: '/home',
            text: 'Inicio',
            icon_on: '/public/assets/nav/home-on.svg',
            icon_off: '/public/assets/nav/home-off.svg'
        });
        this.buttons.append(this.buttonHome);

        this.buttonExplore = new NavButton({
            pathname: '/explore',
            text: 'Explorar',
            icon_on: '/public/assets/nav/explore-on.png',
            icon_off: '/public/assets/nav/explore-off.png',
        });
        this.buttons.append(this.buttonExplore);

        this.buttonProfile = new NavButton({
            pathname: '/member',
            text: 'Perfil',
            icon_on: '/public/assets/nav/member-on.svg',
            icon_off: '/public/assets/nav/member-off.svg'
        });
        this.buttons.append(this.buttonProfile);

        this.buttonNotifications = new NavButton({
            pathname: '/notifications',
            text: 'Notificaciones',
            icon_on: '/public/assets/nav/notifications-on.svg',
            icon_off: '/public/assets/nav/notifications-off.svg',
            onClick: () => {
                this.buttonNotifications.setNumber(null);
            }
        });
        this.buttons.append(this.buttonNotifications);

        // this.buttonMessages = new NavButton({
        //     pathname: '/chats',
        //     text: 'Chats',
        //     icon_on: '/public/assets/nav/messages-on.svg',
        //     icon_off: '/public/assets/nav/messages-off.svg'
        // });
        // this.buttons.append(this.buttonMessages);
        // const roleM = new MemberRole({ role: 'tester', text: 'BETA' });
        // roleM.classList.add('button-messages-role');
        // this.buttonMessages.append(roleM);

        this.buttonSettings = new NavButton({
            pathname: '/settings',
            text: 'Configuración',
            icon_on: '/public/assets/nav/settings-on.svg',
            icon_off: '/public/assets/nav/settings-off.svg' 
        });
        this.buttons.append(this.buttonSettings);
    };

    onNotification (notifications) {
        window.location.pathname === '/notifications' ?
            this.buttonNotifications.setNumber(null) :
            this.buttonNotifications.setNumber(notifications.length);
    };

    onPathnameChange () {
        this.buttonHome.update();
        this.buttonExplore.update();
        this.buttonProfile.update();
        this.buttonNotifications.update();
        // this.buttonMessages.update();
        this.buttonSettings.update();
    };

    isEqualTo (observer) {
        return this.observerId === observer.observerId;
    };

    set (member) {
        this.buttonProfile.setPathname(`/member/${member.username}`);
    };
};

customElements.define('app-nav', Nav);
export default new Nav();