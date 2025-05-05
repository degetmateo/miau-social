import {importCSS} from "../../helpers";

importCSS('/public/components/nav-button/nav-button.css');

class NavButton extends HTMLElement {
    constructor (data = {
        icon_on: '',
        icon_off: ''
    }) {
        super();
        this.classList.add('nav-button');
        
        this.iconOn = document.createElement('img');
        this.iconOn.classList.add('nav-button-icon', 'nav-button-icon-on');
        this.iconOn.src = data.icon_on;

        this.iconOff = document.createElement('img');
        this.iconOff.classList.add('nav-button-icon', 'nav-button-icon-off');
        this.iconOff.src = data.icon_off;
    };
};

customElements.define('app-nav-button', NavButton);
export default NavButton;