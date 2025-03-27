import SettingsView from "./views/settings/SettingsView.js";
import LoginView from "./views/LoginView.js";
import MemberView from "./views/member/MemberView.js";
import AdminView from "./views/AdminView.js";
import CommentsView from "./views/comments/CommentsView.js";
import MessagesView from "./views/messages/MessagesView.js";
import NotificationsView from "./views/notifications/NotificationsView.js";
import FollowedView from "./views/followed/FollowedView.js";
import FollowersView from "./views/followers/FollowersView.js";
import ErrorView from "./views/error/ErrorView.js";
import HomeView from "./views/home/HomeView.js";

class Router {
    constructor () {
        this.router = new Navigo("/", { hash: false });

        this.views = {
            error: new ErrorView(),
            home: new HomeView(),
            settings: new SettingsView(),
            notifications: new NotificationsView(),
            login: new LoginView(),
            messages: new MessagesView(),
            member: new MemberView(),
            followed: new FollowedView(),
            followers: new FollowersView(),
            admin: new AdminView(),
            post: new CommentsView()
        }

        this.router
            .on("/", () => this.views.home.init())
            .on("/home", () => this.views.home.init())
            .on("/login", () => this.views.login.init())
            .on("/settings", () => this.views.settings.init())
            .on("/member/:username", ({ data }) => this.views.member.init(data))
            .on("/member/:username/followed", ({ data }) => this.views.followed.init(data))
            .on("/member/:username/followers", ({ data }) => this.views.followers.init(data))
            .on("/admin", () => this.views.admin.init())
            .on("/post/:id_post/comments", ({ data }) => this.views.post.init(data))
            .on("/messages", () => this.views.messages.init())
            .on("/notifications", () => this.views.notifications.init())
            .notFound(() => this.views.error.init());
    }

    resolve = () => {
        this.router.resolve();
    }

    navigateTo = (url) => {
        window.history.pushState(null, null, url);
        this.resolve();
    };

    goBack = () => {
        window.history.back();
    }

    goForward = () => {
        window.history.forward();
    }

    getPathname = () => {
        return window.location.pathname;
    }
}

export default new Router();