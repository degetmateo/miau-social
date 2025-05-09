import Nav from "../../components/nav/Nav.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/messages/styles/messages.css');

export default class MessagesView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('messages-view');
    }

    init () {    
        this.setTitle("Mensajes");
        this.setView(this.view);
        this.view.append(Nav);
    }
}