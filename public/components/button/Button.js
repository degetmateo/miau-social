import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/button/styles/button.css');

export default class Button {
    constructor (options = {
        text: 'Aceptar',
        onClick: () => {},
        appearance: 'default'
    }) {
        this.container = document.createElement('button');
        this.container.classList.add('button');
        this.container.classList.add(`button--${options.appearance}`);
        this.container.innerText = options.text;
        this.container.onclick = options.onClick;
    }

    add = (...tokens) => {
        this.container.classList.add(tokens);
    }

    render = () => {
        return this.container;
    }
}