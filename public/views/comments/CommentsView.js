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
        this.creator = new PostCreator({ target_id: this.params.id_post, type: 'reply' });
        this.creator.render(postCreatorContainer);
        this.creator.updateIcon(window.app.member.icon_url);
        this.creator.updateName(window.app.member.name);
        this.creator.onSuccess((post) => {
            const p = this.posts.find(e => e.post.id === this.params.id_post);
            if (p) {
                p.increaseComments();
                p.drawCommentsCount();
            }

            const container = document.getElementById('container-comments-main-comments');
            container.prepend(new Post(post).getElement());
        });
        this.CreateMainComments();
        this.CreateThread();
    }

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

            this.creator.textarea.title.innerText = 'Responder a @'+thread[thread.length - 1].creator.username;
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