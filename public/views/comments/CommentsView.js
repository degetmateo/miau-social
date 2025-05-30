import Post from "../../components/post/Post.js";
import SpinnerLoader from "../../components/spinner-loader/SpinnerLoader.js";
import {importCSS, Scroll} from "../../helpers.js";
import {postService} from "../../services/postService.js";
import AbstractView from "../AbstractView.js";
import PostsContainer from "../../components/posts-container/PostsContainer.js";
import PostCreator from "../../components/post-creator/PostCreator.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import PostsManager from "../../modules/PostsManager.js";

importCSS('/public/views/comments/styles/comments.css');

export default class CommentsView extends AbstractView {
    constructor () {
        super();

        this.view = document.createElement('div');
        this.view.classList.add('comments-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('comments-main');
        this.view.append(this.main);

        this.header = new Header({
            text: 'Publicación'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.repliedPosts = document.createElement('div');
        this.repliedPosts.classList.add('comments-replied-posts');
        this.main.append(this.repliedPosts);

        this.mainPost = document.createElement('div');
        this.mainPost.classList.add('comments-main-post');
        this.main.append(this.mainPost);

        this.mainPostContainer = document.createElement('div');
        this.mainPostContainer.classList.add('comments-main-post-container');
        this.mainPost.append(this.mainPostContainer);

        this.replyCreatorContainer = document.createElement('div');
        this.replyCreatorContainer.classList.add('comments-main-reply-creator-container');
        this.mainPost.append(this.replyCreatorContainer);

        this.repliesPosts = document.createElement('div');
        this.repliesPosts.classList.add('comments-replies-posts');
        this.main.append(this.repliesPosts);

        this.posts = [];
        this.cooldown = false;
    }

    async init (params) {
        this.params = params;
        this.setTitle("Respuestas");
        this.setView(this.view);
        this.nav.append(Nav);

        this.i = 0;
        let found = false;
        for (this.i = 0; this.i < this.posts.length; this.i++) {
            if (this.posts[this.i].id === this.params.id_post) {
                found = true;
                break;
            }
        }

        this.repliedPosts.innerHTML = '';
        this.mainPostContainer.innerHTML = '';
        this.replyCreatorContainer.innerHTML = '';
        this.repliesPosts.innerHTML = '';

        if (found) {
            let post = this.posts[this.i];
            this.repliedPosts.append(post.thread.container.render());
            this.repliesPosts.append(post.replies.container.render());
            this.setScroll(post.scroll);
            this.mainPostContainer.append(post.element);
            this.loadReplies();

            if (!this.posts[this.i].cooldown) {
                this.posts[this.i].cooldown = true;
                const updatedPost = await postService.getById({ id: this.params.id_post });
                PostsManager.Update(updatedPost);
                let pIndex = this.i;
                setTimeout(() => {
                    this.posts[pIndex].cooldown = false;
                }, 60000);
            };
        } else {
            const mainLoader = new SpinnerLoader({ size: 'medium' });
            this.mainPostContainer.append(mainLoader.render());
            
            const repliesLoader = new SpinnerLoader({ size: 'medium' });
            this.repliesPosts.append(repliesLoader.render());
    
            const repliedLoader = new SpinnerLoader({ size: 'medium' });
            this.repliedPosts.append(repliedLoader.render());

            let post = PostsManager.FindById(this.params.id_post);

            if (!post) {
                post = await postService.getById({ id: this.params.id_post });
            } else {
                post = post.data;
            };

            const mainPostElement = PostsManager.Create(post);
            this.mainPostContainer.append(mainPostElement);
            
            mainLoader.remove();
    
            const threadContainer = new PostsContainer();

            let thread = [];
            if (post.target_post_id && post.type === 'reply') {
                const px = new Post(post);
                thread = PostsManager.GetThread(px);

                if (thread.length <= 0) {
                    thread = await postService.getThread({ id: this.params.id_post, offset: 0 });
                } else {
                    thread = thread.map(pi => pi.data);
                }

                for (const pt of thread) {
                    threadContainer.prepend(pt);
                }
            }
    
            repliedLoader.remove();
            this.repliedPosts.append(threadContainer.render());
    
            const repliesContainer = new PostsContainer();

            const replies = await postService.getReplies({ id: this.params.id_post, offset: 0 });
            for (const pr of replies) {
                repliesContainer.append(pr);
            }
    
            repliesLoader.remove();
            this.repliesPosts.append(repliesContainer.render());
    
            this.mainPostContainer.scrollIntoView({ block: 'center' });

            this.posts.push({
                ...post,
                id: post.id,
                element: mainPostElement,
                scroll: this.main.scrollTop,
                thread: {
                    container: threadContainer,
                    offset: thread.length
                },
                replies: {
                    container: repliesContainer,
                    offset: replies.length
                }
            });

            this.i = this.posts.length - 1;
        }

        this.creator = new PostCreator({
            alert: '¡Respuesta enviada!',
            target_id: this.posts[this.i].id,
            title: `Responder a @${this.posts[this.i].creator.username}`,
            type: 'reply'
        });

        this.creator.updateName(window.app.member.name);
        this.creator.updateIcon(window.app.member.icon_url);
        
        this.creator.onSuccess((response) => {
            this.posts[this.i].element.increaseRepliesCount();
            this.posts[this.i].comments_count = parseInt(this.posts[this.i].comments_count) + 1;
            PostsManager.Update(this.posts[this.i]);
            this.posts[this.i].replies.offset += 1;
            this.posts[this.i].replies.container.prepend(response);
        });

        this.replyCreatorContainer.append(this.creator);

        Scroll({
            element: this.view,
            top: () => {
                this.loadThread();
            },
            scroll: (s) => {
                if (!this.posts[this.i]) return;
                if (this.posts[this.i].scroll) this.posts[this.i].scroll = s;
            },
            bottom: () => {
                this.loadReplies();
            }
        });
    }

    async loadThread () {
        if (this.cooldown) return;
        this.activateCooldown();
        
        const threadLoader = new SpinnerLoader({ size: 'medium' });
        this.repliedPosts.append(threadLoader.render());

        const thread = await postService.getThread({ id: this.params.id_post, offset: this.posts[this.i].thread.offset });

        threadLoader.remove();

        if (this.posts[this.i]) this.posts[this.i].thread.offset += 10;

        if (thread.length <= 0) {
            this.posts[this.i].thread.offset -= 10;
            return;
        }

        if (thread.length < 10) {
            this.posts[this.i].thread.offset -= (10 - thread.length);
        }

        for (const post of thread) {
            this.posts[this.i].thread.container.prepend(post);
        }
    }

    async loadReplies () {
        if (this.cooldown) return;
        this.activateCooldown();

        const replies = await postService.getReplies({ id: this.params.id_post, offset: this.posts[this.i].replies.offset });

        if (this.posts[this.i]) this.posts[this.i].replies.offset += 10;
        
        if (replies.length <= 0) {
            this.posts[this.i].replies.offset -= 10;
            return;
        }

        if (replies.length < 10) {
            this.posts[this.i].replies.offset -= (10 - replies.length);
        }

        for (const post of replies) {
            this.posts[this.i].replies.container.append(post);
        }
    }

    setScroll (scroll) {
        this.view.scrollTop = scroll;
        if (this.posts[this.i].scroll) this.posts[this.i].scroll = scroll;
    }

    activateCooldown () {
        this.cooldown = true;

        setTimeout(() => {
            this.cooldown = false;
        }, 3000);
    }
}