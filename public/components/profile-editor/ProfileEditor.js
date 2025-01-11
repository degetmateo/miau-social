import Component from '../Component.js';
import { importCSS } from '../../helpers.js';
import Input from '../input/input.js';
import Textarea from '../textarea/textarea.js';
import CloseButton from '../close-button/CloseButton.js';
import IconInput from '../icon-input/IconInput.js';
import BannerInput from '../banner-input/BannerInput.js';
import Alert from '../alert/alert.js';
import ScreenSpinner from '../screen-spinner/ScreenSpinner.js';
import Profile from '../../views/member/Profile.js';
import Button from '../button/Button.js';
import EventsHandler from '../../modules/EventsHandler.js';
import {memberService} from '../../services/memberService.js';

importCSS('/public/components/profile-editor/styles/profile-editor.css');

export default class ProfileEditor extends Component {
    constructor (member) {
        super();
        this.member = member;
        this.observerId = 'profile-editor';

        this.container = document.createElement('div');
        this.container.classList.add('profile-editor-container');
        document.getElementById('app').appendChild(this.container);

        this.editor = document.createElement('div');
        this.editor.classList.add('profile-editor');
        this.container.appendChild(this.editor);

        this.header = document.createElement('div');
        this.header.classList.add('profile-editor-header');
        this.editor.appendChild(this.header);

        this.closeButton = new CloseButton({
            onClick: this.close
        });

        this.header.appendChild(this.closeButton.render());

        this.title = document.createElement('span');
        this.title.classList.add('profile-editor-title');
        this.title.innerText = 'Editar perfil';
        this.header.appendChild(this.title);

        this.saveButton = new Button({
            appearance: 'default',
            text: 'Guardar',
            onClick: this.submit
        });
        
        this.saveButton.add('profile-editor-save-button');
        this.header.appendChild(this.saveButton.render());

        this.body = document.createElement('div');
        this.body.classList.add('profile-editor-body');
        this.editor.appendChild(this.body);

        this.imagesContainer = document.createElement('div');
        this.imagesContainer.classList.add('profile-editor-images-container');
        this.body.appendChild(this.imagesContainer);

        this.infoContainer = document.createElement('div');
        this.infoContainer.classList.add('profile-editor-info-container');
        this.body.appendChild(this.infoContainer);

        this.bannerContainer = document.createElement('div');
        this.bannerContainer.classList.add('profile-editor-banner');

        this.banner = new BannerInput();
        this.bannerContainer.appendChild(this.banner.render());
        this.imagesContainer.appendChild(this.bannerContainer);

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('profile-editor-icon');

        this.icon = new IconInput();
        this.iconContainer.appendChild(this.icon.render());

        this.imagesContainer.appendChild(this.iconContainer);

        this.inputName = new Input({
            min: 1,
            max: 16,
            title: 'Nombre',
            type: 'text'
        });

        this.infoContainer.appendChild(this.inputName.render());

        this.inputBio = new Textarea({
            min: 0,
            max: 500,
            title: 'Biografía'
        });

        this.infoContainer.appendChild(this.inputBio.render());

        this.inputLocation = new Input({
            min: 0,
            max: 16,
            title: 'Ubicación',
            type: 'text'
        });

        this.infoContainer.appendChild(this.inputLocation.render());

        this.inputLink = new Input({
            min: 0,
            max: 100,
            title: 'Enlace',
            type: 'text'
        });

        this.infoContainer.appendChild(this.inputLink.render());

        this.container.onclick = (e) => {
            if (e.target === this.background) this.close();
        }

        this.inputName.set(this.member.name);
        this.inputBio.set(this.member.bio);
        this.inputLocation.set(this.member.location || '');
        this.inputLink.set(this.member.link || '');
        this.icon.set(this.member.icon_url || '');
        this.banner.set(this.member.banner_url || '');

        EventsHandler.addObserver(this);
    }

    onEscape = () => {
        this.close();
    }

    submit = async () => {
        const name = this.inputName.value;
        const bio = this.inputBio.value;
        const location = this.inputLocation.value;
        const link = this.inputLink.value;
        
        if (!this.inputName.isValid()) return;
        if (!this.inputBio.isValid()) return;
        if (!this.inputLocation.isValid()) return;
        if (!this.inputLink.isValid()) return;

        const icon = {
            changed: this.icon.isChanged(),
            blob: this.icon.getBlob()
        }

        const banner = {
            changed: this.banner.isChanged(),
            blob: this.banner.getBlob()
        }

        const loader = new ScreenSpinner();
        this.close();

        let icon_action;

        if (icon.changed && icon.blob) icon_action = 'update';
        if (icon.changed && !icon.blob) icon_action = 'delete';
        if (!icon.changed) icon_action = 'none';

        let banner_action;

        if (banner.changed && banner.blob) banner_action = 'update';
        if (banner.changed && !banner.blob) banner_action = 'delete';
        if (!banner.changed) banner_action = 'none';

        let response;
        try {
            response = await memberService.updateProfile({
                name: name,
                bio: bio,
                location: location,
                link: link,
                icon: icon.blob,
                icon_action: icon_action,
                banner: banner.blob,
                banner_action: banner_action
            });
        } catch (error) {
            loader.remove();
            return new Alert(error.message, { error: true });
        }

        window.app.member.icon_url = response.icon_url;
        window.app.member.banner_url = response.banner_url;

        Profile.setIcon(response.icon_url);
        Profile.setBanner(response.banner_url);

        Profile.setName(response.name);
        Profile.setBio(response.bio);

        Profile.setLocation(response.location);
        Profile.setLink(response.link);

        loader.remove();
        new Alert('¡Perfil actualizado!', { error: false });
    }

    close = () => {
        this.icon.setChanged(false);
        this.banner.setChanged(false);
        this.container.remove();
        EventsHandler.removeObserver(this);
    }
}