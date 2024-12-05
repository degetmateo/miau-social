import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super();
        this.params = params;
        this.init(this.params);
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