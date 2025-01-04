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

importCSS('/public/components/profile-editor/styles/profile-editor.css');

class ProfileEditor extends Component {
    constructor () {
        super();
        this.observerId = 'profile-editor';
        this.app = document.getElementById('app');

        this.background = document.createElement('div');
        this.background.classList.add('profile-editor-background');

        this.container = document.createElement('div');
        this.container.classList.add('profile-editor-container');
        this.background.appendChild(this.container);

        this.header = document.createElement('div');
        this.header.classList.add('profile-editor-header');
        this.container.appendChild(this.header);

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
        this.container.appendChild(this.body);

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

        this.background.onclick = (e) => {
            if (e.target === this.background) this.close();
        }
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

        this.close();
        const loader = new ScreenSpinner();

        const form = new FormData();
        form.append('name', name);
        form.append('bio', bio);
        form.append('location', location);
        form.append('link', link);
        form.append('icon', icon.blob);  
        form.append('banner', banner.blob);

        if (icon.changed && icon.blob) form.append('icon_action', 'update');
        if (icon.changed && !icon.blob) form.append('icon_action', 'delete');
        if (!icon.changed) form.append('icon_action', 'none');

        if (banner.changed && banner.blob) form.append('banner_action', 'update');
        if (banner.changed && !banner.blob) form.append('banner_action', 'delete');
        if (!banner.changed) form.append('banner_action', 'none');

        const request = await fetch('/api/member/update-profile', {
            method: 'POST',
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
            body: form
        });

        const response = await request.json();
        if (!request.ok) {
            loader.remove();
            new Alert('¡Ocurrió un error!', { error: true });
            return;
        }

        window.app.member.icon_url = response.data.icon_url;
        window.app.member.banner_url = response.data.banner_url;

        Profile.setIcon(response.data.icon_url);
        Profile.setBanner(response.data.banner_url);

        Profile.setName(response.data.name);
        Profile.setBio(response.data.bio);

        Profile.setLocation(response.data.location);
        Profile.setLink(response.data.link);

        loader.remove();
        new Alert('¡Perfil actualizado!', { error: false });
    }

    close = () => {
        this.icon.setChanged(false);
        this.banner.setChanged(false);
        EventsHandler.removeObserver(this);
        this.background.remove();
    }

    render = (member) => {
        this.inputName.set(member.name);
        this.inputBio.set(member.bio);
        this.inputLocation.set(member.location || '');
        this.inputLink.set(member.link || '');
        this.icon.set(member.icon_url || '');
        this.banner.set(member.banner_url || '');

        EventsHandler.addObserver(this);
        this.app.appendChild(this.background);        
    }
}

export default new ProfileEditor();