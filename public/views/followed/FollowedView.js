import Alert from "../../components/alert/alert.js";
import {URL_NO_IMAGE} from "../../consts.js";
import {navigateTo} from "../../router.js";
import {followService} from "../../services/followService.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super();
        this.params = params;
        this.init(this.params);
    }

    async init (params) {
        this.params = params;
        this.continue = true;
        this.setTitle('Seguidos - ' + this.params.username);
        this.clear();

        this.view = document.createElement('div');
        this.view.classList.add('view', 'view-followed');

        this.view.appendChild(window.app.nav.getNode());
        
        this.followedContainer = document.createElement('div');
        this.followedContainer.classList.add('container-followed');

        this.view.appendChild(this.followedContainer);
        this.appContainer.appendChild(this.view);

        this.offset = 0;

        const followed = await this.getFollowed();
        this.drawFollowed(followed);
        if (followed.length < 20) {
            this.followedContainer.innerHTML += `
                <div style="padding: 20px; text-align: center;">No hay más que ver acá.</div>
            `;
            this.continue = false;
            return;
        }

        this.followedContainer.addEventListener('scroll', async (e) => {
            const scrollHeight = this.followedContainer.scrollHeight;
            const clientHeight = this.followedContainer.clientHeight;
            const scrollTop = this.followedContainer.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                if (!this.continue) return;
                this.offset += 20;
                const followed = await this.getFollowed();
                if (followed.length <= 0) {
                    this.followedContainer.innerHTML += `
                        <div style="padding: 20px; text-align: center;">No hay más que ver acá.</div>
                    `;
                    this.continue = false;
                    return;
                }
                this.drawFollowed(followed);
            }
        });
    }

    getFollowed = async () => {
        try {
            const followed = await followService.get({ username: this.params.username, offset: this.offset, type: 'followed' });
            return followed;
        } catch (error) {
            new Alert(error.message);
            return [];
        }
    }

    drawFollowed = (members) => {
        for (const member of members) {
            this.followedContainer.appendChild(new Followed(member).getElement());
        }
    }
}

class Followed {
    constructor (member) {
        this.member = member;
        this.container = document.createElement('div');
        this.container.classList.add('followed-container');
        this.container.setAttribute('data-link', '');
        this.container.setAttribute('href', '/member/'+this.member.username);
        this.container.innerHTML = `
            <div class="followed-icon-container">
                <img src="${this.member.profile_pic.url || URL_NO_IMAGE}" class="followed-icon" />
            </div>
            <div class="followed-signature-container">
                <span class="followed-signature-name">${this.member.name}</span>
                <span class="followed-signature-username">@${this.member.username}</span>
            </div>
        `;
    }

    getElement = () => {
        return this.container;
    }
}