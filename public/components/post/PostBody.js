import Helper from "../../Helper.js";
import MediaContainer from "../media-container/MediaContainer.js";
import Quote from "../quote/Quote.js";

Helper.ImportCSS('/public/components/post/post-body.css');

class PostBody extends HTMLElement {
    constructor (post, data) {
        super();
        this.post = post;
        this.data = data;
        this.meta = data;

        if (this.data.type === 'shared') {
            this.data = this.data.target_post;
        };

        this.classList.add('post-body');

        if (this.data.content) {
            this.content = document.createElement('div');
            this.content.classList.add('post-body-content');
            this.content.append(Helper.Format(this.data.content));
            this.append(this.content);
        };

        if (this.data.media.length > 0) {
            this.media = document.createElement('div');
            this.media.classList.add('post-body-media');
            const mediaContainer = new MediaContainer({ media: this.data.media, editable: false });
            mediaContainer.render(this.media);
            this.append(this.media);
        };

        if (this.data.type === 'quote') {
            this.quote = new Quote(this.data.target_post);
            this.append(this.quote);
        };

        if (this.data.spotify && this.data.spotify.iframe_url) {
            const iframe = document.createElement('iframe');
            iframe.src = this.data.spotify.iframe_url;
            iframe.classList.add('post-creator-iframe');
            iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            iframe.loading = 'lazy';
            iframe.style = 'border-radius: 12px; background-color: var(--border-color);'
            iframe.width = '100%';
            iframe.height = '152';
            iframe.title = this.data.spotify.title;
            iframe.frameBorder = "0";
            this.append(iframe);
        };
    };

    update (data) {
        if (!data) return;
        this.data = data;
    };
};

customElements.define('post-body', PostBody);
export default PostBody;