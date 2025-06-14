import Divider from "../../components/divider/Divider.js";
import Header from "../../components/header/Header.js";
import Input from "../../components/input/input.js";
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

        this.formContainer = document.createElement('div');
        this.formContainer.classList.add('form-container');
        this.main.append(this.formContainer);

        this.messages = document.createElement('div');
        this.messages.classList.add('messages-container');
        this.formContainer.append(this.messages);

        this.form = document.createElement('form');
        this.form.classList.add('messages-form');
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.send();
        });
        this.formContainer.append(this.form);

        this.input = new Textarea({
            title: null,
            autocomplete: 'off',
            placeholder: 'Escribí tu mensaje',
            min: 0,
            max: 512,
            type: 'text',
            length: false,
            onInput: () => {

            },
            onStop: () => {

            },
            onSubmit: () => {
                this.send();
            }
        });

        this.input.container.classList.add('messages-input');

        this.form.append(this.input.render());

        this.button = document.createElement('button');
        this.button.type = 'submit';
        this.button.textContent = '›';
        this.button.classList.add('messages-button');
        this.form.append(this.button);

        this.socket = null;
        window.addEventListener('app-initialized', () => {
            this.socket = io();

            this.socket.on('connect', () => {
                this.socket.emit('register', localStorage.getItem('token'));
            });

            this.socket.on('user-connect', (user) => {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container');
                const message = document.createElement('span');
                message.classList.add('message-content');
                message.textContent = user.username + ' se conectó.';
                messageContainer.append(message);
                this.messages.append(messageContainer);
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('user-disconnect', (user) => {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container');
                const message = document.createElement('span');
                message.classList.add('message-content');
                message.textContent = user.username + ' se desconectó.';
                messageContainer.append(message);
                this.messages.append(messageContainer);
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('chat-message', (message) => {
                this.counter++;
                if (!this.isActive()) {
                    Nav.buttonMessages.setNumber(this.counter);
                } else {
                    this.counter = 0;
                };
    
                this.messages.append(new Message(message));
                this.messages.scrollTop = this.messages.scrollHeight;
            });

            this.socket.on('unauthorized', (res) => {
                Service.Refresh({
                    callback: async () => {
                        if (res.code === 'register') {
                            this.socket.on('connect', () => {
                                this.socket.emit('register', localStorage.getItem('token'));
                            });
                        };

                        if (res.code === 'message') {
                            this.socket.emit('chat-message', {
                                token: localStorage.getItem('token'),
                                content: res.content 
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

    async send () {
        if (!this.input.value) return;

        this.socket.emit('chat-message', {
            token: localStorage.getItem('token'),
            content: this.input.value 
        });

        this.input.set('');
    };

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    };

    reset () {
        this.socket = null;
    };
};