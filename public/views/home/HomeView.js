import Alert from "../../components/alert/alert.js";
import Nav from "../../components/nav/Nav.js";
import PostCreator from "../../components/post-creator/PostCreator.js";
import Post from "../../components/post/Post.js";
import Separator from "../../components/separator/Separator.js";
import Spinner from "../../components/spinner/Spinner.js";
import {URL_NO_IMAGE} from "../../consts.js";
import { importCSS, Scroll } from "../../helpers.js";
import EventsHandler from "../../modules/EventsHandler.js";
import PostsHandler from "../../modules/PostsHandler.js";
import router from "../../router.js";
import {postService} from "../../services/postService.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/home/styles/home.css');

export default class extends AbstractView {
    constructor () {
        super();
        this.cooldown = false;
        this.limit = 20;
        this.offset = 0;
        this.observerId = 'home';
        this.firstTime = true;
        this.scroll = 0;
        this.posts = [];
        this.fetching = false;

        this.timelineMode = localStorage.getItem('timelime-mode');
        if (!this.timelineMode) {
            localStorage.setItem('timelime-mode', 'global');
            this.timelineMode = 'global';
        }

        this.view = document.createElement('div');
        this.view.classList.add('home-view');

        this.nav = document.createElement('div');
        this.nav.classList.add('home-nav');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('home-main');
        this.view.append(this.main);

        this.timelineButtons = document.createElement('div');
        this.timelineButtons.classList.add('home-timeline');
        this.main.append(this.timelineButtons);

        this.globalButton = document.createElement('button');
        this.globalButton.textContent = 'Global';
        this.globalButton.classList.add('home-timeline-button');
        this.globalButton.onclick = () => this.changeTimeline('global');
        this.timelineButtons.append(this.globalButton);

        this.followingButton = document.createElement('button');
        this.followingButton.textContent = 'Siguiendo';
        this.followingButton.classList.add('home-timeline-button');
        this.followingButton.onclick = () => this.changeTimeline('following');
        this.timelineButtons.append(this.followingButton);

        this.updateTimelineButtons();

        this.creator = new PostCreator({ title: "¿Qué pensás?", target_id: null, type: 'default' });
        this.creator.render(this.main);

        this.creator.onSuccess((post) => {
            if (this.timelineMode === 'global') {
                this.timeline.prepend(new Separator().render());
                this.timeline.prepend(new Post(post, { expanded: false }).render());
            }
            
            this.posts.unshift(post);
        });

        this.timeline = document.createElement('div');
        this.timeline.classList.add('home-main-timeline');
        this.main.append(this.timeline);

        this.spinner = new Spinner();

        Scroll({
            element: this.view,
            scroll: (scroll) => {
                this.scroll = scroll;
            },
            bottom: async () => {
                if (this.fetching) return;
                this.fetching = true;
                this.offset += this.limit;

                this.timeline.append(this.spinner);
    
                const posts = this.timelineMode === 'global' ? 
                    await postService.get({ offset: this.offset }) :
                    await postService.getFollowing({ offset: this.offset });
    
                this.spinner.remove();

                for (const p of posts) {
                    PostsHandler.add(p);
                }

                this.drawPosts(posts);
                this.posts = [...this.posts, ...posts];
                this.fetching = false;
            }
        });
    }

    async init (params) {
        this.params = params;
        this.setTitle('Inicio');
        this.setView(this.view)
        this.nav.append(Nav);

        EventsHandler.addObserver(this);

        this.creator.updateIcon(window.app.member.icon_url || URL_NO_IMAGE);
        this.creator.updateName(window.app.member.name);

        if (this.firstTime) {
            this.loadTimeline();
        }

        if (!this.firstTime) {
            this.setScroll(this.scroll);
        }
    }

    changeTimeline (timelineMode) {
        this.setScroll(0);
        if (this.timelineMode === timelineMode && this.cooldown) return;
        this.activateCooldown();
        this.timelineMode = timelineMode;
        localStorage.setItem('timelime-mode', this.timelineMode);
        this.updateTimelineButtons();
        this.offset = 0;
        this.posts = [];
        this.clearTimeline();
        this.loadTimeline();
    }

    updateTimelineButtons () {
        if (this.timelineMode === 'global') {
            this.globalButton.classList.add('home-timeline-button-active');
            this.followingButton.classList.remove('home-timeline-button-active');
        } else {
            this.followingButton.classList.add('home-timeline-button-active');
            this.globalButton.classList.remove('home-timeline-button-active');
        }
    }

    setScroll (scroll) {
        this.view.scrollTop = scroll;
    }

    async loadTimeline () {
        this.timeline.append(this.spinner);

        const posts = this.timelineMode === 'global' ? 
            await postService.get({ offset: this.offset }) :
            await postService.getFollowing({ offset: this.offset });
        
        this.spinner.remove();

        for (const p of posts) {
            PostsHandler.add(p);
        }

        this.drawPosts(posts);
        this.firstTime = false;

        this.posts = posts;
    }

    drawPosts (posts) {
        for (const post of posts) {
            this.timeline.append(new Post(post, { expanded: false }).render());
            // this.timeline.append(new Separator().render());
        }
    }

    onVisibilityChange () {
        if (document.visibilityState != 'visible') return;
        if (window.location.pathname != '/home') return;
        if (this.cooldown) return;
        this.activateCooldown();
        this.updateTimeline();
    }

    activateCooldown () {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 30000);
    }

    clearTimeline () {
        this.timeline.innerHTML = '';
    }

    async updateTimeline () {
        const posts = this.timelineMode === 'global' ? 
            await postService.get({ offset: this.offset }) :
            await postService.getFollowing({ offset: this.offset });

        for (const p of posts) {
            PostsHandler.add(p);
        }

        if (posts.find(post => post.id > this.posts[0].id && post.type != 'reply')) {
            new Alert('Hay nuevas publicaciones.', {
                error: false,
                timeout: null,
                onClick: () => {
                    if (router.getPathname() != '/home') {
                        router.navigateTo('/home');
                    }

                    this.setScroll(0);
                    this.clearTimeline();
                    this.drawPosts(posts);
                }
            });

            for (const post of posts) {
                if (this.posts.find(p => p.id === post.id)) continue;
                else this.posts.unshift(post);
            }

            this.posts.sort((a, b) => b.id - a.id);
        }
    }
}