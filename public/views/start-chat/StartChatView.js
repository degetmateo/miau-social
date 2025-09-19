import Aside from "../../components/aside/Aside.js";
import Header from "../../components/header/Header.js";
import MemberCard from "../../components/member-card/MemberCard.js";
import Nav from "../../components/nav/Nav.js";
import Spinner from "../../components/spinner/Spinner.js";
import Helper from "../../Helper.js";
import {Scroll} from "../../helpers.js";
import Service from "../../modules/Service.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";

Helper.ImportCSS('/public/views/start-chat/start-chat-view.css');

export default class StartChatView extends AbstractView {
    constructor () {
        super();

        this.offset = 0;
        this.query = '';
        this.fetching = false;

        this.view = document.createElement('view');
        this.view.classList.add('start-chat-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('start-chat-main');
        this.view.append(this.main);

        this.header = new Header({ text: 'Comenzar Chat' });
        this.header.addEventListener('click', () => {
            this.setScroll(0);
        });
        this.main.append(this.header);

        this.aside = new Aside();
        this.view.append(this.aside);

        this.form = document.createElement('form');
        this.form.classList.add('start-chat-input-container');
        this.main.append(this.form);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Buscar miembro...';
        this.input.classList.add('start-chat-input');
        this.form.append(this.input);

        this.button = document.createElement('button');
        this.button.classList.add('start-chat-icon-container');
        this.button.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        this.button.type = 'submit';
        this.form.append(this.button);

        this.members = document.createElement('div');
        this.members.classList.add('start-chat-members');
        this.main.append(this.members);

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.offset = 0;
            this.query = this.input.value.trim();
            if (!this.query) return;
            this.members.innerHTML = '';
            this.submit();
        });
        
        Scroll({
            element: this.view,
            bottom: () => {
                this.submit();
            }
        });
    };

    async init () {
        this.setTitle('Comenzar Chat');
        this.setView(this.view);
        this.nav.append(Nav);

        this.members.innerHTML = '';
        this.offset = 0;
        this.query = '';
        this.fetching = true;

        const spinner = new Spinner();
        this.members.append(spinner);

        const data = await Service.Fetch(`/api/follow/random`, {
            method: "GET"
        });

        for (const member of data) {
            this.members.append(new MemberCard(member, {
                bio: false,
                onClick: () => {
                    router.navigateTo(`/chats/member/${member.username}`);
                }
            }));
        };
        
        spinner.remove();
        this.fetching = false;
    };

    async submit () {
        if (this.fetching) return;
        if (!this.query) return;

        this.fetching = true;

        const spinner = new Spinner();
        this.members.append(spinner);
        
        const data = await Service.Fetch(`/api/member/?search=${this.query}&offset=${this.offset}`, {
            method: "GET"
        });

        this.offset = this.offset + data.length;

        for (const member of data) {
            this.members.append(new MemberCard(member, {
                bio: false,
                onClick: () => {
                    router.navigateTo(`/chats/member/${member.username}`);
                }
            }));
        };

        spinner.remove();
        this.fetching = false;
    };
};