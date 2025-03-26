import {URL_NO_IMAGE} from "../../consts.js";
import router from "../../router.js";
import ImagesContainer from "../images-container/ImagesContainer.js";
import MediaContainer from "../media-container/MediaContainer.js";

export default class Notification {
    notification = {
        id: '',
        date: '',
        type: '',
        target_member: {
            id: '',
            name: '',
            username: '',
            role: '',
            icon_url: ''
        },
        target_post: {
            id: '',
            id_post_replied: '',
            content: '',
            date: '',
            images: []
        }
    }

    constructor (_notification) {
        this.notification = _notification;
        this.container = document.createElement('div');
        this.container.classList.add('container-notification', 'container-notification--'+this.notification.type);
        this.Create();

        this.isSelectingText = false;
        this.container.onmousedown = () => {
            this.isSelectingText = false;
        }
        this.container.onmousemove = () => {
            this.isSelectingText = true;
            this.setRead();
        }
        this.container.onmouseup = (e) => {
            if (e.target.closest('.container-notification-comment-pic')) return;
            if (e.target.closest('.notification-comment-signature-name')) return;
            if (!this.isSelectingText) return router.navigateTo(this.container.getAttribute('href'));
        }

        if (this.notification.status === 'pending') this.setUnread();
        else this.setRead();
    }

    getID () {
        return this.notification.id;
    }

    getElement () {
        return this.container;
    }

    remove () {
        this.container.remove();
    }

    setUnread () {
        this.container.classList.add('notification-container--unread');
    }

    setRead () {
        this.container.classList.remove('notification-container--unread');
    }

    Create () {
       if (this.notification.type === 'reply') this.CreateNotificationComment();
       if (this.notification.type === 'upvote') this.CreateNotificationUpvote();
       if (this.notification.type === 'follow') this.CreateNotificationFollow();
    }

    CreateNotificationComment () {
        this.container.setAttribute('href', '/post/'+this.notification.target_post.id+'/comments');
        if (!this.notification.target_post.content) this.notification.target_post.content = '';
        if (!this.notification.target_post.images) this.notification.target_post.images = [];
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.icon_url || URL_NO_IMAGE}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span class="notification-comment-signature-name" href="/member/${this.notification.target_member.username}" data-link>${this.notification.target_member.name}</span> te ha respondido:</span>
            </div>
            ${this.notification.target_post.content.length > 0 ? `<span class="notification-comment-post-content">${this.notification.target_post.content}</span>` : ''}
            ${this.notification.target_post.media.length > 0 ? `${this.images()}` : ''}
        `;
    }

    images () {
        const mediaContainer = new MediaContainer({ media: this.notification.target_post.media, editable: false });
        return mediaContainer.container.outerHTML;
    }

    CreateNotificationUpvote () {
        this.container.setAttribute('href', '/post/'+this.notification.target_post.id+'/comments');
        if (!this.notification.target_post.content) this.notification.target_post.content = '';
        if (!this.notification.target_post.images) this.notification.target_post.images = [];
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.icon_url || URL_NO_IMAGE}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span class="notification-comment-signature-name" href="/member/${this.notification.target_member.username}" data-link>${this.notification.target_member.name}</span> ha indicado que le gusta tu publicación.</span>
            </div>
            ${this.notification.target_post.content.length > 0 ? `<span class="notification-comment-post-content">${this.notification.target_post.content}</span>` : ''}
            ${this.notification.target_post.media.length > 0 ? `${this.images()}` : ''}
        `;
    }

    CreateNotificationFollow () {
        this.container.setAttribute('href', '/member/'+this.notification.target_member.username);
        if (!this.notification.target_post.content) this.notification.target_post.content = '';
        if (!this.notification.target_post.images) this.notification.target_post.images = [];
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.icon_url || URL_NO_IMAGE}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span href="/member/${this.notification.target_member.username}" data-link class="notification-comment-signature-name">${this.notification.target_member.name}</span> te ha seguido.</span>
            </div>
        `;
    }
}