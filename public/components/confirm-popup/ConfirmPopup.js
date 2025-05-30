import { importCSS } from "../../helpers.js";

importCSS('/public/components/confirm-popup/confirm-popup.css');

class ConfirmPopup extends HTMLElement {
    constructor (data = {
        title: '¿Estás seguro?',
        description: 'Esta acción no se puede deshacer.',
        confirmText: 'Sí',
        cancelText: 'No',
        onConfirm: () => {},
        onCancel: () => {}
    }) {
        super();
        this.data = data;

        this.container = document.createElement('div');
        this.container.classList.add('confirm-popup-container');
        document.getElementById('app').append(this.container);
        this.container.append(this);

        this.container.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.closest('.confirm-popup')) return;
            this.onCancel();
        });

        this.classList.add('confirm-popup');

        this.tc = document.createElement('div');
        this.tc.classList.add('confirm-popup-title-container');
        this.append(this.tc);

        this.popupTitle = document.createElement('span');
        this.popupTitle.classList.add('confirm-popup-title');
        this.popupTitle.textContent = this.data.title;
        this.tc.append(this.popupTitle);

        if (this.data.description) {
            this.dc = document.createElement('div');
            this.dc.classList.add('confirm-popup-description-container');
            this.append(this.dc);
    
            this.popupDescription = document.createElement('span');
            this.popupDescription.classList.add('confirm-popup-description');
            this.popupDescription.textContent = this.data.description;
            this.dc.append(this.popupDescription);
        };

        this.buttons = document.createElement('div');
        this.buttons.classList.add('confirm-popup-buttons');
        this.append(this.buttons);

        this.confirm = document.createElement('button');
        this.confirm.classList.add('confirm-popup-button');
        this.confirm.textContent = this.data.confirmText;
        this.buttons.append(this.confirm);

        this.cancel = document.createElement('button');
        this.cancel.classList.add('confirm-popup-button');
        this.cancel.textContent = this.data.cancelText;
        this.buttons.append(this.cancel);

        this.confirm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onConfirm();
        });

        this.cancel.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onCancel();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.onCancel();
            };
        });
    };

    onConfirm () {
        this.container.remove();
        if (this.data.onConfirm) this.data.onConfirm();
    };

    onCancel () {
        this.container.remove();
        if (this.data.onCancel) this.data.onCancel();
    };
};

customElements.define('app-confirm-popup', ConfirmPopup);
export default ConfirmPopup;