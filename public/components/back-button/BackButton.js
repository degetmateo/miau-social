import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/back-button/back-button.css');

class BackButton extends HTMLElement {
    constructor () {
        super();
        this.text = document.createElement('span');
        this.text.textContent = '←';
        this.append(this.text);
    };
};

customElements.define('back-button', BackButton);
export default BackButton;