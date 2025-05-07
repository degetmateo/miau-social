import {importCSS} from "../../helpers.js";
import router from "../../router.js";

importCSS('/public/components/nav-button/nav-button.css');

class NavButton extends HTMLElement {
    constructor (data = {
        icon_on: '',
        icon_off: '',
        text: '',
        pathname: '',
        onClick: () => {}
    }) {
        super();
        this.data = data;
        this.classList.add('nav-button');
        this.icon = document.createElement('div');
        this.icon.classList.add('nav-button-icon-container');
        this.append(this.icon);
        
        this.counter = document.createElement('div');
        this.counter.classList.add('nav-button-counter');

        this.number = document.createElement('div');
        this.number.classList.add('nav-button-number');
        this.number.textContent = '0';
        this.counter.append(this.number);

        this.iconOn = document.createElement('img');
        this.iconOn.classList.add('nav-button-icon', 'nav-button-icon-on');
        this.iconOn.src = data.icon_on;

        this.iconOff = document.createElement('img');
        this.iconOff.classList.add('nav-button-icon', 'nav-button-icon-off');
        this.iconOff.src = data.icon_off;

        this.text = document.createElement('span');
        this.text.classList.add('nav-button-text');
        this.text.textContent = data.text;
        this.append(this.text);

        this.update();

        this.onclick = (e) => {
            this.go();
            if (data.onClick) data.onClick(e);
        };
    };

    go () {
        router.navigateTo(this.data.pathname);
    };

    update () {
        window.location.pathname === this.data.pathname ? this.on() : this.off();
    };

    on () {
        this.icon.innerHTML = '';
        this.icon.append(this.counter);
        this.icon.append(this.iconOn);
    };

    off () {
        this.icon.innerHTML = '';
        this.icon.append(this.counter);
        this.icon.append(this.iconOff);
    };

    setPathname (pathname) {
        this.data.pathname = pathname;
        this.update();
    };

    setNumber (number) {
        this.number.textContent = number;
        (!number || number <= 0) ?
            this.counter.classList.remove('nav-button-counter-active') :
            this.counter.classList.add('nav-button-counter-active');
    };
};

customElements.define('app-nav-button', NavButton);
export default NavButton;