import { importCSS } from "../../helpers.js";

importCSS('/public/components/divider/divider.css');

class Divider extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-divider');
    };
};

customElements.define("app-divider", Divider);
export default Divider;