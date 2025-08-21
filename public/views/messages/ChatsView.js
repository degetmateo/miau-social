import Alert from "../../components/alert/alert.js";
import Aside from "../../components/aside/Aside.js";
import Chat from "../../components/chat/Chat.js";
import Header from "../../components/header/Header.js";
import MessageCreator from "../../components/message-creator/MessageCreator.js";
import Nav from "../../components/nav/Nav.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import View from "../../components/view/View.js";
import Helper from "../../Helper.js";
import Service from "../../modules/Service.js";
import Socket from "../../modules/Socket.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";
import FormCreateChat from "./FormCreateChat.js";

Helper.ImportCSS('/public/views/messages/styles/chats.css');

export default class ChatsView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('messages-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('messages-main');
        this.view.append(this.main);

        this.aside = new Aside();
        this.view.append(this.aside);

        this.header = new Header({ text: 'Chats' });
        this.header.addEventListener('click', () => {
            this.setScroll(0);
        });
        this.main.append(this.header);

        this.chats = document.createElement('div');
        this.chats.classList.add('messages-chats');
        this.main.append(this.chats);

        this.globalChat = new Chat();
        this.chats.append(this.globalChat);
        this.globalChat.addEventListener('click', () => {
            router.navigateTo('/chats/general');
        });

        this.startChatButton = document.createElement('div');
        this.startChatButton.classList.add('chats-start-chat-button');
        this.startChatButton.textContent = 'Comenzar Chat';
        this.startChatButton.addEventListener('click', () => {
            router.navigateTo('/chats/start-chat');
        });
        this.chats.append(this.startChatButton);
    };

    init () {    
        this.setTitle("Chats");
        this.setView(this.view);
        this.nav.append(Nav);
    };

    isActive () {
        return router.getPathname().startsWith('/messages');
    }

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    };

    reset () {
    };
};