import Observer from "../interfaces/Observer.js";

export default class extends Observer {
    constructor () {
        super();
        this.appContainer = document.getElementById('app');
        this.app = document.getElementById('app');
    }

    clear () {
        this.appContainer.innerHTML = '';
    }

    setTitle (title) {
        document.title = title;
    }

    css = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    async init () {
        
    }
}