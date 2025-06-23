import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/view/view.css');

class View extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-view');
    };
};

customElements.define('app-view', View);
export default View;