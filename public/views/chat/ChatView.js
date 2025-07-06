import Nav from "../../components/nav/Nav.js";
import Helper from "../../Helper.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/chat/chat-view.css');

export default class ChatView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('chat-view');
    };

    init () {
        this.setTitle('Chat');
        this.setView(this.view);
        this.view.prepend(Nav);
    };

    reset () {

    };
};