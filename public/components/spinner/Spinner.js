import {importCSS} from "../../helpers.js";

importCSS('/public/components/spinner/spinner.css');

class Spinner extends HTMLElement {
    constructor () {
        super();
        this.classList.add('spinner-container');
        this.spinner = document.createElement('div');
        this.spinner.classList.add('spinner');
        this.append(this.spinner);
    };
};

customElements.define('app-spinner', Spinner);
export default Spinner;