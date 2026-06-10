import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import { loadImage, shortenLink} from "../../helpers.js";
import router from "../../router.js";
import {followService} from "../../services/followService.js";
import Alert from "../alert/alert.js";
import ImageViewer from "../image-viewer/ImageViewer.js";
import ProfileEditor from "../profile-editor/ProfileEditor.js";

Helper.ImportCSS('/public/components/profile/profile.css');

const IMAGE_LOCATION = new Image();
IMAGE_LOCATION.src = "/public/components/profile/svg/LOCATION.svg";
IMAGE_LOCATION.classList.add('profile-location-icon', 'profile-extra-icon');

const IMAGE_LINK = new Image();
IMAGE_LINK.src = "/public/components/profile/svg/LINK.svg";
IMAGE_LINK.classList.add('profile-link-icon', 'profile-extra-icon');

export default class Profile {
    constructor (member) {
        this.member = member;

        this.container = document.createElement('div');
        this.container.classList.add('profile-container');

        this.topContainer = document.createElement('div');
        this.topContainer.classList.add('profile-top-container');

        this.banner = document.createElement('div');
        this.banner.classList.add('profile-banner');
        this.topContainer.appendChild(this.banner);

        this.banner.style.backgroundImage = this.member.banner.url ? `url(${this.member.banner.url})` : 'none';

        this.topContainer.onclick = () => {
            this.member.banner_url ?
                new ImageViewer({ url: this.member.banner_url }) :
                null;
        }

        this.bottomContainer = document.createElement('div');
        this.bottomContainer.classList.add('profile-bottom-container');

        this.container.appendChild(this.topContainer);
        this.container.appendChild(this.bottomContainer);

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('profile-icon-container');
        this.bottomContainer.appendChild(this.iconContainer);

        this.icon = document.createElement('img');
        this.icon.classList.add('profile-icon');
        this.iconContainer.appendChild(this.icon);

        this.icon.src = this.member.icon.url ?
            this.member.icon.url : 
            URL_NO_IMAGE;

        this.icon.onclick = () => {
            this.member.icon.url ?
                new ImageViewer({ url: this.member.icon.url }) :
                null;
        }

        this.signatureContainer = document.createElement('div');
        this.signatureContainer.classList.add('profile-signature-container');
        this.bottomContainer.appendChild(this.signatureContainer);

        this.name = document.createElement('span');
        this.name.classList.add('profile-name');
        this.name.textContent = this.member.name;
        this.signatureContainer.appendChild(this.name);

        this.signatureBottomContainer = document.createElement('div');
        this.signatureBottomContainer.classList.add('profile-signature-bottom-container');
        this.signatureContainer.appendChild(this.signatureBottomContainer);

        this.username = document.createElement('span');
        this.username.classList.add('profile-username');
        this.username.textContent = '@' + member.username;
        this.signatureBottomContainer.appendChild(this.username);

        if (this.member.is_follower && !this.signatureFollowerLabel) {
            this.signatureFollowerLabel = document.createElement('span');
            this.signatureFollowerLabel.classList.add('profile-signature-follower-label');
            this.signatureFollowerLabel.textContent = 'Te sigue';
            this.signatureBottomContainer.append(this.signatureFollowerLabel);
        }

        this.button = document.createElement('button');
        this.button.classList.add('profile-button');

        if (window.app.member.id === this.member.id) {
            this.button.textContent = 'Editar perfil';
            this.button.classList.remove('profile-button--other');
            this.button.classList.add('profile-button--self');
            this.button.onclick = () => {
                new ProfileEditor(this.member, this);
            }
        } else {
            this.button.classList.remove('profile-button--self');
            this.button.classList.add('profile-button--other');

            if (this.member.is_followed) {
                this.button.textContent = 'Dejar de seguir';
                this.button.onclick = this.unfollow;
            } else {
                this.button.textContent = 'Seguir';
                this.button.onclick = this.follow;
            }
        }

        this.bottomContainer.append(this.button);

        this.bio = document.createElement('span');
        this.bio.classList.add('profile-bio');
        this.bio.innerText = this.member.bio;
        this.bottomContainer.appendChild(this.bio);

        this.extraInfoContainer = document.createElement('div');
        this.extraInfoContainer.classList.add('profile-extra-container');
        this.bottomContainer.appendChild(this.extraInfoContainer);

        this.locationContainer = document.createElement('div');
        this.locationContainer.classList.add('profile-location-container');
        this.extraInfoContainer.appendChild(this.locationContainer);

        this.locationIcon = IMAGE_LOCATION.cloneNode(true);
        this.locationContainer.appendChild(this.locationIcon);

        this.locationInfo = document.createElement('span');
        this.locationInfo.classList.add('profile-location-info');
        this.locationInfo.textContent = this.member.location;
        this.locationContainer.appendChild(this.locationInfo);

        if (!this.member.location) this.locationContainer.style.display = 'none';
        else this.locationContainer.style.display = 'flex';

        this.urlContainer = document.createElement('div');
        this.urlContainer.classList.add('profile-url-container');
        this.extraInfoContainer.appendChild(this.urlContainer);

        this.urlIcon = IMAGE_LINK.cloneNode(true);
        this.urlContainer.append(this.urlIcon);

        this.urlInfo = document.createElement('a');
        this.urlInfo.target = '_blank';
        this.urlInfo.classList.add('profile-url-info');
        this.urlInfo.textContent = shortenLink(this.member.link);
        this.urlContainer.appendChild(this.urlInfo);

        if (!this.member.link) this.urlContainer.style.display = 'none';
        else this.urlContainer.style.display = 'flex';

        if (this.member.link) {
            const url = this.member.link.startsWith('http') ? new URL(this.member.link) : new URL('http://' + this.member.link);
            this.urlInfo.href = url.href;
        }

        this.followContainer = document.createElement('div');
        this.followContainer.classList.add('profile-follow-container');
        this.bottomContainer.appendChild(this.followContainer);

        this.followedContainer = document.createElement('div');
        this.followedContainer.classList.add('profile-followed-container');
        this.followContainer.appendChild(this.followedContainer);

        this.followedNumber = document.createElement('span');
        this.followedNumber.classList.add('profile-followed-number');
        this.followedNumber.textContent = '0';
        this.followedContainer.appendChild(this.followedNumber);

        this.followedText = document.createElement('span');
        this.followedText.classList.add('profile-followed-text');
        this.followedText.textContent = 'seguidos';
        this.followedContainer.appendChild(this.followedText);

        this.followersContainer = document.createElement('div');
        this.followersContainer.classList.add('profile-followers-container');
        this.followContainer.appendChild(this.followersContainer);

        this.followersNumber = document.createElement('span');
        this.followersNumber.classList.add('profile-followers-number');
        this.followersNumber.textContent = '0';
        this.followersContainer.appendChild(this.followersNumber);

        this.followersText = document.createElement('span');
        this.followersText.classList.add('profile-followers-text');
        this.followersText.textContent = 'seguidores';
        this.followersContainer.appendChild(this.followersText);

        this.followedNumber.textContent = this.member.followed_count;
        this.followersNumber.textContent = this.member.follower_count;
        this.banner.style.backgroundImage = this.member.banner.url ? `url(${this.member.banner.url})` : 'none';

        this.followedContainer.onclick = () => {
            router.navigateTo(`/member/${this.member.username}/followed`);
        }

        this.followersContainer.onclick = () => {
            router.navigateTo(`/member/${this.member.username}/followers`);
        }

        loadImage(this.member.icon.url)
            .catch(() => {
                this.icon.src = URL_NO_IMAGE;
            });
    }

