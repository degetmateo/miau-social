import {importCSS} from "../../helpers.js";
import EventsHandler from "../../modules/EventsHandler.js";

importCSS('/public/components/nav/nav.css');

class Nav extends HTMLElement {
    constructor () {
        super();
        this.observerId = 'nav';
        EventsHandler.addObserver(this);
        this.classList.add('nav');
        this.buttons = document.createElement('div');
        this.buttons.classList.add('nav-buttons');
    };

    onNotification (notifications) {

    };
};

customElements.define('app-nav', Nav);
export default new Nav();