import Navigation from "./components/navigation/navigation.js";
import Notifier from "./modules/Notifier.js";
import EventsHandler from "./modules/EventsHandler.js";
import router from "./router.js";
import ScreenSpinner from "./components/screen-spinner/ScreenSpinner.js";
import {authenticationService} from "./services/authenticationService.js";
import Alert from "./components/alert/alert.js";

window.addEventListener("popstate", () => router.resolve());

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        e.stopPropagation();
        const linkElement = e.target.closest("[data-link]");
        
        if (linkElement) {
            e.preventDefault();
            router.navigateTo(linkElement.getAttribute('data-url') || linkElement.href || linkElement.getAttribute('href'));
        }
    });

    if (router.getPathname() === '/verify') {
        router.resolve();
        return;
    }

    if (router.getPathname() === '/recovery/reset-password') {
        router.resolve();
        return;
    }

    const loader = new ScreenSpinner({ opaque: true });
    const token = localStorage.getItem('token');
    
    window.app = {};
    window.app.logged = false;

    if (token) {
        let response;
        try {
            response = await authenticationService.authenticate({ token });
        } catch (error) {
            localStorage.removeItem('token');
            window.app.logged = false;
            new Alert("La sesión ha expirado.", { error: true });
            router.navigateTo('/');
            return;
        }

        localStorage.setItem('token', response.token);

        window.app.logged = true;
        window.app.alerts = [];
        window.app.member = response;
        
        init();

        router.resolve();
        loader.remove();
        return;
    }

    router.navigateTo('/');
});

export const init = () => {
    EventsHandler.clear();

    window.app.nav = new Navigation();
    EventsHandler.addObserver(window.app.nav);
    
    EventsHandler.addObserver(Notifier);
    Notifier.initialize();
}