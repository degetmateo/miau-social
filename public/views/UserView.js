import auth from "../auth.js";
import {URL_NO_IMAGE} from "../consts.js";
import {getDateMessage} from "../helpers.js";
import {navigateTo} from "../router.js";
import AbstractView from "./AbstractView.js";
import {CreateNavigation} from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Usuario');

        this.user = {};
        this.posts = {};
    }

    async init () {
        if (!await auth()) {
            navigateTo('/login');
            return;
        }

        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW;
        CreateNavigation();
    
        const resUser = await this.getUser();

        if (!resUser.ok) {
            alert(resUser.error.message);
            return;
        }

        this.user = resUser.user;
        this.drawProfile();

        const resUserPosts = await this.getUserPosts();
        this.posts = resUserPosts.posts;
        this.drawPosts();
    }

    async getUser () {
        const request = await fetch(`/api/user/${this.params.username}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });

        return await request.json();
    }

    async getUserPosts () {
        const request = await fetch(`/api/user/${this.params.username}/posts`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });

        return await request.json();
    }

    drawProfile () {
        const containerName = document.getElementById('container-name');
        containerName.innerHTML = `
            <strong>${this.user.name}</strong>
            <span>@${this.user.username}</span>
        `;

        if (this.user.username != window.app.user.username) {
            const containerButtonFollow = document.getElementById('container-button-follow');
            this.user.isFollowed ?
                containerButtonFollow.appendChild(this.createButtonUnfollow()) :
                containerButtonFollow.appendChild(this.createButtonFollow());
        }

        const containerPfp = document.getElementById('container-pfp');
        containerPfp.innerHTML = `
            <img class="img-profile" src="${this.user.profilePic.url || URL_NO_IMAGE}" />
        `;

        const spanFollowed = document.getElementById('span-followed');
        spanFollowed.textContent = this.user.follows.followed + ' seguidos'

        const spanFollowers = document.getElementById('span-followers');
        spanFollowers.textContent = this.user.follows.followers == 1 ?
            1 + ' seguidor' : 
            this.user.follows.followers + ' seguidores'; 

        document.getElementById('span-bio')
            .innerText = this.user.bio;
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

        this.user.follows.followers = parseInt(this.user.follows.followers) + 1;

        document.getElementById('span-followers').textContent = this.user.follows.followers === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followers + ' seguidores';

        const request = await fetch('/api/user/'+this.user.username+'/follow', {
            method: 'PUT',
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });

        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
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

        this.user.follows.followers = parseInt(this.user.follows.followers) - 1;

        document.getElementById('span-followers').textContent = this.user.follows.followers === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followers + ' seguidores';

        const request = await fetch('/api/user/'+this.user.username+'/unfollow', {
            method: 'DELETE',
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });

        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
    }
    
    drawPosts () {
        const postsContainer = document.getElementById('container-posts');
        postsContainer.innerHTML = '';

        if (!this.posts || this.posts.length <= 0) return;

        for (const post of this.posts.reverse()) {
            post.creator = this.user;
            const containerPost = document.createElement('div');
            containerPost.style = 'padding: 10px 10px 10px 10px; border-bottom: 1px solid gray;';
            containerPost.setAttribute('class', 'post-container');

            const containerSign = document.createElement('div');
            containerSign.style = 'display: flex; align-items: center;';
            containerSign.setAttribute('class', 'container-sign');

            const containerPfp = document.createElement('div');
            containerPfp.setAttribute('class', 'container-pfp'); 
            containerPfp.style = `
                width: 50px;
                height: 50px;
                border: 1px solid #FFF; 
                cursor: pointer;
                overflow: hidden;
            `;
            
            containerPfp.appendChild(createProfileImage(this.user));

            containerSign.appendChild(containerPfp);
            containerPost.appendChild(containerSign);

            const pSign = document.createElement('p');
            const strongSign = document.createElement('strong');
            const aSign = document.createElement('a');
            const spanSign = document.createElement('span');
            
            aSign.setAttribute('href', '/user/'+post.creator.username);
            aSign.setAttribute('data-link', '');
            aSign.textContent = post.creator.name;
            
            strongSign.appendChild(aSign);
            strongSign.style = 'cursor:pointer; margin-left: 10px;';
            
            pSign.appendChild(strongSign);

            spanSign.textContent = ' ▪ '+getDateMessage(post.date);
            pSign.appendChild(spanSign);

            containerSign.appendChild(pSign);

            const pContent = document.createElement('p');
            pContent.style = 'overflow-wrap: break-word;';
            pContent.innerText = post.content;

            containerPost.appendChild(pContent);

            const containerPostInteractions = document.createElement('div');
            containerPostInteractions.style = 'display:flex;';
            containerPostInteractions.innerHTML = `
                <span style="margin: 0 5px 0 0">${0} 💬</span>
                <span style="margin: 0 5px 0 0">${0} ❤️</span>
            `;

            containerPost.appendChild(containerPostInteractions);
            postsContainer.appendChild(containerPost);
        }

        function createProfileImage (user) {
            const img = new Image();
            img.src = user.profilePic.url || URL_NO_IMAGE;
            img.setAttribute('href', '/user/'+user.username);
            img.setAttribute('data-link', '');
            img.addEventListener('load', () => {                
                img.style = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
            });
            return img;
        }
    }
}

const VIEW = `
    <div class="container-profile-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-nav" id="container-nav"></div>
        
        <div class="container-main">
            <div class="container-profile">
                <div class="container-pfp" id="container-pfp">

                </div>
                <div class="container-name-follow">
                    <div class="container-name" id="container-name">

                    </div>
                    <div class="container-button-follow" id="container-button-follow">

                    </div>
                </div>
                <div class="container-bio">
                    <span id="span-bio"></span>
                </div>

                <div class="container-follows">
                    <div class="container-follow">
                        <span id="span-followed">0 seguidos</span>
                    </div>

                    <div class="container-follow">
                        <span id="span-followers">0 seguidores</span>
                    </div>
                </div>
            </div>

            <div class="container-posts" id="container-posts"></div>
        </div>
    </div>
`;