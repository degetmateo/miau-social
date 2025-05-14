import {URL_NO_IMAGE} from "../../consts.js";
import {formatContent, importCSS} from "../../helpers.js";
import router from "../../router.js";
import MediaContainer from "../media-container/MediaContainer.js";

importCSS('/public/components/quote/quote.css');

class Quote extends HTMLElement {
    constructor (data) {
        super();
        this.Build(data);
    };

    Build (data) {
        this.innerHTML = '';
        this.data = data;
        this.classList.add('quote');

        if (!this.data) {
            this.textContent = 'Publicación eliminada.';
            return;
        }

        this.header = document.createElement('div');
        this.header.classList.add('quote-header');
        this.append(this.header);
        
        this.icon = document.createElement('img');
        this.icon.src = this.data.creator.icon_url || URL_NO_IMAGE;
        this.icon.classList.add('quote-icon');
        this.header.append(this.icon);

        this.name = document.createElement('span');
        this.name.textContent = this.data.creator.name;
        this.name.classList.add('quote-name');
        this.header.append(this.name);

        this.username = document.createElement('span');
        this.username.textContent = '@'+this.data.creator.username;
        this.username.classList.add('quote-username');
        this.header.append(this.username);

        this.roleInfo = document.createElement('span');
        this.roleInfo.textContent = this.data.creator.role;
        this.roleInfo.classList.add('post-header-signature-top-role', 'role--'+this.data.creator.role);
        this.header.append(this.roleInfo);

        this.body = document.createElement('div');
        this.body.classList.add('quote-body');

        if ((this.data.content && this.data.content.trim()) || this.data.media.length > 0) this.append(this.body);
        
        if (this.data.media.length > 0) {
            if (this.data.content && this.data.content.length > 100) this.data.content = this.data.content.substring(0, 100) + '...';
            this.media = new MediaContainer({ media: this.data.media, editable: false });
            this.media.container.classList.add('quote-media');
            if (!this.data.content) this.media.container.classList.add('quote-media--alone');
            this.media.render(this.body);
        }

        if (this.data.content) {
            this.content = formatContent(this.data.content);
            this.content.classList.add('quote-content');
            this.body.append(this.content);
        }

        this.isSelectingText = false;
        this.onmousedown = () => {
            this.isSelectingText = false;
        }
        this.onmousemove = () => {
            this.isSelectingText = true;
        }
        this.onmouseup = () => {
            if (!this.isSelectingText) return router.navigateTo('/post/'+this.data.id+'/comments');
        }
    };
};

customElements.define('app-quote', Quote);
export default Quote;