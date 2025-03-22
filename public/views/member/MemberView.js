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
        this.scroll = 0;
        this.member = null;

        this.view = document.createElement('div');
        this.view.classList.add('member-view');
        
        this.main = document.createElement('div');
        this.main.classList.add('member-main');

        this.view.appendChild(this.main);
        this.main.appendChild(Profile.node());

        this.postsContainer = new PostsContainer();
        this.main.appendChild(this.postsContainer.render());
    }
    
    async init (params) {
        this.params = params;
        this.setTitle(this.params.username);

        this.clear();
        this.view.appendChild(window.app.nav.getNode());
        this.appContainer.append(this.view);

        if (this.member && this.member.username === this.params.username) {
            Profile.render(this.member);
            this.setScroll(this.scroll);
        } else {
            Profile.clear();
            this.postsContainer.clear(0);
            this.setScroll(0);
            this.offset = 0;

            try {
                this.member = await memberService.getByUsername({ username: this.params.username });
            } catch (error) {
                return new Alert(error.message);
            }
            Profile.render(this.member);

            let posts;
            try {
                posts = await postService.get({ username: this.params.username, offset: this.offset });
            } catch (error) {
                return new Alert(error.message);
            }
            this.postsContainer.renderPosts(posts);
            Profile.banner.style.backgroundPosition = `center calc(50% + 0px)`;
        }

        this.main.onscroll = async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            this.scroll = this.main.scrollTop;
            const umbral = 1;

            if (this.scroll + clientHeight >= scrollHeight - umbral) {
                this.offset += 20;
                let posts;
                try {
                    posts = await postService.get({ username: this.params.username, offset: this.offset });
                } catch (error) {
                    return new Alert(error.message);
                }
                this.postsContainer.renderPosts(posts);
            }

            Profile.banner.style.backgroundPosition = `center calc(50% + ${this.scroll}px)`;
        }
    }

    setScroll (scroll) {
        this.scroll = scroll;
        this.main.scrollTop = scroll;
    }
}