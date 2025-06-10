import Alert from "../../components/alert/alert.js";
import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import PostsContainer from "../../components/posts-container/PostsContainer.js";
import Profile from "../../components/profile/Profile.js";
import Spinner from "../../components/spinner/Spinner.js";
import {Scroll} from "../../helpers.js";
import {memberService} from "../../services/memberService.js";
import {postService} from "../../services/postService.js";
import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor () {
        super();
        this.css('/public/views/member/styles/member.css');
        
        this.members = [];
        this.cooldown = true;
        this.fetching = false;
        this.spinner = new Spinner();

        this.view = document.createElement('div');
        this.view.classList.add('member-view');
        
        this.nav = document.createElement('nav');
        this.view.append(this.nav);

        this.main = document.createElement('div');
        this.main.classList.add('member-main');

        this.view.append(this.main);

        this.header = new Header({
            text: ''
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.profile = document.createElement('div');
        this.main.append(this.profile);

        this.posts = document.createElement('div');
        this.main.append(this.posts);

        Scroll({
            element: this.view,
            scroll: (scroll) => {
                this.members[this.i].scroll = scroll;
            },
            bottom: async () => {
                if (this.fetching) return;
                if (!this.members[this.i].fetching) return;
                this.fetching = true;
                this.main.append(this.spinner);
                this.members[this.i].offset += 20;
                let posts;
                try {
                    posts = await postService.get({ 
                        username: this.params.username, 
                        offset: this.members[this.i].offset,
                        replies: false,
                        shared: true
                    });
                    if (posts.length <= 0) this.members[this.i].fetching = false;
                } catch (error) {
                    this.spinner.remove();
                    this.fetching = false;
                    return new Alert(error.message);
                };
                this.members[this.i].posts.renderPosts(posts);
                this.spinner.remove();
                this.fetching = false;
            }
        });
    }
    
    async init (params) {
        this.params = params;
        this.setTitle(this.params.username);
        this.setView(this.view);        
        this.nav.append(Nav);

        this.header.text.textContent = '';
        this.profile.innerHTML = '';
        this.posts.innerHTML = '';

        this.main.append(this.spinner);

        this.i = 0;
        let found = false;
        for (this.i = 0; this.i < this.members.length; this.i++) {
            if (this.members[this.i].username === this.params.username) {
                found = true;
                break;
            }
        }

        if (found) {
            this.spinner.remove();
            
            this.header.text.textContent = this.members[this.i].username;
            this.profile.append(this.members[this.i].profile.render());
            this.posts.append(this.members[this.i].posts.render());
            this.setScroll(this.members[this.i].scroll);

            if (this.members[this.i].cooldown) return;

            let member;
            try {
                member = await memberService.getByUsername({ username: this.params.username });
            } catch (error) {
                return new Alert(error.message);
            }

            this.members[this.i] = {
                ...member,
                cooldown: false,
                offset: this.members[this.i].offset,
                scroll: this.members[this.i].scroll,
                posts: this.members[this.i].posts,
                profile: this.members[this.i].profile
            }

            this.members[this.i].profile.update(member);
            this.members[this.i].cooldown = true;
            const auxIndex = this.i;
            setTimeout(() => {
                this.members[auxIndex].cooldown = false;
            }, 10000);
        } else {
            this.setScroll(0);

            let member;
            try {
                member = await memberService.getByUsername({ username: this.params.username });
            } catch (error) {
                this.spinner.remove();
                return new Alert(error.message);
            }

            const profile = new Profile(member);
            this.profile.append(profile.render());

            member.posts = new PostsContainer();
            member.offset = 0;
            member.scroll = 0;
            member.profile = profile;
            member.fetching = true;
            member.cooldown = false;

            this.members.push(member);
            this.i = this.members.length - 1;
            this.header.text.textContent = this.members[this.i].username;

            let posts;
            try {
                posts = await postService.get({ 
                    username: this.params.username, 
                    offset: this.members[this.i].offset,
                    replies: false,
                    shared: true
                });
                if (posts.length <= 0) this.members[this.i].fetching = false;
            } catch (error) {
                this.spinner.remove();
                return new Alert(error.message);
            }
            this.spinner.remove();
            this.members[this.i].posts.renderPosts(posts);
            this.posts.append(this.members[this.i].posts.render());
            this.members[this.i].fetching = false;
        }
    }

    setScroll (scroll) {
        if (this.members[this.i]) this.members[this.i].scroll = scroll;
        this.view.scrollTop = scroll;
    }
}