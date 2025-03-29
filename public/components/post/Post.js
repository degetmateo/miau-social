import {URL_NO_IMAGE} from "../../consts.js";
import {formatContent, getTimeElapsedSince, importCSS} from "../../helpers.js";
import router from "../../router.js";
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

const IMAGE_POST_QUOTE_ON = new Image();
IMAGE_POST_QUOTE_ON.src = '/public/components/post/svg/quote-on.svg';
IMAGE_POST_QUOTE_ON.classList.add('post-footer-interactions-icon');

const IMAGE_POST_QUOTE_OFF = new Image();
IMAGE_POST_QUOTE_OFF.src = '/public/components/post/svg/quote-off.svg';
IMAGE_POST_QUOTE_OFF.classList.add('post-footer-interactions-icon');

const IMAGE_POST_COMMENTS = new Image();
IMAGE_POST_COMMENTS.src = '/public/components/post/svg/comments.svg';
IMAGE_POST_COMMENTS.classList.add('post-footer-interactions-icon');

importCSS('/public/components/post/post.css');

export default class Post {
    constructor (data, options = {
        expanded: false,
        onReply: () => {},
        onQuote: () => {},
        onUpvote: () => {}
    }) {
        this.data = data;
        this.options = options;

        this.post = document.createElement('div');
        this.post.classList.add('post');

        // POST HEADER
        this.header = document.createElement('div');
        this.header.classList.add('post-header');
        this.post.append(this.header);

        this.icon = document.createElement('img');
        this.icon.classList.add('post-header-icon');
        this.icon.src = URL_NO_IMAGE;
        this.icon.src = data.creator.icon_url || URL_NO_IMAGE;
        this.icon.onerror = () => this.icon.src = URL_NO_IMAGE;
        this.icon.onclick = (e) => this.onIcon(e);
        this.header.append(this.icon);

        this.signature = document.createElement('div');
        this.signature.classList.add('post-header-signature');
        this.header.append(this.signature);

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

        this.role = document.createElement('span');
        this.role.classList.add('post-header-signature-top-role', 'role--'+this.data.creator.role || 'member');
        this.role.textContent = this.data.creator.role;
        this.signatureTopLeft.append(this.role);

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
            this.body.append(new Quote(this.data.target_post).render());
        }

        // POST FOOTER
        this.footer = document.createElement('div');
        this.footer.classList.add('post-footer');
        this.post.append(this.footer);

        this.interactions = document.createElement('div');
        this.interactions.classList.add('post-footer-interactions');
        this.footer.append(this.interactions);

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

        this.dateContainer = document.createElement('div');
        this.dateContainer.classList.add('post-footer-date-container');
        this.footer.append(this.dateContainer);

        this.exactDate = document.createElement('span');
        this.exactDate.classList.add('post-footer-exact-date');
        this.exactDate.textContent = new Date(this.data.date).toLocaleString('es-ES');
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
            if (e.target.closest('.post-header-icon')) return;
            if (e.target.closest('.post-header-button')) return;
            if (e.target.closest('.post-header-signature-top-name')) return;
            if (e.target.closest('.post-header-button')) return;
            if (e.target.closest('.post-footer-interaction-container')) return;
            if (e.target.closest('.post-footer-interaction-container')) return;
            if (e.target.closest('.quote')) return;
            if (e.target.closest('.link')) return;
            if (e.target.closest('.media-container')) return;
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
                    const request = await fetch(`/api/post/${this.data.id}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('token')
                        }
                    });
                    const response = await request.json();
                    if (!request.ok) return new Alert(response.error.message);
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
    
            if (window.app.member.role === 'admin') {
                const btn = popup.CreateButton("Eliminar Publicación", async () => {
                    popup.delete();
                    new Alert("Espere...");
                    const request = await fetch(`/api/post/${this.data.id}/admin`, {
                        method: "DELETE",
                        headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
                    });
                    const response = await request.json();
                    if (!request.ok) return new Alert(response.error.message);
                    this.remove();
                    return new Alert("Publicación eliminada correctamente.");
                });
    
                btn.innerHTML = `
                    <span class="post-header-signature-top-role role--admin">ADMIN</span>
                    <span>Eliminar Publicación</span>
                `;
    
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.gap = '10px';
            }
        }
    }

    remove () {
        this.post.remove();
    }

    render () {
        return this.post;
    }
}