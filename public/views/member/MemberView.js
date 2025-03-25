import Alert from "../../components/alert/alert.js";
import PostsContainer from "../../components/posts-container/PostsContainer.js";
import {Scroll} from "../../helpers.js";
import {memberService} from "../../services/memberService.js";
import {postService} from "../../services/postService.js";
import AbstractView from "../AbstractView.js";
import Profile from "./Profile.js";

export default class extends AbstractView {
    constructor () {
        super();
        this.css('/public/views/member/styles/member.css');
        this.members = [];

        this.view = document.createElement('div');
        this.view.classList.add('member-view');
        
        this.main = document.createElement('div');
        this.main.classList.add('member-main');

        this.view.appendChild(this.main);

        this.header = document.createElement('header');
        this.header.classList.add('member-main-header');
        this.header.onclick = () => {
            this.setScroll(0);
        }
        this.main.append(this.header);

        this.title = document.createElement('span');
        this.title.classList.add('member-main-header-title');
        this.title.textContent = '';
        this.header.append(this.title);

        this.main.append(Profile.node());

        this.postsContainer = document.createElement('div');
        this.postsContainer.classList.add('member-main-posts-container');
        this.main.appendChild(this.postsContainer);
    }
    
    async init (params) {
        this.params = params;
        this.setTitle(this.params.username);

        this.clear();
        Profile.clear();
        this.view.appendChild(window.app.nav.getNode());
        this.appContainer.append(this.view);
        this.title.textContent = '';
        this.postsContainer.innerHTML = '';

        this.i = 0;
        let found = false;
        for (this.i = 0; this.i < this.members.length; this.i++) {
            if (this.members[this.i].username === this.params.username) {
                found = true;
                break;
            }
        }

        if (found) {
            Profile.render(this.members[this.i]);
            this.title.textContent = this.members[this.i].username;
            // this.postsContainer.clear();
            // this.postsContainer.renderPosts(this.members[this.i].posts);
            this.postsContainer.appendChild(this.members[this.i].postsContainer.render());
            this.setScroll(this.members[this.i].scroll);
        } else {
            // this.postsContainer.clear();
            this.setScroll(0);

            let member;
            try {
                member = await memberService.getByUsername({ username: this.params.username });
            } catch (error) {
                return new Alert(error.message);
            }
            Profile.render(member);

            member.scroll = 0;
            member.postsContainer = new PostsContainer();
            member.offset = 0;
            this.members.push(member);
            this.i = this.members.length - 1;
            this.title.textContent = this.members[this.i].username;

            let posts;
            try {
                posts = await postService.get({ username: this.params.username, offset: this.members[this.i].offset });
            } catch (error) {
                return new Alert(error.message);
            }
            this.members[this.i].postsContainer.renderPosts(posts);
            this.postsContainer.append(this.members[this.i].postsContainer.render());
            // this.members[this.i].posts = posts;
            // this.postsContainer.renderPosts(this.members[this.i].posts);
            // Profile.banner.style.backgroundPosition = `center calc(50% + 0px)`;
        }

        Scroll({
            element: this.main,
            scroll: (scroll) => {
                this.members[this.i].scroll = scroll;
                // Profile.banner.style.backgroundPosition = `center calc(50% + ${scroll}px)`;
            },
            bottom: async () => {
                this.members[this.i].offset += 20;
                let posts;
                try {
                    posts = await postService.get({ username: this.params.username, offset: this.members[this.i].offset });
                } catch (error) {
                    return new Alert(error.message);
                }
                // this.members[this.i].posts = this.members[this.i].posts.concat(posts);
                this.members[this.i].postsContainer.renderPosts(posts);
            }
        });
    }

    setScroll (scroll) {
        if (this.members[this.i]) this.members[this.i].scroll = scroll;
        this.main.scrollTop = scroll;
    }
}