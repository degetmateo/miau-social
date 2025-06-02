import {URL_NO_IMAGE} from "../../consts.js";
import {formatContent, getTimeElapsedSince, importCSS, isNotThisYear } from "../../helpers.js";
import PostsManager from "../../modules/PostsManager.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import {shareService} from "../../services/shareService.js";
import {upvoteService} from "../../services/upvoteService.js";
import Alert from "../alert/alert.js";
import MediaContainer from "../media-container/MediaContainer.js";
import Popup from "../popup/Popup.js";
import PostCreatorPopup from "../post-creator-popup/PostCreatorPopup.js";
import Quote from "../quote/Quote.js";

const IMAGE_POST_UPVOTE_ON = new Image();
IMAGE_POST_UPVOTE_ON.src = '/public/components/post/svg/upvote-on.svg';
IMAGE_POST_UPVOTE_ON.classList.add('post-footer-interactions-icon');

const IMAGE_POST_UPVOTE_OFF = new Image();
IMAGE_POST_UPVOTE_OFF.src = '/public/components/post/svg/upvote-off.svg';
IMAGE_POST_UPVOTE_OFF.classList.add('post-footer-interactions-icon');

const IMAGE_POST_SHARE_ON = new Image();
IMAGE_POST_SHARE_ON.src = '/public/components/post/svg/share-on.svg';
IMAGE_POST_SHARE_ON.classList.add('post-footer-interactions-icon');

const IMAGE_POST_SHARE_OFF = new Image();
IMAGE_POST_SHARE_OFF.src = '/public/components/post/svg/share-off.svg';
IMAGE_POST_SHARE_OFF.classList.add('post-footer-interactions-icon');

const IMAGE_POST_SHARE = new Image();
IMAGE_POST_SHARE.src = '/public/components/post/svg/share.svg';
IMAGE_POST_SHARE.classList.add('post-header-shared-icon');

const IMAGE_POST_QUOTE_ON = new Image();
IMAGE_POST_QUOTE_ON.src = '/public/components/post/svg/quote-on.svg';
IMAGE_POST_QUOTE_ON.classList.add('post-footer-interactions-icon');

const IMAGE_POST_QUOTE_OFF = new Image();
IMAGE_POST_QUOTE_OFF.src = '/public/components/post/svg/quote-off.svg';
IMAGE_POST_QUOTE_OFF.classList.add('post-footer-interactions-icon');

const IMAGE_POST_COMMENTS = new Image();
IMAGE_POST_COMMENTS.src = '/public/components/post/svg/comments.svg';
IMAGE_POST_COMMENTS.classList.add('post-footer-interactions-icon');

const BOOKMARK_ON = new Image();
BOOKMARK_ON.src = '/public/components/post/svg/bookmark-on.png';
BOOKMARK_ON.classList.add('post-footer-interactions-icon');

const BOOKMARK_OFF = new Image();
BOOKMARK_OFF.src = '/public/components/post/svg/bookmark-off.png';
BOOKMARK_OFF.classList.add('post-footer-interactions-icon');

