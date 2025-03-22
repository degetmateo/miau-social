import Alert from "../../components/alert/alert.js";
import Navigation from "../../components/navigation/navigation.js";
import Popup from "../../components/popup/Popup.js";
import PostCreator from "../../components/post-creator/PostCreator.js";
import Post from "../../components/post/Post.js";
import {loadImage} from "../../helpers.js";
import AbstractView from "../AbstractView.js";
import {CreateButtonTenor} from "../HomeView.js";

export default class CommentsView extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.setTitle("Respuestas");
        this.clear();

        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view-comments');
        this.viewContainer.style.gridTemplateColumns = `min-content 1fr ${window.app.nav.getNode().innerWidth};`;
        this.appContainer.appendChild(this.viewContainer);
        this.images = new Array();

        this.viewContainer.appendChild(window.app.nav.getNode());
        this.CreateMain();
        this.commentsContainer = document.getElementById('container-comments-main-comments');
    }

    CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('comments-view-main');
        this.main.innerHTML = `
            <div class="container-thread" id="container-thread"></div>
            <div class="container-comments-main-post" id="container-comments-main-post"></div>

            <div class="container-comments-main-form-post-create" id="comments-post-creator-container">

            </div>

            <div class="container-comments-main-comments" id="container-comments-main-comments"></div>
        `;
        this.viewContainer.appendChild(this.main);

        const postCreatorContainer = document.getElementById('comments-post-creator-container');
        const creator = new PostCreator({ id_replied_post: this.params.id_post });
        creator.render(postCreatorContainer);
        creator.updateIcon(window.app.member.icon_url);
        creator.updateName(window.app.member.name);
        creator.onSuccess(() => {
            const p = this.posts.find(e => e.post.id === this.params.id_post);
            if (p) {
                p.increaseComments();
                p.drawCommentsCount();
            }
            this.CreateMainComments();
        });

        // this.CreateMainPost();
        this.CreateMainComments();
        // this.CreateEventPostCreate();
        // this.CreateEventInsertImage();
        this.CreateThread();

        // CreateButtonTenor(document.getElementById('comments-main-form-post-create-button-tenor'), (image) => {
        //     this.images = [];
        //     this.images.push(image);
        // });
    }

    // CreateEventInsertImage () {
    //     const button = document.getElementById('comments-main-form-post-create-button-image');
    //     button.onclick = () => {
    //         const popup = new Popup();
    //         const input = popup.CreateInput('text', 'URL de la Imagen');
    //         popup.CreateButton('Enviar', async () => {
    //             try {
    //                 const value = input.value.trim();
    //                 if (!value || value.length <= 0) {
    //                     return new Alert('Debes ingresar un enlace.');
    //                 }
    //                 const popEspere = new Popup();
    //                 popEspere.CreateTitle('Espere...');
    //                 try {
    //                     await loadImage(value);
    //                     this.images = new Array();
    //                     this.images.push(value);
    //                     new Alert('Imagen guardada con éxito.');
    //                     popEspere.delete();
    //                     popup.delete();
    //                 } catch (error) {
    //                     console.error(error);
    //                     popEspere.delete();
    //                     return new Alert('Esa imagen no está disponible.');
    //                 }
    //             } catch (error) {
    //                 console.error(error);
    //                 return new Alert('Esa imagen no está disponible.');
    //             }
    //         });
    //     }
    // }

    // async CreateEventPostCreate () {
    //     const button = document.getElementById('comments-main-form-post-create-button');
    //     const textarea = document.getElementById('comments-main-form-post-create-textarea');
        
    //     button.onclick = async () => {
    //         try {
    //             const content = textarea.value;     
    //             if ((!content || content.length <= 0) && (!this.images || this.images.length <= 0)) {
    //                 return new Alert("Debes escribir algo o ingresar una imagen.");
    //             }
    //             if (content && content.length <= 0) return new Alert("Debes escribir algo.");
    //             if (content && content.length > 400) return new Alert("La cantidad máxima de carácteres es 400.");
    //             textarea.value = '';
    //             const request = await fetch('/api/post/', {
    //                 method: "POST",
    //                 headers: {
    //                     "Authorization": "Bearer "+localStorage.getItem('token'),
    //                     "Content-Type": "Application/JSON"
    //                 },
    //                 body: JSON.stringify({
    //                     content: content,
    //                     images: this.images,
    //                     id_replied_post: this.params.id_post
    //                 })
    //             });
    //             this.images = new Array();
    //             const response = await request.json();
    //             if (!request.ok) throw new Error(response.error.message);
    //             new Alert("Respuesta enviada.");
    //             this.commentsContainer.innerHTML = '';
    //             this.CreateMainComments();
    //             const p = this.posts.find(e => e.post.id === this.params.id_post);
    //             if (p) {
    //                 p.increaseComments();
    //                 p.drawCommentsCount();
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             return new Alert("Ha ocurrido un error.");
    //         }
    //     }
    // }

    async CreateMainPost () {
        try {
            const request = await fetch('/api/post/'+this.params.id_post, {
                method: "GET",
                headers: { "Authorization": "Bearer "+localStorage.getItem('token') }
            });

            const response = await request.json();
            
            if (!request.ok) return new Alert(response.error.message);

            this.post = new Post(response.data);

            const container = document.getElementById('container-comments-main-post');
            container.appendChild(this.post.getElement());
        } catch (error) {
            console.error(error);
            return new Alert('Ha ocurrido un error.');
        }
    }

    async CreateMainComments () {
        try {
            const request = await fetch('/api/post/'+this.params.id_post+'/comments', {
                method: "GET",
                headers: { "Authorization": "Bearer "+localStorage.getItem('token') }
            });

            const response = await request.json();
            
            if (!request.ok) return new Alert(response.error.message);
            
            const container = document.getElementById('container-comments-main-comments');
            container.innerHTML = '';
            for (const post of response.data) {
                container.appendChild(Post.Create(post));
            }
        } catch (error) {
            console.error(error);
            return new Alert('Ha ocurrido un error.');
        }
    }

    async CreateThread () {
        try {
            const thread = await this.FetchThread();
            const containerThread = document.getElementById('container-thread');
            containerThread.innerHTML = '';

            const scrollPos = this.main.scrollTop;
            const alturaAntes = this.main.scrollHeight;

            this.posts = [];
            for (const post of thread.reverse()) {
                const newPost = new Post(post, {date: 'date'});
                this.posts.push(newPost)
                containerThread.appendChild(newPost.getElement());

                const alturaDespues = this.main.scrollHeight;
                this.main.scrollTop = scrollPos + (alturaDespues - alturaAntes);
            }
        } catch (error) {
            console.error(error);
            new Alert('Ha ocurrido un error.');
        }
    }

    async FetchThread () {
        const request = await fetch(`/api/post/${this.params.id_post}/thread`, {
            method: "GET",
            headers: { "Authorization": "Bearer "+localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) throw new Alert(response.error.message);
        return response.data;
    }
}