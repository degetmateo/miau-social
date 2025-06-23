import Helper from "../../Helper.js";
import router from "../../router.js";
import PostBody from "./PostBody.js";
import PostFooter from "./PostFooter.js";
import PostHeader from "./PostHeader.js";

Helper.ImportCSS('/public/components/post/post.css');

class Post extends HTMLElement {
    constructor (data, options = {
        expanded: false,
        onReply: () => {},
        onQuote: () => {},
        onUpvote: () => {},
        date: 'relative'
    }) {
        super();
        this.data = data;
        this.meta = data;
        this.options = options;

        this.classList.add('post');

        this.header = new PostHeader(this, data);
        this.append(this.header);

        this.body = new PostBody(this, data);
        this.append(this.body);

        this.footer = new PostFooter(this, data);
        this.append(this.footer);

        if (this.data.type === 'shared') {
            this.data = this.data.target_post;
        };

        this.isSelectingText = false;
        this.onmousedown = () => {
            this.isSelectingText = false;
        }
        this.onmousemove = () => {
            this.isSelectingText = true;
        }
        this.onmouseup = (e) => {
            if (e.target.closest('.post-shared-container')) return;
            if (e.target.closest('.post-header-icon')) return;
            if (e.target.closest('.post-header-button')) return;
            if (e.target.closest('.post-header-signature-top-name')) return;
            if (e.target.closest('.post-header-button')) return;
            if (e.target.closest('.post-footer-interaction-container')) return;
            if (e.target.closest('.post-footer-interaction-container')) return;
            if (e.target.closest('.quote')) return;
            if (e.target.closest('.link')) return;
            if (e.target.closest('.media-container-image')) return;
            if (!this.isSelectingText) return router.navigateTo('/post/'+this.data.id+'/comments');
        }
    };

    update (data) {
        this.header.update(data);
        this.body.update(data);
        this.footer.update(data);

        if (!data) return;
        this.data = data;
    };
};

customElements.define('app-post', Post);
export default Post;