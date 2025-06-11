import Helper from "../../Helper.js";
import {getTimeElapsedSince, isNotThisYear} from "../../helpers.js";
import PostsManager from "../../modules/PostsManager.js";
import router from "../../router.js";
import {shareService} from "../../services/shareService.js";
import {upvoteService} from "../../services/upvoteService.js";
import Alert from "../alert/alert.js";
import PostCreatorPopup from "../post-creator-popup/PostCreatorPopup.js";

Helper.ImportCSS('/public/components/post/post-footer.css');

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

class PostFooter extends HTMLElement {
    constructor (post, data) {
        super();
        this.post = post;
        this.data = data;
        this.meta = data;

        if (this.data.type === 'shared') {
            this.data = this.data.target_post;
        };

        this.classList.add('post-footer');

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
        this.append(this.dateContainer);

        this.append(this.interactions);

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
    };

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

    increaseRepliesCount () {
        this.data.comments_count = parseInt(this.data.comments_count || 0) + 1;
        this.repliesCount.textContent = this.data.comments_count;
    };

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

customElements.define('post-footer', PostFooter);
export default PostFooter;