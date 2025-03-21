import Alert from "../../components/alert/alert.js";
import PostCreator from "../../components/post-creator/PostCreator.js";
import Post from "../../components/post/Post.js";
import { importCSS } from "../../helpers.js";
import EventsHandler from "../../modules/EventsHandler.js";
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

        this.timelineMode = localStorage.getItem('timelime-mode');
        if (!this.timelineMode) {
            localStorage.setItem('timelime-mode', 'global');
            this.timelineMode = 'global';
        }

        this.view = document.createElement('div');
        this.view.classList.add('home-view');

        this.main = document.createElement('main');
        this.main.classList.add('home-main');
        this.view.append(this.main);

        this.timelineButtons = document.createElement('div');
        this.timelineButtons.classList.add('home-main-timeline-buttons');
        this.main.append(this.timelineButtons);

        this.globalButton = document.createElement('button');
        this.globalButton.textContent = 'Global';
        this.globalButton.classList.add('home-main-timeline-button');
        this.globalButton.onclick = () => this.changeTimeline('global');
        this.timelineButtons.append(this.globalButton);

        this.followingButton = document.createElement('button');
        this.followingButton.textContent = 'Siguiendo';
        this.followingButton.classList.add('home-main-timeline-button');
        this.followingButton.onclick = () => this.changeTimeline('following');
        this.timelineButtons.append(this.followingButton);

        this.updateTimelineButtons();

        this.creator = new PostCreator();
        this.creator.render(this.main);

        this.timeline = document.createElement('div');
        this.timeline.classList.add('home-main-timeline');
        this.main.append(this.timeline);

        this.aside = document.createElement('aside');
        this.aside.classList.add('home-aside');
        this.view.append(this.aside);
    }

    changeTimeline (timelineMode) {
        if (this.timelineMode === timelineMode && this.cooldown) return;
        this.activateCooldown();
        this.timelineMode = timelineMode;
        localStorage.setItem('timelime-mode', this.timelineMode);
        this.offset = 0;
        this.setScroll(0);
        this.updateTimelineButtons();
        this.clearTimeline();
        this.loadTimeline();
    }

    updateTimelineButtons () {
        if (this.timelineMode === 'global') {
            this.globalButton.classList.add('home-main-timeline-button--active');
            this.followingButton.classList.remove('home-main-timeline-button--active');
        } else {
            this.followingButton.classList.add('home-main-timeline-button--active');
            this.globalButton.classList.remove('home-main-timeline-button--active');
        }
    }

    async init (params) {
        this.params = params;
        this.setTitle('Inicio');

        this.view.append(window.app.nav.getNode());

        EventsHandler.removeObserver(this);
        EventsHandler.addObserver(this);

        if (window.location.pathname === '/') return router.navigateTo('/home');

        this.creator.updateIcon(window.app.member.icon_url);
        this.creator.updateName(window.app.member.name);

        this.clear();
        this.appContainer.appendChild(this.view);

        if (this.firstTime) {
            this.loadTimeline();
        }

        if (!this.firstTime) {
            this.setScroll(this.scroll);
        }
    }

    setScroll (scroll) {
        this.main.scrollTop = scroll;
    }

    async loadTimeline () {
        const posts = this.timelineMode === 'global' ? 
            await postService.get({ offset: this.offset }) :
            await postService.getFollowing({ offset: this.offset });
        
        this.drawPosts(posts);
        this.eventTimelineScroll();
        this.firstTime = false;

        this.posts = posts;
    }

    drawPosts (posts) {
        for (const post of posts) {
            this.timeline.append(Post.Create(post, { date: 'informal' }));
        }
    }

    eventTimelineScroll () {
        this.main.addEventListener('scroll', async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            this.scroll = this.main.scrollTop;
            const umbral = 1;

            if (this.scroll + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;

                const posts = this.timelineMode === 'global' ? 
                    await postService.get({ offset: this.offset }) :
                    await postService.getFollowing({ offset: this.offset });

                this.drawPosts(posts);
                this.posts = [...this.posts, ...posts];
            }
        });
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

        if (posts.find(post => post.id > this.posts[0].id && !post.id_post_replied)) {
            new Alert('Hay nuevas publicaciones.', {
                error: false,
                timeout: null,
                onClick: () => {
                    if (router.getPathname() != '/home') {
                        router.navigateTo('/home');
                    }

                    this.clearTimeline();
                    this.setScroll(0);
                    this.drawPosts(posts);
                }
            });
        }
    }
}