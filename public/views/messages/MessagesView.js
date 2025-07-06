import Alert from "../../components/alert/alert.js";
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

Helper.ImportCSS('/public/views/messages/styles/messages.css');

export default class MessagesView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
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

        this.formCreateChat = new FormCreateChat();
        this.main.append(this.formCreateChat);

        this.chats = document.createElement('div');
        this.chats.classList.add('messages-chats');
        this.main.append(this.chats);

        // this.messages = document.createElement('div');
        // this.messages.classList.add('messages-container');
        // this.main.append(this.messages);

        // this.whoIsWritingContainer = document.createElement('div');
        // this.whoIsWritingContainer.classList.add('messages-writing-container');
        // this.main.append(this.whoIsWritingContainer);

        // this.whoIsWriting = document.createElement('span');
        // this.whoIsWriting.classList.add('messages-writing');

        // this.whoIsWritingUsername = document.createElement('span');
        // this.whoIsWriting.append(this.whoIsWritingUsername);

        // this.whoIsWritingDots = document.createElement('span');
        // this.whoIsWritingDots.classList.add('dots');
        // this.whoIsWriting.append(this.whoIsWritingDots);

        // this.creatorContainer = document.createElement('div');
        // this.creatorContainer.classList.add('messages-creator-container');
        // this.main.append(this.creatorContainer);

        // this.creator = new MessageCreator();
        // this.creator.classList.add('message-creator-border');
        // this.creatorContainer.append(this.creator);

        // window.addEventListener('socket-message', (e) => {
        //     const message = e.detail;
        //     this.counter++;
        //     if (!this.isActive()) {
        //         Nav.buttonMessages.setNumber(this.counter);
        //     } else {
        //         this.counter = 0;
        //     };

        //     this.messages.prepend(new Message(message));
        //     this.messages.scrollTop = this.messages.scrollHeight;
        // });

        // this.writingTimeout = null;
        // window.addEventListener('socket-writing', (e) => {
        //     const data = e.detail;

        //     this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
        //     this.whoIsWritingContainer.append(this.whoIsWriting);
            
        //     if (this.writingTimeout) {
        //         this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
        //         clearTimeout(this.writingTimeout);
        //         this.writingTimeout = null;
        //     };
            
        //     this.writingTimeout = setTimeout(() => {
        //         this.whoIsWriting.remove();
        //         this.writingTimeout = null;
        //     }, 5000);
        // });

        // this.counter = 0;
    };

    init () {    
        this.setTitle("Mensajes");
        this.setView(this.view);
        this.nav.append(Nav);
        // this.messages.scrollTop = this.messages.scrollHeight;
        // this.counter = 0;
        // Nav.buttonMessages.setNumber(this.counter);

        this.chats.innerHTML = '';

        try {
            window.app.socket.emit('socket-chats', { token: localStorage.getItem('token') }, async (response) => {
                if (!response.ok) {
                    if (response.status == 401) {
                        await Service.Refresh({
                            callback: () => {
                                window.app.socket.emit('socket-chats', { 
                                    token: localStorage.getItem('token')
                                }, (res) => {
                                    if (!res.ok) throw new Error(res.error.message);
                                    response = res;
                                });
                            }
                        });
                    } else {
                        throw new Error(response.error.message);
                    }
                };

                console.log(response);
            });
        } catch (error) {
            console.error(error);
            return new Alert(error.message);
        };
    };

    isActive () {
        return router.getPathname().startsWith('/messages');
    }

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    };

    reset () {
        this.socket = null;
        this.messages.innerHTML = '';
    };
};