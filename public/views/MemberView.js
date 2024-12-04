import {URL_NO_IMAGE} from "../consts.js";
import {cleanContent} from "../helpers.js";
import AbstractView from "./AbstractView.js";
import Popup from "../components/popup/Popup.js";
import Post from "../components/post/Post.js";
import Alert from "../components/alert/alert.js";
import {navigateTo} from "../router.js";

export default class extends AbstractView {
    constructor (params) {
        super();
        this.params = params;
        this.init(this.params);
    }

    async init (params) {
        this.params = params;
        this.setTitle(this.params.username);
        this.clear();

        this.user = {};
        this.posts = {};

        this.limit = 20;
        this.offset = 0;

        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW;
        document.getElementById('container-view').appendChild(window.app.nav.getNode());
    
        const request = await this.getUser();
        const response = await request.json();

        if (!request.ok) {
            return new Alert(response.error.message);
        }

        this.user = response.data;
        this.user.follows = {
            followedCount: this.user.followed_count,
            followersCount: this.user.followers_count
        }
        this.drawProfile();

        const requestPosts = await this.getUserPosts();
        const responsePosts = await requestPosts.json();

        if (!requestPosts.ok) {
            return new Alert(responsePosts.error.message);
        }

        this.posts = responsePosts.data;
        this.drawPosts(responsePosts.data);
        this.eventTimelineScroll();
    }

    async getUser () {
        const request = await fetch(`/api/member/${this.params.username}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        return request;
    }

    async getUserPosts () {
        const request = await fetch(`/api/post?username=${this.params.username}&offset=${this.offset}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        return request;
    }

    drawProfile () {
        const containerName = document.getElementById('container-name');
        containerName.innerHTML = `
            <strong>${this.user.name}</strong>
            <span>@${this.user.username}</span>
        `;

        if (this.user.username != window.app.member.username) {
            const containerButtonFollow = document.getElementById('container-button-follow');
            this.user.is_followed ?
                containerButtonFollow.appendChild(this.createButtonUnfollow()) :
                containerButtonFollow.appendChild(this.createButtonFollow());
        }

        const containerPfp = document.getElementById('container-pfp');
        containerPfp.innerHTML = `
            <img class="img-profile" src="${this.user.profile_pic.url || URL_NO_IMAGE}" />
        `;
        const follows = this.user.follows;

        const spanFollowed = document.getElementById('span-followed');
        spanFollowed.textContent = this.user.follows.followedCount + ' seguidos'

        const containerFollows = document.getElementById('container-followed');
        containerFollows.style.cursor = 'pointer';
        containerFollows.addEventListener('click', ()=>{
            // const pop = new Popup();
            // for (const user of follows.followed) {
            //     const userContainer = document.createElement('a');
            //     userContainer.setAttribute('data-link', '');
            //     userContainer.setAttribute('href', '/member/'+user.username_member);
            //     userContainer.textContent =  `@${user.username_member}`;
            //     userContainer.classList.add('popup-list-item');
            //     userContainer.onclick = () => pop.delete();
            //     pop.body().appendChild(userContainer);
            // }

            return navigateTo(`/member/${this.user.username}/followed`);
        });

        const spanFollowers = document.getElementById('span-followers');
        spanFollowers.textContent = follows.followersCount === 1 ?
            1 + ' seguidor' : 
            follows.followersCount + ' seguidores'; 

        const containerFollowers= document.getElementById('container-followers');
        containerFollowers.style.cursor = 'pointer';
        containerFollowers.addEventListener('click', ()=>{
            // const pop = new Popup();
            // for (const user of follows.followers) {
            //     const userContainer = document.createElement('a');
            //     userContainer.setAttribute('data-link', '');
            //     userContainer.setAttribute('href', '/member/'+user.username_member);
            //     userContainer.textContent =  `@${user.username_member}`;
            //     userContainer.classList.add('popup-list-item');
            //     userContainer.onclick = () => pop.delete();
            //     pop.body().appendChild(userContainer);
            // }
            return navigateTo(`/member/${this.user.username}/followers`);
        });

        const spanBio = document.getElementById('span-bio');
        spanBio.innerHTML = this.user.bio ? cleanContent(this.user.bio) : '';
    }

    createButtonFollow () {
        const button = document.createElement('button');
        button.setAttribute('class', 'button-follow');
        button.setAttribute('id', 'button-follow');
        button.textContent = 'Seguir';
        button.addEventListener('click', () => this.followUser());
        return button;
    }

    async followUser () {
        document.getElementById('button-follow').remove();
        document.getElementById('container-button-follow').appendChild(this.createButtonUnfollow());

        this.user.follows.followersCount += 1;

        document.getElementById('span-followers').textContent = this.user.follows.followersCount === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followersCount + ' seguidores';

        const request = await fetch('/api/follow/member/'+this.user.id, {
            method: 'POST',
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });

        const response = await request.json();
        if (!request.ok) return new Alert(response.error.message);
    }

    createButtonUnfollow () {
        const button = document.createElement('button');
        button.setAttribute('class', 'button-follow');
        button.setAttribute('id', 'button-unfollow');
        button.textContent = 'Dejar de Seguir';
        button.addEventListener('click', () => this.unFollowUser());
        return button;
    }

    async unFollowUser () {
        document.getElementById('button-unfollow').remove();
        document.getElementById('container-button-follow').appendChild(this.createButtonFollow());

        this.user.follows.followersCount -= 1;

        document.getElementById('span-followers').textContent = this.user.follows.followersCount === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followersCount + ' seguidores';

        const request = await fetch('/api/follow/member/'+this.user.id, {
            method: 'DELETE',
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });

        const response = await request.json();
        if (!request.ok) return new Alert(response.error.message);
    }
    
    drawPosts (posts) {
        const postsContainer = document.getElementById('container-posts');
        for (const post of posts) {
            post.creator = this.user;
            postsContainer.appendChild(Post.Create(post));
        }
    }

    eventTimelineScroll () {
        const mainContainer = document.getElementById('container-main');
        mainContainer.addEventListener('scroll', async () => {
            const scrollHeight = mainContainer.scrollHeight;
            const clientHeight = mainContainer.clientHeight;
            const scrollTop = mainContainer.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const request = await this.getUserPosts();
                const response = await request.json();
                if (!request.ok) return;
                this.drawPosts(response.data);
            }
        });
    }
}

const VIEW = `
    <div class="container-profile-view" id="container-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-main" id="container-main">
            <div class="container-profile">
                <div class="container-pfp" id="container-pfp">

                </div>
                <div class="container-name-follow">
                    <div class="container-name" id="container-name">

                    </div>
                    <div class="container-button-follow" id="container-button-follow">

                    </div>
                </div>
                <div class="container-bio" id="container-bio">
                    <span id="span-bio"></span>
                </div>

                <div class="container-follows">
                    <div class="container-follow" id="container-followed">
                        <span id="span-followed">0 seguidos</span>
                    </div>

                    <div class="container-follow" id="container-followers">
                        <span id="span-followers">0 seguidores</span>
                    </div>
                </div>
            </div>

            <div class="container-posts" id="container-posts"></div>
        </div>
    </div>
`;