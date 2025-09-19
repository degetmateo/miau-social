import Alert from "../../components/alert/alert.js";
import Aside from "../../components/aside/Aside.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Spinner from "../../components/spinner/Spinner.js";
import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import {Scroll} from "../../helpers.js";
import Service from "../../modules/Service.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/chats-view/chats-view.css');

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

        this.warningContainer = document.createElement('div');
        this.warningContainer.classList.add('chats-warning-container');
        this.main.append(this.warningContainer);

        this.warningBadge = document.createElement('span');
        this.warningBadge.classList.add('chats-warning-badge');
        this.warningBadge.textContent = 'BETA';
        this.warningContainer.append(this.warningBadge);

        this.warningText = document.createElement('span');
        this.warningText.classList.add('chats-warning-text');
        this.warningText.textContent = 'Puede romperse todo.';
        this.warningContainer.append(this.warningText);

        this.startChatButton = document.createElement('div');
        this.startChatButton.classList.add('chats-start-chat-button');
        this.startChatButton.textContent = 'Comenzar Chat';
        this.startChatButton.addEventListener('click', () => {
            router.navigateTo('/chats/start-chat');
        });
        this.main.append(this.startChatButton);

        this.memberChats = document.createElement('div');
        this.memberChats.classList.add('chats-member-chats');
        this.main.append(this.memberChats);

        this.offset = 0;
        this.fetching = false;

        Scroll({
            element: this.view,
            bottom: () => {
                this.fetch_chats();
            }
        });
    };

    init () {    
        this.setTitle("Chats");
        this.setView(this.view);
        this.nav.append(Nav);
        this.offset = 0;
        this.memberChats.innerHTML = '';
    
        this.fetch_chats();
    };

    async fetch_chats () {
        if (this.fetching) return;
        this.fetching = true;

        const spinner = new Spinner();
        this.memberChats.append(spinner);

        try {
            const chats = await Service.Fetch(`/api/chat?offset=${this.offset}`, {
                method: "GET"
            });

            this.offset = this.offset + chats.length;

            for (const chat of chats) {
                const memberChat = document.createElement('div');
                memberChat.classList.add('chats-member-chat');
                const participant = chat.participants.find(p => p.member_id != window.app.member.id);
                
                const iconChat = document.createElement('img');
                iconChat.classList.add('chats-member-chat-icon');
                iconChat.src = participant.member.icon_url;
                iconChat.onerror = () => iconChat.src = URL_NO_IMAGE;
                memberChat.append(iconChat);

                const infoChat = document.createElement('div');
                infoChat.classList.add('chats-member-chat-info');
                memberChat.append(infoChat);

                const nameChat = document.createElement('span');
                nameChat.classList.add('chats-member-chat-username');
                nameChat.textContent = participant.member.name;
                infoChat.append(nameChat);

                const lastMessage = document.createElement('span');
                lastMessage.classList.add('chats-member-chat-last-message');
                lastMessage.textContent = `${chat.messages[0]?.content || ''}`;
                infoChat.append(lastMessage);
                
                memberChat.addEventListener('click', () => {
                    router.navigateTo(`/chats/member/${participant.member.username}`);
                });

                this.memberChats.append(memberChat);
            };  
        } catch (error) {
            console.error(error);
            spinner.remove();
            this.fetching = false;
            return new Alert(error.message, { error: true});
        };

        spinner.remove();
        this.fetching = false;
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