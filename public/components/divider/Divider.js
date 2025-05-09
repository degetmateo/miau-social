import { importCSS } from "../../helpers.js";

importCSS('/public/components/divider/divider.css');

class Divider extends HTMLElement {
    constructor () {
        super();
    };
};

customElements.define("app-divider", Divider);
export default Divider;