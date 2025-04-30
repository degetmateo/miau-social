import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import BackButton from "../back-button/BackButton.js";
importCSS('/public/components/header/header.css');

class Header extends HTMLElement {
    constructor (data = {
        text: ''
    }) {
        super();
        this.classList.add('header');
        
        this.button = new BackButton();
        this.button.onclick = () => router.goBack();
        this.append(this.button);

        this.text = document.createElement('span');
        this.text.classList.add('header-title');
        this.text.textContent = data.text;
        this.append(this.text);
    };

    set (value) {
        this.text.textContent = value;
    };
};

customElements.define('app-header', Header);
export default Header;