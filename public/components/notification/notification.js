import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import PostsManager from "../../modules/PostsManager.js";
import router from "../../router.js";

Helper.ImportCSS('/public/components/notification/notification.css');

class Notification extends HTMLElement {
    constructor (data) {
        super();
        this.data = data;
        this.classList.add('notification');
        if (this.data.status === 'pending') this.classList.add('notification-pending');
        this.isSelectingText = false;

        this.header = document.createElement('div');
        this.header.classList.add('notification-header');

        this.icon = document.createElement('img');
        this.icon.classList.add('notification-icon');
        this.icon.src = this.data.target_member.icon_url || URL_NO_IMAGE;
        this.icon.onclick = (e) => {
            e.stopPropagation();
            router.navigateTo(`/member/${this.data.target_member.username}`);
        };
        this.header.append(this.icon);

        this.text = document.createElement('div');
        this.text.classList.add('notification-text');
        this.header.append(this.text);

        this.name = document.createElement('span');
        this.name.classList.add('notification-name');
        this.name.textContent = this.data.target_member.name;
        this.name.onclick = (e) => {
            e.stopPropagation();
            router.navigateTo(`/member/${this.data.target_member.username}`);
        };
        this.text.append(this.name);

        this.action = document.createElement('span');
        this.action.classList.add('notification-action');
        this.text.append(this.action);

        if (this.data.type === 'quote') {
            this.href = '/post/'+this.data.target_post.id+'/comments';
            this.action.textContent = ' citó tu publicación.';

            this.classList.add('notification-post');

            this.body = document.createElement('div');
            this.body.classList.add('notification-body');
            this.append(this.body);

            this.post = PostsManager.Create(this.data.target_post);
            this.body.append(this.post);
            this.body.onmousemove = () => {
                this.classList.remove('notification-pending');
            }

            // if (this.target_post && this.target_post.spotify && this.target_post.spotify.iframe_url) {
            //     const iframe = document.createElement('iframe');
            //     iframe.src = this.target_post.spotify.iframe_url;
            //     iframe.classList.add('post-creator-iframe');
            //     iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            //     iframe.loading = 'lazy';
            //     iframe.style = 'border-radius: 12px; background-color: var(--border-color);'
            //     iframe.width = '100%';
            //     iframe.height = '152';
            //     iframe.title = this.target_post.spotify.title;
            //     iframe.frameBorder = "0";
            //     this.append(iframe);
            // };
        };

        if (this.data.type === 'reply') {
            this.href = '/post/'+this.data.target_post.id+'/comments';
            this.action.textContent = ' te respondió.';

            this.classList.add('notification-post');

            this.body = document.createElement('div');
            this.body.classList.add('notification-body');
            this.append(this.body);

            this.post = PostsManager.Create(this.data.target_post);
            this.body.append(this.post);
            this.body.onmousemove = () => {
                this.classList.remove('notification-pending');
            }

            // if (this.target_post && this.target_post.spotify && this.target_post.spotify.iframe_url) {
            //     const iframe = document.createElement('iframe');
            //     iframe.src = this.target_post.spotify.iframe_url;
            //     iframe.classList.add('post-creator-iframe');
            //     iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            //     iframe.loading = 'lazy';
            //     iframe.style = 'border-radius: 12px; background-color: var(--border-color);'
            //     iframe.width = '100%';
            //     iframe.height = '152';
            //     iframe.title = this.target_post.spotify.title;
            //     iframe.frameBorder = "0";
            //     this.append(iframe);
            // };
        };

        if (this.data.type === 'upvote') {
            this.append(this.header);
            this.classList.add('notification-border');

            this.href = '/post/'+this.data.target_post.id+'/comments';
            this.action.textContent = ' indicó que le gusta tu publicación.';

            this.body = document.createElement('div');
            this.body.classList.add('notification-body');
            this.append(this.body);

            if (this.data.target_post.content) {
                this.content = document.createElement('span');
                this.content.classList.add('notification-content');
                this.content.append(Helper.Format(this.data.target_post.content));
                this.body.append(this.content);
            };

            if (this.data.target_post.media) {
                this.links = document.createElement('span');
                this.links.classList.add('notification-links');
                this.links.textContent = ' ' + this.data.target_post.media.join(' ');
                this.body.append(this.links); 
            };

            // if (this.target_post && this.target_post.spotify && this.target_post.spotify.iframe_url) {
            //     const iframe = document.createElement('iframe');
            //     iframe.src = this.target_post.spotify.iframe_url;
            //     iframe.classList.add('post-creator-iframe');
            //     iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            //     iframe.loading = 'lazy';
            //     iframe.style = 'border-radius: 12px; background-color: var(--border-color);'
            //     iframe.width = '100%';
            //     iframe.height = '152';
            //     iframe.title = this.target_post.spotify.title;
            //     iframe.frameBorder = "0";
            //     this.append(iframe);
            // };

            this.SelectingText();
        };

        if (this.data.type === 'shared') {
            this.append(this.header);
            this.classList.add('notification-border');

            this.href = '/post/'+this.data.target_post.id+'/comments';
            this.action.textContent = ' compartió tu publicación.';

            this.body = document.createElement('div');
            this.body.classList.add('notification-body');
            this.append(this.body);

            if (this.data.target_post.content) {
                this.content = document.createElement('span');
                this.content.classList.add('notification-content');
                this.content.append(Helper.Format(this.data.target_post.target_post.content));
                this.body.append(this.content);
            };

            if (this.data.target_post.media) {
                this.links = document.createElement('span');
                this.links.classList.add('notification-links');
                this.links.textContent = ' ' + this.data.target_post.media.join(' ');
                this.body.append(this.links); 
            };

            this.SelectingText();
        };

        if (this.data.type === 'follow') {
            this.append(this.header);
            this.classList.add('notification-border');

            this.href = '/member/'+this.data.target_member.username;
            this.action.textContent = ' te siguió.';

            this.SelectingText();
        };
    };

    getID () {
        return this.data.id;
    };

    SelectingText () {
        this.onmousedown = () => {
            this.isSelectingText = false;
        };
        this.onmousemove = () => {
            this.isSelectingText = true;
            this.classList.remove('notification-pending');
        };
        this.onmouseup = (e) => {
            if (e.target.closest('.notification-icon')) return;
            if (e.target.closest('.notification-name')) return;
            if (!this.isSelectingText) return router.navigateTo(this.href);
        };
    };
};

customElements.define("app-notification", Notification);
export default Notification;