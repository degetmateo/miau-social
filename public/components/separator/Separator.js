import {importCSS} from "../../helpers.js";

importCSS('/public/components/separator/separator.css');

export default class Separator {
    constructor () {
        this.separator = document.createElement('div');
        this.separator.classList.add('separator');
    }

    render () {
        return this.separator;
    }
}