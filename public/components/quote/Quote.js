import {URL_NO_IMAGE} from "../../consts.js";
import {formatContent, importCSS} from "../../helpers.js";
import router from "../../router.js";
import MediaContainer from "../media-container/MediaContainer.js";

importCSS('/public/components/quote/quote.css');

export default class Quote {
    constructor (data) {
        this.data = data;

        this.quote = document.createElement('div');
        this.quote.classList.add('quote');

        if (!this.data) {
            this.quote.textContent = 'Publicación eliminada.';
            return;
        }

        this.header = document.createElement('div');
        this.header.classList.add('quote-header');
        this.quote.append(this.header);
        

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

        this.role = document.createElement('span');
        this.role.textContent = this.data.creator.role;
        this.role.classList.add('post-header-signature-top-role', 'role--'+this.data.creator.role);
        this.header.append(this.role);

        this.body = document.createElement('div');
        this.body.classList.add('quote-body');
        this.quote.append(this.body);
        
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
        this.quote.onmousedown = () => {
            this.isSelectingText = false;
        }
        this.quote.onmousemove = () => {
            this.isSelectingText = true;
        }
        this.quote.onmouseup = (e) => {
            // if (e.target.closest('.post-header-icon')) return;
            // if (e.target.closest('.post-header-button')) return;
            // if (e.target.closest('.post-header-signature-top-name')) return;
            // if (e.target.closest('.post-header-button')) return;
            // if (e.target.closest('.post-footer-interaction-container')) return;
            // if (e.target.closest('.post-footer-interaction-container')) return;
            // if (e.target.closest('.link')) return;
            // if (e.target.closest('.media-container')) return;
            if (!this.isSelectingText) return router.navigateTo('/post/'+this.data.id+'/comments');
        }
    }

    render () {
        return this.quote;
    }
}