    update (member) {
        this.member = member;
        this.setIcon(member.icon.url);
        this.setBanner(member.banner.url);
        this.setName(member.name);
        this.setUsername(member.username);
        this.setLocation(member.location);
        this.setLink(member.link);
        this.setFollowed(member.followed_count);
        this.setFollowers(member.follower_count);
    }

    setIcon (url) {
        this.icon.src = url || URL_NO_IMAGE;

        this.icon.onclick = () => {
            url ? new ImageViewer({ url }) : null;
        }
    }

    setBanner (url) {
        this.banner.style.backgroundImage = url ? `url(${url})` : 'none';

        this.topContainer.onclick = () => {
            url ? new ImageViewer({ url }) : null;
        }
    }

    setName (name) {
        this.name.textContent = name;
    }

    setUsername (username) {
        this.username.textContent = '@' + username;
    }

    setBio (bio) {
        this.bio.innerText = bio;
    }

    setLocation (location) {
        if (location) {
            this.locationInfo.textContent = location;
            this.locationContainer.style.display = 'flex';
        } else {
            this.locationContainer.style.display = 'none';
        }
    }

    setLink (link) {
        if (link) {
            this.urlInfo.textContent = shortenLink(link);
            this.urlContainer.style.display = 'flex';
        } else {
            this.urlContainer.style.display = 'none';
        }
    }

    setFollowed (followed) {
        this.followedNumber.textContent = followed;
    }
     
    setFollowers (followers) {
        this.followersNumber.textContent = followers;
    }

    render () {
        return this.container;
    }

    follow = async () => {
        this.button.textContent = 'Dejar de seguir';
        this.followersNumber.textContent = parseInt(this.followersNumber.textContent) + 1;
        try {
            await followService.follow({ id: this.member.id });
        } catch (error) {
            return new Alert(error.message);
        }
        this.button.onclick = this.unfollow;
    }

    unfollow = async () => {
        this.button.textContent = 'Seguir';
        this.followersNumber.textContent = parseInt(this.followersNumber.textContent) - 1;
        try {
            await followService.unfollow({ id: this.member.id });
        } catch (error) {
            return new Alert(error.message);
        }
        this.button.onclick = this.follow;
    }
}