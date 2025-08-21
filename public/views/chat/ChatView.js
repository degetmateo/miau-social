import Aside from "../../components/aside/Aside.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Helper from "../../Helper.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/chat/chat-view.css');

export default class StartChatView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('view');
        this.view.classList.add('chat-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('chat-main');
        this.view.append(this.main);

        this.header = new Header({ text: '' });
        this.header.addEventListener('click', () => {
            this.setScroll(0);
        });
        this.main.append(this.header);

        this.aside = new Aside();
        this.view.append(this.aside);

        this.messageContainer = document.createElement('div');
        this.messageContainer.classList.add('chat-message-container');
        this.main.append(this.messageContainer);

        this.message = document.createElement('span');
        this.message.classList.add('chat-view-message');
        this.message.textContent = 'En construcción...';
        this.messageContainer.append(this.message);

        this.image = document.createElement('img');
        this.image.src = 'https://pbs.twimg.com/media/Gyq1zaHXYAk7t1Q?format=jpg&name=360x360';
        this.messageContainer.append(this.image);
    };

    async init (data) {
        this.header.set(data.username);
        this.setTitle(data.username);
        this.setView(this.view);
        this.nav.append(Nav);
    };
};