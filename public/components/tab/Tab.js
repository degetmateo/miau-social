import {importCSS} from "../../helpers.js";
import router from "../../router.js";

importCSS('/public/components/tab/tab.css');

class Tab extends HTMLElement {
    constructor (data = {
        href: '',
        text: '',
        onClick: () => {}
    }) {
        super();
        this.onclick = data.onClick ? data.onClick : (e) => {
            e.stopPropagation();
            router.navigateTo(data.href);
        };
        this.classList.add('tab');
        this.text = document.createElement('span');
        this.text.classList.add('tab-text');
        this.text.textContent = data.text;
        this.append(this.text);

        this.arrow = document.createElement('span');
        this.arrow.classList.add('tab-arrow');
        this.arrow.textContent = '›';
        this.append(this.arrow);
    };
};

customElements.define('app-tab', Tab);
export default Tab;