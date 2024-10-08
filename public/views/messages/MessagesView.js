import Navigation from "../../components/navigation/navigation.js";
import AbstractView from "../AbstractView.js";

export default class MessagesView extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.clear();
        this.setTitle("Mensajes")
        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view', 'container-view-messages');
        this.appContainer.appendChild(this.viewContainer);

        this.viewContainer.appendChild(window.app.nav.getNode());
        this.CreateMain();
    }

    CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('comments-view-main');
        this.main.innerHTML = `
            <p style="padding: 10px; text-align: center; font-size: 20px;">Under development.</p>
        `;
        this.viewContainer.appendChild(this.main);
    }
}