import { importCSS } from "../../helpers.js";

importCSS('/public/components/spinner-loader/styles/spinner-loader.css');

export default class SpinnerLoader {
    constructor (options = {
        size: 'medium'
    }) {
        this.loader = document.createElement('div');
        this.loader.classList.add('loader', `loader--${options.size}`);
    }

    render = () => {
        return this.loader;
    }

    remove = () => {
        this.loader.remove();
    }
}