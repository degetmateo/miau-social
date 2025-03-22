import Alert from "../../components/alert/alert.js";
import Component from "../../components/Component.js";
import ImageViewer from "../../components/image-viewer/ImageViewer.js";
import ProfileEditor from "../../components/profile-editor/ProfileEditor.js";
import {URL_NO_IMAGE} from "../../consts.js";
import {shortenLink} from "../../helpers.js";
import router from "../../router.js";
import {followService} from "../../services/followService.js";

const IMAGE_LOCATION = new Image();
IMAGE_LOCATION.src = "/public/views/member/svg/LOCATION.svg";
IMAGE_LOCATION.classList.add('profile-location-icon', 'profile-extra-icon');

const IMAGE_LINK = new Image();
IMAGE_LINK.src = "/public/views/member/svg/LINK.svg";
IMAGE_LINK.classList.add('profile-link-icon', 'profile-extra-icon');

class Profile extends Component {
    constructor () {
        super();
        this.css('/public/views/member/styles/profile.css');
        this.container = document.createElement('div');
        this.container.classList.add('profile-container');

        this.topContainer = document.createElement('div');
        this.topContainer.classList.add('profile-top-container');

        this.banner = document.createElement('div');
        this.banner.classList.add('profile-banner');

        this.topContainer.appendChild(this.banner);

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

        this.icon.onclick = () => {
            this.member.icon_url ?
                new ImageViewer({ url: this.member.icon_url }) :
                null;
        }

        this.signatureContainer = document.createElement('div');
        this.signatureContainer.classList.add('profile-signature-container');
        this.bottomContainer.appendChild(this.signatureContainer);

        this.name = document.createElement('span');
        this.name.classList.add('profile-name');
        this.signatureContainer.appendChild(this.name);

        this.signatureBottomContainer = document.createElement('div');
        this.signatureBottomContainer.classList.add('profile-signature-bottom-container');
        this.signatureContainer.appendChild(this.signatureBottomContainer);

        this.username = document.createElement('span');
        this.username.classList.add('profile-username');
        this.signatureBottomContainer.appendChild(this.username);

        this.button = document.createElement('button');
        this.button.classList.add('profile-button');

        this.bio = document.createElement('span');
        this.bio.classList.add('profile-bio');
        this.bottomContainer.appendChild(this.bio);

        this.extraInfoContainer = document.createElement('div');
        this.extraInfoContainer.classList.add('profile-extra-container');
        this.bottomContainer.appendChild(this.extraInfoContainer);

        this.locationContainer = document.createElement('div');
        this.locationContainer.classList.add('profile-location-container');
        this.extraInfoContainer.appendChild(this.locationContainer);

        this.locationIcon = IMAGE_LOCATION;
        this.locationContainer.appendChild(this.locationIcon);

        this.locationInfo = document.createElement('span');
        this.locationInfo.classList.add('profile-location-info');
        this.locationContainer.appendChild(this.locationInfo);

        this.urlContainer = document.createElement('div');
        this.urlContainer.classList.add('profile-url-container');
        this.extraInfoContainer.appendChild(this.urlContainer);

        this.urlIcon = IMAGE_LINK;
        this.urlContainer.appendChild(this.urlIcon);

        this.urlInfo = document.createElement('a');
        this.urlInfo.target = '_blank';
        this.urlInfo.classList.add('profile-url-info');
        this.urlContainer.appendChild(this.urlInfo);

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
    }

    node = () => {
        return this.container;
    }

    clear = () => {
        this.name.textContent = '';
        this.username.textContent = '';
        this.icon.src = URL_NO_IMAGE;
        this.bio.innerText = '';
        this.locationContainer.style.display = 'none';
        this.urlContainer.style.display = 'none';
        this.followedNumber.textContent = 0;
        this.followersNumber.textContent = 0;
        this.banner.style.backgroundImage = 'none';
        this.button.remove();
        if (this.signatureFollowerLabel) {
            this.signatureFollowerLabel.remove();
            this.signatureFollowerLabel = null;
        }
    }

    render = (member) => {
        this.member = member;
        this.name.textContent = member.name;
        this.username.textContent = '@' + member.username;

        if (this.member.is_follower && !this.signatureFollowerLabel) {
            this.signatureFollowerLabel = document.createElement('span');
            this.signatureFollowerLabel.classList.add('profile-signature-follower-label');
            this.signatureFollowerLabel.textContent = 'Te sigue';
            this.signatureBottomContainer.append(this.signatureFollowerLabel);
        }

        this.icon.src = this.member.icon_url ?
            this.member.icon_url : 
            URL_NO_IMAGE;

        this.bio.innerText = member.bio;
        if (!member.location) this.locationContainer.style.display = 'none';
        else this.locationContainer.style.display = 'flex';
        if (!member.link) this.urlContainer.style.display = 'none';
        else this.urlContainer.style.display = 'flex';
        this.locationInfo.textContent = member.location;
        this.urlInfo.textContent = shortenLink(member.link);
        
        if (member.link) {
            const url = member.link.startsWith('http') ? new URL(member.link) : new URL('http://' + member.link);
            this.urlInfo.href = url.href;
        }

        this.followedNumber.textContent = member.followed_count;
        this.followersNumber.textContent = member.followers_count;
        this.banner.style.backgroundImage = member.banner_url ? `url(${member.banner_url})` : 'none';

        if (window.app.member.id === member.id) {
            this.button.textContent = 'Editar perfil';
            this.button.classList.remove('profile-button--other');
            this.button.classList.add('profile-button--self');
            this.button.onclick = () => {
                new ProfileEditor(this.member);
            }
        } else {
            this.button.classList.remove('profile-button--self');
            this.button.classList.add('profile-button--other');

            if (member.is_followed) {
                this.button.textContent = 'Dejar de seguir';
                this.button.onclick = this.unfollow;
            } else {
                this.button.textContent = 'Seguir';
                this.button.onclick = this.follow;
            }
        }

        this.bottomContainer.appendChild(this.button);

        this.followedContainer.onclick = () => {
            router.navigateTo(`/member/${member.username}/followed`);
        }

        this.followersContainer.onclick = () => {
            router.navigateTo(`/member/${member.username}/followers`);
        }
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

    setName = (name) => {
        this.name.textContent = name;
        this.member.name = name;
    }

    setBio = (bio) => {
        this.bio.textContent = bio;
        this.member.bio = bio;
    }

    setIcon = (url) => {
        this.icon.src = url ?
        url : 
        URL_NO_IMAGE;
        this.member.icon_url = url;
    }

    setBanner = (url) => {
        this.banner.style.backgroundImage = url ? `url(${url})` : 'none';
        this.member.banner_url = url;
    }

    setLocation = (location) => {
        this.member.location = location;
        if (!location) return this.locationContainer.style.display = 'none';
        this.locationContainer.style.display = 'flex';
        this.locationInfo.textContent = location;
    }

    setLink = (link) => {
        this.member.link = link;
        if (!link) return this.urlContainer.style.display = 'none';
        this.urlContainer.style.display = 'flex';
        this.urlInfo.textContent = shortenLink(link);
        const url = link.startsWith('http') ? new URL(link) : new URL('http://' + link);
        this.urlInfo.href = url.href;
    }
}

export default new Profile();