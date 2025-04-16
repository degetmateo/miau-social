import {importCSS} from "../../helpers.js";
import SpinnerLoader from "../spinner-loader/SpinnerLoader.js";

importCSS('/public/components/screen-spinner/styles/screen-spinner.css');

export default class ScreenSpinner {
    constructor (data = {
        opaque: false
    }) {
        this.container = document.createElement('div');
        this.container.classList.add('screen-spinner-container');
        if (data.opaque) this.container.classList.add('screen-spinner-container--opaque');
        document.getElementById('app').appendChild(this.container);

        this.spinner = new SpinnerLoader({
            size: 'enormous'
        });

        this.container.appendChild(this.spinner.render());
    }

    remove = () => {
        this.container.remove();
    }
}