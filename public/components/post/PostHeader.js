import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import Alert from "../alert/alert.js";
import MemberRole from "../member-role/MemberRole.js";
import Popup from "../popup/Popup.js";

Helper.ImportCSS('/public/components/post/post-header.css');

const IMAGE_POST_SHARE = new Image();
IMAGE_POST_SHARE.src = '/public/components/post/svg/share.svg';
IMAGE_POST_SHARE.classList.add('post-header-shared-icon');

class PostHeader extends HTMLElement {
    constructor (post, data) {
        super();
        this.post = post;
        this.data = data;
        this.meta = data;
        
        this.classList.add('post-header');

        if (this.data.type === 'shared') {
            this.data = this.data.target_post;

            this.sharedContainer = document.createElement('div');
            this.sharedContainer.classList.add('post-shared-container');
            this.sharedContainer.onclick = (e) => {
                e.stopPropagation();
                router.navigateTo('/member/'+this.meta.creator.username);
            };
            this.append(this.sharedContainer);

            this.sharedIcon = IMAGE_POST_SHARE.cloneNode(true);
            this.sharedContainer.append(this.sharedIcon);

            this.sharedInfo = document.createElement('span');
            this.sharedInfo.classList.add('post-shared');
            this.sharedInfo.textContent = 'Compartido por '+this.meta.creator.name;
            this.sharedContainer.append(this.sharedInfo);
        };

        this.signContainer = document.createElement('div');
        this.signContainer.classList.add('post-header-sign');
        this.append(this.signContainer);

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
        
        this.roleC = new MemberRole({ role: this.data.creator.role, text: this.data.creator.role });
        this.signatureTopLeft.append(this.roleC);

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
        };
    };

    onIcon (e) {
        e.stopPropagation();
        router.navigateTo('/member/'+this.data.creator.username);
    };

    onName (e) {
        e.stopPropagation();
        router.navigateTo('/member/'+this.data.creator.username);
    };

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
                    this.post.remove();
                    popupConfirmation.delete();
                    popup.delete();

                    try {
                        await postService.remove({ id: this.data.id });
                    } catch (error) {
                        return new Alert(error.message, { error: true });  
                    };

                    return new Alert("¡Publicación eliminada!", { error: false });
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
                    return new Alert("¡Publicación eliminada!", { error: false });
                });
    
                btn.innerHTML = `
                    <span class="post-header-signature-top-role role--mod">MOD</span>
                    <span>Eliminar Publicación</span>
                `;
    
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.gap = '10px';
            };
        };
    };

    update (data) {
        if (!data) return;
        this.data = data;

        this.name.textContent = this.data.creator.name;
        this.username.textContent = '@' + this.data.creator.username;
        this.icon.src = this.data.creator.icon_url || URL_NO_IMAGE;
    }
};

customElements.define('post-header', PostHeader);
export default PostHeader;