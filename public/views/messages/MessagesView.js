import Nav from "../../components/nav/Nav.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/messages/styles/messages.css');

export default class MessagesView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('messages-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);
    }

    init () {    
        this.setTitle("Mensajes");
        this.setView(this.view);
        this.nav.append(Nav);
    }
}