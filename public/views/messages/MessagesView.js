import Divider from "../../components/divider/Divider.js";
import Header from "../../components/header/Header.js";
import Input from "../../components/input/input.js";
import MessageCreator from "../../components/message-creator/MessageCreator.js";
import Nav from "../../components/nav/Nav.js";
import Textarea from "../../components/textarea/textarea.js";
import View from "../../components/view/View.js";
import Helper from "../../Helper.js";
import {importCSS} from "../../helpers.js";
import Service from "../../modules/Service.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";
import Message from "./Message.js";

importCSS('/public/views/messages/styles/messages.css');

export default class MessagesView extends AbstractView {
    constructor () {
        super();
        this.view = new View();
        this.view.classList.add('messages-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('messages-main');
        this.view.append(this.main);

        this.header = new Header({ text: 'Mensajes' });
        this.header.addEventListener('click', () => {
            this.setScroll(0);
        });
        this.main.append(this.header);

        this.messages = document.createElement('div');
        this.messages.classList.add('messages-container');
        this.main.append(this.messages);

        this.whoIsWritingContainer = document.createElement('div');
        this.whoIsWritingContainer.classList.add('messages-writing-container');
        this.main.append(this.whoIsWritingContainer);

        this.whoIsWriting = document.createElement('span');
        this.whoIsWriting.classList.add('messages-writing');

        this.whoIsWritingUsername = document.createElement('span');
        this.whoIsWriting.append(this.whoIsWritingUsername);

        this.whoIsWritingDots = document.createElement('span');
        this.whoIsWritingDots.classList.add('dots');
        this.whoIsWriting.append(this.whoIsWritingDots);

        this.creatorContainer = document.createElement('div');
        this.creatorContainer.classList.add('messages-creator-container');
        this.main.append(this.creatorContainer);

        this.socket = null;
        window.addEventListener('app-initialized', () => {
            window.app.socket = io();

            this.creator = new MessageCreator();
            this.creator.classList.add('message-creator-border');
            this.creatorContainer.append(this.creator);

            this.socket = window.app.socket;

            this.socket.on('connect', () => {
                this.socket.emit('register', localStorage.getItem('token'));
            });

            const s = []
            this.socket.on('messages', (messages) => {
                for (const message of messages) {
                    this.messages.prepend(new Message(message));
                };

                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('user-connect', (user) => {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container');
                const message = document.createElement('span');
                message.classList.add('message-content');
                message.textContent = user.username + ' se conectó.';
                messageContainer.append(message);
                this.messages.prepend(messageContainer);
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('user-disconnect', (user) => {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container');
                const message = document.createElement('span');
                message.classList.add('message-content');
                message.textContent = user.username + ' se desconectó.';
                messageContainer.append(message);
                this.messages.prepend(messageContainer);
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('chat-message', (message) => {
                this.counter++;
                if (!this.isActive()) {
                    Nav.buttonMessages.setNumber(this.counter);
                } else {
                    this.counter = 0;
                };
    
                this.messages.prepend(new Message(message));
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.writingTimeout = null;
            this.socket.on('writing', (data) => {
                this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
                this.whoIsWritingContainer.append(this.whoIsWriting);
                
                if (this.writingTimeout) {
                    this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
                    clearTimeout(this.writingTimeout);
                    this.writingTimeout = null;
                };
                
                this.writingTimeout = setTimeout(() => {
                    this.whoIsWriting.remove();
                    this.writingTimeout = null;
                }, 5000);
            });

            this.socket.on('unauthorized', (data) => {
                Service.Refresh({
                    callback: async () => {
                        if (data.code === 'register') {
                            this.socket.on('connect', () => {
                                this.socket.emit('register', localStorage.getItem('token'));
                            });
                        };

                        if (data.code === 'message') {
                            this.socket.emit('chat-message', {
                                token: localStorage.getItem('token'),
                                content: data.content 
                            });
                        };
                    }
                });
            });
        });

        this.counter = 0;
    };

    init () {    
        this.setTitle("Mensajes");
        this.setView(this.view);
        this.nav.append(Nav);
        this.messages.scrollTop = this.messages.scrollHeight;
        this.counter = 0;
        Nav.buttonMessages.setNumber(this.counter);

        // fetch('https://open.spotify.com/oembed?url=https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6', {
        //     method: "GET"
        // })
        // .then((res) => res.json())
        // .then((data) => console.log(data));
    };

    isActive () {
        return router.getPathname().startsWith('/messages');
    }

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    };

    reset () {
        this.socket = null;
        this.creator.remove();
    };
};