import {URL_NO_IMAGE} from "../../consts.js";
import { formatContent, importCSS, loadImage } from "../../helpers.js";
import router from "../../router.js";
import MemberRole from "../member-role/MemberRole.js";
importCSS('/public/components/member-card/member-card.css');

class MemberCard extends HTMLElement {
    constructor (data, options) {
        super();
        this.data = data;
        this.options = options;
        this.classList.add('member-card');

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('member-card-icon-container');
        this.append(this.iconContainer);

        this.icon = document.createElement('img');
        this.icon.classList.add('member-card-icon');
        this.icon.src = this.data.icon_url;
        this.iconContainer.append(this.icon);
        this.loadIcon();

        this.infoContainer = document.createElement('div');
        this.infoContainer.classList.add('member-card-info-container');
        this.append(this.infoContainer);

        // this.signatureContainer = document.createElement('div');


        this.nameContainer = document.createElement('div');
        this.nameContainer.classList.add('member-card-name-container');
        this.infoContainer.append(this.nameContainer);

        this.memberName = document.createElement('span');
        this.memberName.classList.add('member-card-name');
        this.memberName.textContent = this.data.name;
        this.nameContainer.append(this.memberName);

        // this.memberRole = new MemberRole({ role: this.data.role, text: this.data.role });
        // this.nameContainer.append(this.memberRole);

        this.usernameContainer = document.createElement('div');
        this.usernameContainer.classList.add('member-card-username-container');
        this.infoContainer.append(this.usernameContainer);

        this.memberUsername = document.createElement('span');
        this.memberUsername.classList.add('member-card-username');
        this.memberUsername.textContent = '@' + this.data.username;
        this.usernameContainer.append(this.memberUsername);

        if (this.options.bio) {
            this.classList.add('member-card-bio');
            this.bioContainer = document.createElement('div');
            this.bioContainer.classList.add('member-card-bio-container');
            this.append(this.bioContainer);

            this.memberBio = formatContent(this.data.bio);
            this.bioContainer.append(this.memberBio);
        };

        this.isSelectingText = false;
        this.onmousedown = () => {
            this.isSelectingText = false;
        };
        this.onmousemove = () => {
            this.isSelectingText = true;
        };
        this.onmouseup = () => {
            if (!this.isSelectingText) return router.navigateTo(`/member/${this.data.username}`);
        };
    };

    async loadIcon () {
        try {
            await loadImage(this.data.icon_url);
        } catch (error) {
            this.icon.src = URL_NO_IMAGE;  
        };
    };
};

customElements.define('member-card', MemberCard);
export default MemberCard;