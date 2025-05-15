export default class HTMLObserver extends HTMLElement {
    observerId;

    isEqualTo (observer) {
        return this.observerId === observer.observerId;
    };

    async onVisibilityChange () {};
    async onEscape () {};
    async onEnter () {};
    async onNotification () {};
    async onPathnameChange () {};
};