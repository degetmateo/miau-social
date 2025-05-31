import {importCSS} from "../../helpers.js";

importCSS('/public/components/tab-list/tab-list.css');

class TabList extends HTMLElement {
    constructor () {
        super();
        this.tabs = [];
        this.classList.add('app-tab-list');
    };

    add (tab = {
        name: '',
        onClick: () => {}
    }) {
        const T = document.createElement('div');
        T.classList.add('app-tab');
        T.textContent = tab.name;
        T.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.tabs.forEach(t => t.classList.remove('app-tab-active'));
            T.classList.add('app-tab-active');
            tab.onClick();
        };
        this.append(T);
        this.tabs.push(T);
        if (this.tabs.length === 1) {
            T.classList.add('app-tab-active');
        };
    };
};

customElements.define('app-tab-list', TabList);
export default TabList;