importCSS('/public/components/post/post.css');

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
        if (this.data.type === 'shared') this.data = this.data.target_post;
        this.options = options;

        this.post = document.createElement('div');
        this.post.classList.add('post');
        this.append(this.post);

        this.post.get = () => {
            return this;
        }

        // POST HEADER
        this.header = document.createElement('div');
        this.header.classList.add('post-header');
        this.post.append(this.header);

        if (this.meta.type === 'shared') {
            this.sharedContainer = document.createElement('div');
            this.sharedContainer.classList.add('post-shared-container');
            this.sharedContainer.onclick = (e) => {
                e.stopPropagation();
                router.navigateTo('/member/'+this.meta.creator.username);
            };
            this.header.append(this.sharedContainer);

            this.sharedIcon = IMAGE_POST_SHARE.cloneNode(true);
            this.sharedContainer.append(this.sharedIcon);

            this.sharedInfo = document.createElement('span');
            this.sharedInfo.classList.add('post-shared');
            this.sharedInfo.textContent = 'Compartido por '+this.meta.creator.name;
            this.sharedContainer.append(this.sharedInfo);
        };

        this.signContainer = document.createElement('div');
        this.signContainer.classList.add('post-header-sign');
        this.header.append(this.signContainer);

        this.icon = document.createElement('img');
        this.icon.classList.add('post-header-icon');
        this.icon.src = URL_NO_IMAGE;
        this.icon.src = this.data.creator.icon_url || URL_NO_IMAGE;
        this.icon.onerror = () => this.icon.src = URL_NO_IMAGE;
        this.icon.onclick = (e) => this.onIcon(e);
        this.signContainer.append(this.icon);

        this.signature = document.createElement('div');
        this.signature.classList.add('post-header-signature');
        this.signContainer.append(this.signature);

        this.signatureTop = document.createElement('div');
        this.signatureTop.classList.add('post-header-signature-top');
        this.signature.append(this.signatureTop);

        this.signatureTopLeft = document.createElement('div');
        this.signatureTopLeft.classList.add('post-header-signature-top-left');
        this.signatureTop.append(this.signatureTopLeft);

        this.name = document.createElement('span');
        this.name.classList.add('post-header-signature-top-name');
        this.name.textContent = this.data.creator.name;
        this.name.onclick = (e) => this.onName(e);
        this.signatureTopLeft.append(this.name);

        this.roleC = document.createElement('span');
        this.roleC.classList.add('post-header-signature-top-role', 'role--'+this.data.creator.role || 'member');
        this.roleC.textContent = this.data.creator.role;
        this.signatureTopLeft.append(this.roleC);

        if (this.data.creator.id == 158) {
            this.roleC.textContent = 'Golden Witch';
            this.roleC.classList.add('role-golden-witch');
        };

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('post-header-button-container');
        this.signatureTop.append(this.buttonContainer);

        this.button = document.createElement('div');
        this.button.classList.add('post-header-button');
        this.button.onclick = (e) => this.onOptions(e);
        this.buttonContainer.append(this.button);
        
        this.signatureBottom = document.createElement('div');
        this.signatureBottom.classList.add('post-header-signature-bottom');
        this.signature.append(this.signatureBottom);

        this.username = document.createElement('span');
        this.username.classList.add('post-header-signature-bottom-username');
        this.username.textContent = '@' + this.data.creator.username;
        this.signatureBottom.append(this.username);

        for (let i = 1; i <= 3; i++) {
            const p = document.createElement('div');
            p.classList.add('post-header-button-part');
            this.button.append(p);
        }

        // POST BODY
        this.body = document.createElement('div');
        this.body.classList.add('post-body');
        this.post.append(this.body);

        if (this.options.expanded) {
            this.body.classList.add('post-body--expanded');
            this.expandedMargin = document.createElement('div');
            this.expandedMargin.classList.add('post-body-expansion');
            this.body.append(this.expandedMargin);
        }

        if (this.data.content) {
            this.content = document.createElement('div');
            this.content.classList.add('post-body-content');
            this.content.append(formatContent(this.data.content));
            this.body.append(this.content);
        }

        if (this.data.media.length > 0) {
            this.media = document.createElement('div');
            this.media.classList.add('post-body-media');
            const mediaContainer = new MediaContainer({ media: this.data.media, editable: false });
            mediaContainer.render(this.media);
            this.body.append(this.media);
        }

        if (this.data.type === 'quote') {
            this.quote = new Quote(this.data.target_post);
            this.body.append(this.quote);
        }

        // POST FOOTER
        this.footer = document.createElement('div');
        this.footer.classList.add('post-footer');
        this.post.append(this.footer);

        this.interactions = document.createElement('div');
        this.interactions.classList.add('post-footer-interactions');

        this.upvoteContainer = document.createElement('div');
        this.upvoteContainer.classList.add('post-footer-interaction-container');
        this.upvoteContainer.onclick = (e) => this.onUpvote(e);
        this.interactions.append(this.upvoteContainer);

        this.upvoteImage = this.data.is_upvoted ?
            IMAGE_POST_UPVOTE_ON.cloneNode(true) :
            IMAGE_POST_UPVOTE_OFF.cloneNode(true);
        this.upvoteContainer.append(this.upvoteImage);

        this.upvoteCount = document.createElement('span');
        this.upvoteCount.classList.add('post-footer-interaction-count');
        this.upvoteCount.textContent = this.data.upvotes_count || 0;
        this.upvoteContainer.append(this.upvoteCount);

        this.shareContainer = document.createElement('div');
        this.shareContainer.classList.add('post-footer-interaction-container');
        this.shareContainer.onclick = (e) => this.onShare(e);
        this.interactions.append(this.shareContainer);

        this.shareImage = this.data.is_shared ?
            IMAGE_POST_SHARE_ON.cloneNode(true) :
            IMAGE_POST_SHARE_OFF.cloneNode(true);
        this.shareContainer.append(this.shareImage);

        this.shareCount = document.createElement('span');
        this.shareCount.classList.add('post-footer-interaction-count');
        this.shareCount.textContent = this.data.shared_count || 0;
        this.shareContainer.append(this.shareCount);

        this.quoteContainer = document.createElement('div');
        this.quoteContainer.classList.add('post-footer-interaction-container');
        this.quoteContainer.onclick = (e) => this.onQuote(e);
        this.interactions.append(this.quoteContainer);

        this.quoteImage = this.data.is_quoted ?
            IMAGE_POST_QUOTE_ON.cloneNode(true) :
            IMAGE_POST_QUOTE_OFF.cloneNode(true);
        this.quoteContainer.append(this.quoteImage);

        this.quoteCount = document.createElement('span');
        this.quoteCount.classList.add('post-footer-interaction-count');
        this.quoteCount.textContent = this.data.quotes_count || 0;
        this.quoteContainer.append(this.quoteCount);

        this.repliesContainer = document.createElement('div');
        this.repliesContainer.classList.add('post-footer-interaction-container');
        this.repliesContainer.onclick = (e) => this.onReply(e);
        this.interactions.append(this.repliesContainer);

        this.repliesImage = IMAGE_POST_COMMENTS.cloneNode(true);
        this.repliesContainer.append(this.repliesImage);

        this.repliesCount = document.createElement('span');
        this.repliesCount.classList.add('post-footer-interaction-count');
        this.repliesCount.textContent = this.data.comments_count || 0;
        this.repliesContainer.append(this.repliesCount);

        this.bookmark = document.createElement('div');
        this.bookmark.classList.add('post-footer-interaction-container');
        // this.interactions.append(this.bookmark);

        this.bookmarkIcon = this.data.is_bookmarked ?
            BOOKMARK_ON.cloneNode(true) :
            BOOKMARK_OFF.cloneNode(true);
        this.bookmark.append(this.bookmarkIcon);

        this.bookmarkCount = document.createElement('span');
        this.bookmarkCount.classList.add('post-footer-interaction-count');
        this.bookmarkCount.textContent = this.data.bookmarks_count || 0;
        this.bookmark.append(this.bookmarkCount);

        this.dateContainer = document.createElement('div');
        this.dateContainer.classList.add('post-footer-date-container');
        this.footer.append(this.dateContainer);

        this.footer.append(this.interactions);

        this.exactDate = document.createElement('span');
        this.exactDate.classList.add('post-footer-exact-date');

        const date = new Date(this.data.date);
        const dateText = isNotThisYear(date) ?
            date.toLocaleDateString('es-AR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) :
            date.toLocaleDateString('es-AR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            });
        const timeText = date.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        this.exactDate.textContent = `${dateText}, ${timeText}`;
        this.dateContainer.append(this.exactDate);

        this.relativeDate = document.createElement('span');
        this.relativeDate.classList.add('post-footer-relative-date');
        this.relativeDate.textContent = `(${getTimeElapsedSince(new Date(this.data.date))})`;
        this.dateContainer.append(this.relativeDate);

        this.isSelectingText = false;
        this.post.onmousedown = () => {
            this.isSelectingText = false;
        }
        this.post.onmousemove = () => {
            this.isSelectingText = true;
        }
        this.post.onmouseup = (e) => {
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
    }

    onIcon (e) {
        e.stopPropagation();
        router.navigateTo('/member/'+this.data.creator.username);
    }

    onName (e) {
        e.stopPropagation();
        router.navigateTo('/member/'+this.data.creator.username);
    }

    onUpvote (e) {
        e.stopPropagation();
        this.data.is_upvoted ?
            this.downvote() :
            this.upvote();
    }
    
    async upvote () {
        this.data.is_upvoted = true;
        this.setUpvoteIcon('on');
        this.increaseUpvotesCount();
        PostsManager.Update(this.data);

        try {
            upvoteService.upvote({ id: this.data.id });
        } catch (error) {
            new Alert(error.message, { error: true });
            this.setUpvoteIcon('off');
            this.decreaseUpvotesCount();
        }
    }
    
    async downvote () {
        this.data.is_upvoted = false;
        this.setUpvoteIcon('off');
        this.decreaseUpvotesCount();
        PostsManager.Update(this.data);

        try {
            upvoteService.downvote({ id: this.data.id });
        } catch (error) {
            new Alert(error.message, { error: true });
            this.setUpvoteIcon('on');
            this.increaseUpvotesCount();
        }
    }

    increaseUpvotesCount () {
        this.data.upvotes_count = parseInt(this.data.upvotes_count || 0) + 1;
        this.upvoteCount.textContent = this.data.upvotes_count;
    }

    decreaseUpvotesCount () {
        this.data.upvotes_count = parseInt(this.data.upvotes_count || 1) - 1;
        this.upvoteCount.textContent = this.data.upvotes_count;
    }
    
    setUpvoteIcon (icon) {
        this.upvoteImage.remove();

        if (icon === 'on') {
            this.upvoteImage = IMAGE_POST_UPVOTE_ON.cloneNode(true);
        } else {
            this.upvoteImage = IMAGE_POST_UPVOTE_OFF.cloneNode(true);
        }

        this.upvoteContainer.prepend(this.upvoteImage);
    }

    onShare (e) {
        e.preventDefault();
        e.stopPropagation();

        this.data.is_shared ?
            this.unshare() :
            this.share();
    }

    async share () {
        this.data.is_shared = true;
        this.setSharedIcon();
        this.increaseSharesCount();
        PostsManager.Update(this.data);

        try {
            await shareService.share({ id: this.data.id });
        } catch (error) {
            new Alert(error.message, { error: true });
            this.setUnsharedIcon();
            this.decreaseSharesCount();
        };
    }

    async unshare () {
        this.data.is_shared = false;
        this.setUnsharedIcon();
        this.decreaseSharesCount();
        PostsManager.Update(this.data);

        if (this.meta.type == 'shared' && this.meta.creator.id == window.app.member.id) {
            this.remove();
        };

        try {
            await shareService.unshare({ id: this.data.id });
        } catch (error) {
            new Alert(error.message, { error: true });
            this.setSharedIcon();
            this.increaseSharesCount();
        };
    }

    setSharedIcon () {
        this.shareImage.remove();
        this.shareImage = IMAGE_POST_SHARE_ON.cloneNode(true);
        this.shareContainer.prepend(this.shareImage);
    }

    setUnsharedIcon () {
        this.shareImage.remove();
        this.shareImage = IMAGE_POST_SHARE_OFF.cloneNode(true);
        this.shareContainer.prepend(this.shareImage);
    }

    increaseSharesCount () {
        this.data.shared_count = parseInt(this.data.shared_count || 0) + 1;
        this.shareCount.textContent = this.data.shared_count;
    }

    decreaseSharesCount () {
        this.data.shared_count = parseInt(this.data.shared_count || 1) - 1;
        this.shareCount.textContent = this.data.shared_count;
    }

    onQuote (e) {
        e.stopPropagation();

        new PostCreatorPopup({
            alert: '¡Cita enviada!',
            target_post_id: this.data.id,
            title: 'Cita a @'+this.data.creator.username,
            type: 'quote',
            onSuccess: (post) => {
                this.increaseQuotesCount();
                this.setQuoteIcon('on');
                PostsManager.Update(this.data);
                if (this.options.onQuote) this.options.onQuote(post);
            }
        });
    }

    increaseQuotesCount () {
        this.data.quotes_count = parseInt(this.data.quotes_count || 0) + 1;
        this.quoteCount.textContent = this.data.quotes_count;
    }

    setQuoteIcon (icon) {
        this.quoteImage.remove();

        if (icon === 'on') {
            this.quoteImage = IMAGE_POST_QUOTE_ON.cloneNode(true);
        } else {
            this.quoteImage = IMAGE_POST_QUOTE_OFF.cloneNode(true);
        }

        this.quoteContainer.prepend(this.quoteImage);
    }

    onReply (e) {
        e.stopPropagation();
        router.navigateTo('/post/'+this.data.id+'/comments');
    }

    onOptions (e) { 
        e.stopPropagation();

        if (window.app.member.id == this.data.creator.id) {
            const popup = new Popup();
            
            popup.CreateButton("Reportar Publicación", () => {
                popup.delete();
            });
    
            popup.CreateButton("Eliminar Publicación", () => {
                const popupConfirmation = new Popup();
                popupConfirmation.CreateTitle('¿Estás seguro?');
                popupConfirmation.CreateButton('Sí, estoy seguro.', async () => {
                    this.remove();
                    popupConfirmation.delete();
                    popup.delete();

                    try {
                        await postService.remove({ id: this.data.id });
                    } catch (error) {
                        return new Alert(error.message, { error: true });  
                    };

                    return new Alert("Publicación eliminada.", { error: false });
                });
                popupConfirmation.CreateButton('No, no quiero.', () => {
                    popupConfirmation.delete();
                });
            });
        } else {
            const popup = new Popup();
            popup.CreateButton("Reportar Publicación", () => {
                popup.delete();
            });
    
            if (window.app.member.role === 'admin' || window.app.member.role === 'mod') {
                const btn = popup.CreateButton("Eliminar Publicación", async () => {
                    popup.delete();
                    new Alert("Espere...");

                    try {
                        await postService.removeAdmin({ id: this.data.id });
                    } catch (error) {
                        return new Alert(error.message, { error: true });  
                    };

                    this.remove();
                    return new Alert("Publicación eliminada.", { error: false });
                });
    
                btn.innerHTML = `
                    <span class="post-header-signature-top-role role--mod">MOD</span>
                    <span>Eliminar Publicación</span>
                `;
    
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.gap = '10px';
            }
        }
    }

    increaseRepliesCount () {
        this.data.comments_count = parseInt(this.data.comments_count || 0) + 1;
        this.repliesCount.textContent = this.data.comments_count;
    };

    onRemove () {};

    remove () {
        this.post.remove();
        this.onRemove();
    };

    render () {
        return this.post;
    }

    copy () {
        return this.post.cloneNode(true);
    }

    update (data) {
        this.relativeDate.textContent = `(${getTimeElapsedSince(new Date(this.data.date))})`;
        if (!data) return;
        this.data = data;

        this.upvoteCount.textContent = this.data.upvotes_count || 0;
        this.shareCount.textContent = this.data.shared_count || 0;
        this.quoteCount.textContent = this.data.quotes_count || 0;
        this.repliesCount.textContent = this.data.comments_count || 0;

        this.data.is_upvoted ?
            this.setUpvoteIcon('on') :
            this.setUpvoteIcon('off');
        
        this.data.is_shared ?
            this.setSharedIcon() :
            this.setUnsharedIcon();

        this.data.is_quoted ?
            this.setQuoteIcon('on') :
            this.setQuoteIcon('off');
    };
};

customElements.define('app-post', Post);
export default Post;