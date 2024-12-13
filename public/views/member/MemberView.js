import Alert from "../../components/alert/alert.js";
import PostsContainer from "../../components/posts-container/PostsContainer.js";
import {memberService} from "../../services/memberService.js";
import {postService} from "../../services/postService.js";
import AbstractView from "../AbstractView.js";
import Profile from "./Profile.js";

export default class extends AbstractView {
    constructor () {
        super();
        this.css('/public/views/member/styles/member.css');
        this.offset = 0;
    }

    async init (params) {
        this.params = params;
        this.setTitle(this.params.username);
        this.clear();
        this.view = document.createElement('div');
        this.view.classList.add('member-view');
        
        this.main = document.createElement('div');
        this.main.classList.add('member-main');

        this.view.appendChild(window.app.nav.getNode());
        this.view.appendChild(this.main);

        this.appContainer.appendChild(this.view);
        this.main.appendChild(Profile.node());
        const postsContainer = new PostsContainer();
        this.main.appendChild(postsContainer.render());

        Profile.clear();
        let member;
        try {
            member = await memberService.getByUsername({ username: this.params.username });
        } catch (error) {
            return new Alert(error.message);
        }
        Profile.render(member);

        let posts;
        try {
            posts = await postService.get({ username: this.params.username, offset: this.offset });
        } catch (error) {
            return new Alert(error.message);
        }
        postsContainer.renderPosts(posts);

        this.main.onscroll = async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            const scrollTop = this.main.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += 20;
                try {
                    posts = await postService.get({ username: this.params.username, offset: this.offset });
                } catch (error) {
                    return new Alert(error.message);
                }
                postsContainer.renderPosts(posts);
            }
        }
    }
}