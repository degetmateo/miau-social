import Helper from "../../Helper.js";
import Alert from "../alert/alert.js";

Helper.ImportCSS('/public/components/spotify-popup/spotify-popup.css');

class SpotifyPopup extends HTMLElement {
    constructor () {
        super();

        this.container = document.createElement('div');
        this.container.classList.add('spotify-popup-container');
        this.container.append(this);
        document.getElementById('app').append(this.container);

        this.classList.add('spotify-popup');

        this.form = document.createElement('form');
        this.form.classList.add('spotify-popup-form');
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });
        this.append(this.form);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Enlace de Spotify';
        this.input.classList.add('spotify-popup-input');
        this.form.append(this.input);

        this.buttons = document.createElement('div');
        this.buttons.classList.add('spotify-popup-buttons');
        this.form.append(this.buttons);

        this.cancel = document.createElement('button');
        this.cancel.type = 'button';
        this.cancel.classList.add('spotify-popup-button');
        this.cancel.textContent = 'Cancelar';
        this.buttons.append(this.cancel);

        this.confirm = document.createElement('button');
        this.confirm.type = 'submit';
        this.confirm.textContent = 'Aceptar';
        this.confirm.classList.add('spotify-popup-button');
        this.buttons.append(this.confirm);

        this.cancel.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });

        this.confirm.addEventListener('click', (e) => {
            e.preventDefault();
            this.submit();
        });

        this.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.close();
            };
        });
    };

    close () {
        this.input.value = '';
        this.container.remove();
    };

    async submit () {
        if (!this.input.value) return;
        const value = this.input.value;
        this.input.value = '';

        this.close();
        new Alert('Espere...', { error: false, timeout: null });

        try {
            const req = await fetch(`https://open.spotify.com/oembed?url=${value}`, {
                method: "GET"
            });
            if (!req.ok) throw new Error(req);
            const res = await req.json();
            res.url = value;
            this.onResponse(res);
            new Alert('¡Tenemos tu canción!', { error: false, timeout: 4000 });
        } catch (error) {
            console.error(error);
            new Alert('¡Ocurrió un error!', { error: true, timeout: 4000 });
        };
    };

    onResponse () {};
};

customElements.define('spotify-popup', SpotifyPopup);
export default SpotifyPopup;