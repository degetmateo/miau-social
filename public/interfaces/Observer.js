export default class Observer {
    observerId;

    isEqualTo (observer) {
        return this.observerId === observer.observerId;
    }

    async onVisibilityChange () {}
    async onEscape () {}
    async onEnter () {}
    async onNotification () {}
    async onPathnameChange () {}
}