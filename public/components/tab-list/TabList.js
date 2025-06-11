import {importCSS} from "../../helpers.js";

importCSS('/public/components/tab-list/tab-list.css');

class TabList extends HTMLElement {
    constructor () {
        super();
        this.tabs = [];
        this.selected = null;
        this.classList.add('app-tab-list');
    };

    add (data = {
        name: '',
        value: ''
    }) {
        const tab = document.createElement('div');
        tab.classList.add('app-tab');
        tab.value = data.value;
        this.append(tab);

        const text = document.createElement('span');
        text.classList.add('tab-text');
        text.textContent = data.name;
        tab.append(text);

        tab.select = () => {
            this.tabs.forEach(t => t.classList.remove('app-tab-active'));
            tab.classList.add('app-tab-active');
            this.selected = tab;
        };

        if (!this.selected) tab.select();

        this.tabs.push(tab);
        return tab;
    };
};

customElements.define('app-tab-list', TabList);
export default TabList;