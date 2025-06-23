import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/alert/alert.css');

export default class Alert {
    constructor (message, options = {
        error: false,
        timeout: 4000,
        onClick: () => {}
    }) {
        this.options = options;
        this.message = message;
        this.container = document.createElement('div');
        this.container.classList.add('container-alert');

        options.error ?
            this.container.classList.add('container-alert--error') :
            this.container.classList.add('container-alert--success');

        this.containerContent = document.createElement('div');
        this.containerContent.classList.add('container-alert-content');
        this.container.appendChild(this.containerContent);
        document.body.appendChild(this.container);
        this.CreateContentBody();
        this.events();

        if (!window.app.alerts) window.app.alerts = new Array();
        if (window.app.alerts[0]) window.app.alerts[0].delete();
        window.app.alerts[0] = this;
    }

    getElement () {
        return this.container;
    }

    delete () {
        this.container.remove();
    }

    events () {
        this.container.onclick = () => {
            this.delete();
            if (this.options.onClick) this.options.onClick();  
        }

        if (this.options.timeout === null) return;
        if (this.options.timeout === undefined) this.options.timeout = 4000;
        
        setTimeout(() => {
            this.delete();
        }, this.options.timeout);
    }

    body () {
        return this.containerBody;
    }

    CreateContentBody () {
        this.containerBody = document.createElement('div');
        this.containerBody.classList.add('container-alert-content-body');
        this.containerBody.textContent = this.message;
        this.containerContent.appendChild(this.containerBody);
    }
}