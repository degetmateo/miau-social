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
    };

    update (data) {
        if (!data) return;
        this.data = data;
    };
};

customElements.define('post-body', PostBody);
export default PostBody;