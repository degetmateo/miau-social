import Alert from "../../components/alert/alert.js";
import Aside from "../../components/aside/Aside.js";
import Header from "../../components/header/Header.js";
import MessageBlock from "../../components/message-block/MessageBlock.js";
import Nav from "../../components/nav/Nav.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import Service from "../../modules/Service.js";
import router from "../../router.js";
import {messageService} from "../../socket-services/messageService.js";
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

        this.messages = document.createElement('div');
        this.messages.classList.add('chat-messages');
        this.main.append(this.messages);

        this.messageCreator = document.createElement('div');
        this.messageCreator.classList.add('chat-message-creator');
        this.main.append(this.messageCreator);

        this.messageInput = document.createElement('div');
        this.messageInput.classList.add('chat-message-input');
        this.messageInput.contentEditable = true;
        this.messageInput.setAttribute('data-placeholder', 'Escribe un mensaje...');
        this.messageInput.addEventListener('blur', () => {
            if (!this.messageInput.innerText.trim()) this.messageInput.innerHTML = '';
        });

        this.messageInput.addEventListener('keydown', (e) => {
            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) return;
            
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submit();
            };
        });
        this.messageCreator.append(this.messageInput);
        
        this.messageSendButton = document.createElement('button');
        this.messageSendButton.classList.add('chat-message-button');
        this.messageSendButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        this.messageSendButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submit();
        });
        this.messageCreator.append(this.messageSendButton);

        this.typing = false;

        this.i = 0;
        this.chats = [];

        this.last_message_member_id = null;

        this.block;

        window.addEventListener('socket-receive-private-message', (e) => {       
            if (e.detail.member_id == window.app.member.id) return;

            if (e.detail.chat_id != this.chats[this.i].chat_id) {
                let j = 0;
                let fj = false;
                for (const chat of this.chats) {
                    if (chat.id == e.detail.chat_id) {
                        fj = true;
                        break;
                    }
                    j++;
                };
    
                if (!fj) return;

                this.chats[j].messages.push(e.detail);
                return;
            };

            this.chats[this.i].messages.push(e.detail);

            const message = e.detail;
            const participant = this.chats[this.i].participants.find(p => p.member_id == message.member_id);

            if (this.last_message_member_id != participant.member_id) {
                this.block = new MessageBlock(participant.member);
                this.block.addMessage(message);
            } else {
                this.block.addMessage(message);
            };

            this.messages.append(this.block);
            this.messages.scrollTop = this.messages.scrollHeight;
        });
    };

    async init (data) {
        this.header.set(data.username);
        this.setTitle(data.username);
        this.setView(this.view);
        this.nav.append(Nav);

        this.messages.innerHTML = '';
        this.last_message_member_id = null;
        this.block = null;

        this.i = 0;
        let found = false;
        for (const chat of this.chats) {
            if (chat.member.username == data.username) {
                found = true;
                break;
            };
            this.i++;
        };

        if (found) {
            const messages = this.chats[this.i].messages;

            for (const message of messages) {
                const participant = this.chats[this.i].participants.find(p => p.member_id == message.member_id);

                if (this.last_message_member_id != participant.member_id) {
                    this.block = new MessageBlock(participant.member);
                    this.block.addMessage(message);
                    this.messages.append(this.block);
                } else {
                    this.block.addMessage(message);
                };

                this.last_message_member_id = participant.member_id;
            };

            this.messages.scrollTop = this.messages.scrollHeight;
        } else {
            if (!data.username) return router.navigateTo('/home');
            if (window.app.member.username == data.username) return router.navigateTo('/home');

            const spinner = new ScreenSpinner();

            try {
                const res = await Service.Fetch('/api/chat/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: data.username
                    })
                });

                res.member = res.participants.find(m => m.member_id != window.app.member.id);
                res.member.username = data.username;
                this.chats.push(res);
                this.i = this.chats.length - 1;

                if (!this.chats[this.i].messages) this.chats[this.i].messages = [];

                for (const message of this.chats[this.i].messages) {
                    const participant = this.chats[this.i].participants.find(p => p.member_id == message.member_id);

                    if (this.last_message_member_id != participant.member_id) {
                        this.block = new MessageBlock(participant.member);
                        this.block.addMessage(message);
                        this.messages.append(this.block);
                    } else {
                        this.block.addMessage(message);
                    };

                    this.last_message_member_id = participant.member_id
                };

                this.messages.scrollTop = this.messages.scrollHeight;
            } catch (error) {
                console.error(error);
                new Alert('Ocurrió un error...', { error: true });
                router.navigateTo('/home');
            };

            spinner.remove();
            this.messages.scrollTop = this.messages.scrollHeight;
        };
    };

    async submit () {
        if (!this.messageInput.innerText) return;
        if (!this.messageInput.innerText.trim()) return;
        if (this.messageInput.innerText.length > 512) return;

        this.typing = false;

        const content = this.messageInput.innerText.trim();
        const participant = this.chats[this.i].participants.find(p => p.member_id == window.app.member.id);

        let message;
        if (this.last_message_member_id != participant.member_id) {
            this.block = new MessageBlock(participant.member);
            message = this.block.addMessage({ content });
            this.messages.append(this.block);
        } else {
            message = this.block.addMessage({ content });
        };

        this.last_message_member_id = participant.member_id;        

        message.setPending();

        this.messages.scrollTop = this.messages.scrollHeight;

        this.messageInput.innerHTML = '';

        const response = await messageService.send({
            content: content,
            chat_id: this.chats[this.i].chat_id,
            receiver_id: this.chats[this.i].member.member_id
        });

        if (!response.ok) {
            message.remove();
        } else {
            message.removePending();
            this.chats[this.i].messages.push(response.data);
        };
    };
};