import Alert from "../../components/alert/alert.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import {URL_NO_IMAGE} from "../../consts.js";
import {importCSS, Scroll} from "../../helpers.js";
import router from "../../router.js";
import {followService} from "../../services/followService.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/followers/followers.css');

export default class extends AbstractView {
    constructor () {
        super();
        this.fetching = false;

        this.view = document.createElement('div');
        this.view.classList.add('view', 'view-followed');
        
        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('followers-main');
        this.view.append(this.main);
    
        this.header = new Header({
            text: ''
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.content = document.createElement('div');
        this.content.classList.add('followers-main-content');
        this.main.append(this.content);

        this.members = [];

        Scroll({
            element: this.view,
            scroll: (s) => {
                this.members[this.i].scroll = s;
            },
            bottom: async () => {
                if (this.fetching) return;
                this.fetching = true;
                this.members[this.i].offset += 20;
                
                let followers = [];
                try {
                    followers = await followService.get({
                        username: this.members[this.i].username, 
                        offset: this.members[this.i].offset, 
                        type: 'followed' 
                    });
                } catch (error) {
                    new Alert(error.message, { error: true });
                    followers = [];
                }

                this.members[this.i].followsContainer.draw(followers);
                this.fetching = false;
            }
        });
    }

    async init (params) {
        this.params = params;
        this.setTitle('Seguidos - ' + this.params.username);
        this.setView(this.view);
        this.nav.append(Nav);

        this.header.set(this.params.username);
        this.content.innerHTML = '';
        

        this.i = 0;
        let found = false;
        for (this.i = 0; this.i < this.members.length; this.i++) {
            if (this.members[this.i].username === this.params.username) {
                found = true;
                break;
            }
        }

        if (found) {
            this.content.append(this.members[this.i].followsContainer.render());
            this.setScroll(this.members[this.i].scroll);
        } else {
            this.setScroll(0);

            let followers = [];
            try {
                followers = await followService.get({ username: this.params.username, offset: this.offset, type: 'followed' });
            } catch (error) {
                new Alert(error.message, { error: true });
                return;
            }

            let member = {
                username: this.params.username,
                followsContainer: new FollowsContainer(),
                offset: 0,
                scroll: 0
            };

            member.followsContainer.draw(followers);
            this.members.push(member);
            this.i = this.members.length - 1;
            this.content.append(member.followsContainer.render());
        }
    }

    setScroll (scroll) {
        if (this.members[this.i]) this.members[this.i].scroll = scroll;
        this.view.scrollTop = scroll;
    }
}

class FollowsContainer {
    constructor () {
        this.container = document.createElement('div');
        this.container.classList.add('follows-container');
    }

    draw (follows) {
        for (const follow of follows) {
            this.container.append(new Follower(follow).render());
        }
    }

    clear () {
        this.container.innerHTML = '';
    }

    render () {
        return this.container;
    }
}

class Follower {
    constructor (member) {
        this.member = member;
        this.container = document.createElement('div');
        this.container.classList.add('followed-container');
        this.container.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            router.navigateTo(`/member/${this.member.username}`);
        };
        this.container.innerHTML = `
            <div class="followed-icon-container">
                <img src="${this.member.icon_url || URL_NO_IMAGE}" class="followed-icon" />
            </div>
            <div class="followed-signature-container">
                <span class="followed-signature-name">${this.member.name}</span>
                <span class="followed-signature-username">@${this.member.username}</span>
            </div>
        `;
    }

    render () {
        return this.container;
    }
}