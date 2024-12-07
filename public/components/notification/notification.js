import {navigateTo} from "../../router.js";

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
            profile_pic: {
                url: ''
            }
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
        }
        this.container.onmouseup = (e) => {
            if (e.target.closest('.container-notification-comment-pic')) return;
            if (e.target.closest('.notification-comment-signature-name')) return;
            if (!this.isSelectingText) return navigateTo(this.container.getAttribute('href'));
        }
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

    Create () {
       if (this.notification.type === 'comment') this.CreateNotificationComment();
       if (this.notification.type === 'upvote') this.CreateNotificationUpvote();
       if (this.notification.type === 'follow') this.CreateNotificationFollow();
    }

    CreateNotificationComment () {
        this.container.setAttribute('href', '/post/'+this.notification.target_post.id+'/comments');
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.profile_pic.url}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span class="notification-comment-signature-name" href="/member/${this.notification.target_member.username}" data-link>${this.notification.target_member.name}</span> te ha respondido:</span>
            </div>
            ${this.notification.target_post.content.length > 0 ? `<span class="notification-comment-post-content">${this.notification.target_post.content}</span>` : ''}
            ${this.notification.target_post.images.length > 0 ? `<div class="container-post-body-images">${this.images()}</div>` : ''}
        `;
    }

    images () {
        const imagesContainer = document.createElement('div');
        imagesContainer.classList.add('container-post-body-images');
        for (const image of this.notification.target_post.images) {
            try {
                const img = new Image();
                img.src = image;
                img.addEventListener('error', () => imagesContainer.remove());
                img.classList.add('post-body-image');
                imagesContainer.appendChild(img);
            } catch (error) {
                continue;
            }
        }
        return imagesContainer.innerHTML;
    }

    CreateNotificationUpvote () {
        this.container.setAttribute('href', '/post/'+this.notification.target_post.id+'/comments');
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.profile_pic.url}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span class="notification-comment-signature-name" href="/member/${this.notification.target_member.username}" data-link>${this.notification.target_member.name}</span> ha indicado que le gusta tu publicación.</span>
            </div>
            ${this.notification.target_post.content.length > 0 ? `<span class="notification-comment-post-content">${this.notification.target_post.content}</span>` : ''}
            ${this.notification.target_post.images.length > 0 ? `<div class="container-post-body-images">${this.images()}</div>` : ''}
        `;
    }

    CreateNotificationFollow () {
        this.container.setAttribute('href', '/member/'+this.notification.target_member.username);
        this.container.innerHTML = `
            <div class="container-notification-comment-signature">
                <div class="container-notification-comment-pic">
                    <img class="notification-comment-signature-pic" src="${this.notification.target_member.profile_pic.url}" href="/member/${this.notification.target_member.username}" data-link />
                </div>
                <span class="notification-comment-signature-title"><span href="/member/${this.notification.target_member.username}" data-link class="notification-comment-signature-name">${this.notification.target_member.name}</span> te ha seguido.</span>
            </div>
        `;
    }
}