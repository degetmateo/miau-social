import SettingsView from "./views/settings/SettingsView.js";
import MemberView from "./views/member/MemberView.js";
import AdminView from "./views/AdminView.js";
import CommentsView from "./views/comments/CommentsView.js";
import MessagesView from "./views/messages/MessagesView.js";
import NotificationsView from "./views/notifications/NotificationsView.js";
import FollowedView from "./views/followed/FollowedView.js";
import FollowersView from "./views/followers/FollowersView.js";
import ErrorView from "./views/error/ErrorView.js";
import HomeView from "./views/home/HomeView.js";
import SignupView from "./views/signup/SignupView.js";
import SigninView from "./views/signin/SigninView.js";
import LandingView from "./views/landing/LandingView.js";
import VerifyView from "./views/verify/VerifyView.js";
import ActivateView from "./views/activate/ActivateView.js";
import RecoverPasswordView from "./views/recover-password/RecoverPasswordView.js";
import RecoverUsernameView from "./views/recover-username/RecoverUsernameView.js";
import ResetPasswordView from "./views/reset-password/ResetPasswordView.js";
import AccountView from "./views/account/AccountView.js";
import SecurityView from "./views/security/SecurityView.js";
import UsernameView from "./views/username/UsernameView.js";
import PasswordView from "./views/password/PasswordView.js";
import SessionsView from "./views/sessions/SessionsView.js";
import ExploreView from "./views/explore/ExploreView.js";

class Router {
    constructor () {
        this.router = new Navigo("/", { hash: true });
        this.event = new Event('pathnamechange');

        this.views = {
            error: new ErrorView(),
            landing: new LandingView(),
            verify: new VerifyView(),
            home: new HomeView(),
            settings: new SettingsView(),
            notifications: new NotificationsView(),
            messages: new MessagesView(),
            member: new MemberView(),
            followed: new FollowedView(),
            followers: new FollowersView(),
            admin: new AdminView(),
            post: new CommentsView(),
            signup: new SignupView(),
            signin: new SigninView(),
            activate: new ActivateView(),
            recoverPassword: new RecoverPasswordView(),
            recoverUsername: new RecoverUsernameView(),
            resetPassword: new ResetPasswordView(),
            account: new AccountView(),
            security: new SecurityView(),
            username: new UsernameView(),
            password: new PasswordView(),
            sessions: new SessionsView(),
            explore: new ExploreView()
        };

        this.router
            .on("/", () => this.views.landing.init())
            .on("/home", () => this.views.home.init())
            .on("/explore", ({ data, params }) => this.views.explore.init(data, params))
            .on("/settings", () => this.views.settings.init())
            .on("/settings/account", () => this.views.account.init())
            .on("/settings/account/username", () => this.views.username.init())
            .on("/settings/security", () => this.views.security.init())
            .on("/settings/security/password", () => this.views.password.init())
            .on("/settings/security/sessions", () => this.views.sessions.init())
            .on("/member/:username", ({ data }) => this.views.member.init(data))
            .on("/member/:username/followed", ({ data }) => this.views.followed.init(data))
            .on("/member/:username/followers", ({ data }) => this.views.followers.init(data))
            .on("/admin", () => this.views.admin.init())
            .on("/post/:id_post/comments", ({ data }) => this.views.post.init(data))
            .on("/messages", () => this.views.messages.init())
            .on("/notifications", () => this.views.notifications.init())
            .on("/signup", () => this.views.signup.init())
            .on("/signin", () => this.views.signin.init())
            .on("/verify", ({ data, params }) => this.views.verify.init(data, params))
            .on("/recovery/activate", () => this.views.activate.init())
            .on("/recovery/password", () => this.views.recoverPassword.init())
            .on("/recovery/username", () => this.views.recoverUsername.init())
            .on("/recovery/reset-password", ({ data, params }) => this.views.resetPassword.init(data, params))
            .notFound(() => this.views.error.init());
    }

    reset = () => {
        this.views = {
            error: new ErrorView(),
            landing: new LandingView(),
            verify: new VerifyView(),
            home: new HomeView(),
            settings: new SettingsView(),
            notifications: new NotificationsView(),
            messages: new MessagesView(),
            member: new MemberView(),
            followed: new FollowedView(),
            followers: new FollowersView(),
            admin: new AdminView(),
            post: new CommentsView(),
            signup: new SignupView(),
            signin: new SigninView(),
            activate: new ActivateView(),
            recoverPassword: new RecoverPasswordView(),
            recoverUsername: new RecoverUsernameView(),
            resetPassword: new ResetPasswordView(),
            account: new AccountView(),
            security: new SecurityView(),
            username: new UsernameView(),
            password: new PasswordView(),
            sessions: new SessionsView(),
            explore: new ExploreView()
        };
    };

    resolve = () => {
        this.router.resolve();
    };

    navigateTo = (url) => {
        if (url == window.location.pathname) return;
        window.history.pushState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    replace = (url) => {
        if (url == window.location.pathname) return;
        window.history.replaceState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    goBack = () => {
        window.history.back();
    };

    goForward = () => {
        window.history.forward();
    };

    getPathname = () => {
        return window.location.pathname;
    };

    reload = () => {
        window.location.reload();
    };
};

export default new Router();