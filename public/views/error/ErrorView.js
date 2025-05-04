import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/error/styles/error.css');

export default class extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.setTitle('Error');
        this.clear();
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="container-view-error">
                <h1>404: Recurso no encontrado.</h1>
                <img src="https://media.tenor.com/dpX8CAec-Y4AAAAM/cute-surprised.gif">
            </div>
        `;
    }
}