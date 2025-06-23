import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/spinner-loader/styles/spinner-loader.css');

export default class SpinnerLoader {
    constructor (options = {
        size: 'medium'
    }) {
        this.container = document.createElement('div');
        this.container.classList.add('loader-container');

        this.loader = document.createElement('div');
        this.loader.classList.add('loader', `loader--${options.size}`);
        this.container.append(this.loader);
    }

    render = () => {
        return this.container;
    }

    remove = () => {
        this.container.remove();
    }
}