import Notifier from "./modules/Notifier.js";
import EventsHandler from "./modules/EventsHandler.js";
import router from "./router.js";
import ScreenSpinner from "./components/screen-spinner/ScreenSpinner.js";
import {authenticationService} from "./services/authenticationService.js";
import Nav from "./components/nav/Nav.js";
import PostsManager from "./modules/PostsManager.js";
import Socket from "./modules/Socket.js";

window.addEventListener("popstate", () => {
    router.resolve();
});

document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ScreenSpinner({ opaque: true });

    if (router.getPathname() === '/verify') {
        router.resolve();
        loader.remove();
        return;
    }

    if (router.getPathname() === '/recovery/reset-password') {
        router.resolve();
        loader.remove();
        return;
    }
    
    window.app = {};
    window.app.logged = false;

    let response;
    try {
        response = await authenticationService.authenticate();
    } catch (error) {
        localStorage.removeItem('token');
        window.app.logged = false;
        router.navigateTo('/');
        router.resolve();
        loader.remove();
        return;
    }

    localStorage.setItem('token', response.token);

    window.app.logged = true;
    window.app.alerts = [];
    window.app.member = response;
    
    init();

    router.resolve();
    loader.remove();
});

export const init = () => {
    PostsManager.Clear();
    EventsHandler.addObserver(Nav);
    Nav.set(window.app.member);
    Socket.Initialize();
    Notifier.initialize();

    window.dispatchEvent(new CustomEvent('app-initialized', {
        detail: {
            member: window.app.member
        }
    }));
};