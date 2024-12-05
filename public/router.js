import SettingsView from "./views/SettingsView.js";
import HomeView from "./views/HomeView.js";
import LoginView from "./views/LoginView.js";
import MemberView from "./views/MemberView.js";
import AdminView from "./views/AdminView.js";
import CommentsView from "./views/comments/CommentsView.js";
import MessagesView from "./views/messages/MessagesView.js";
import NotificationsView from "./views/notifications/NotificationsView.js";
import FollowedView from "./views/followed/FollowedView.js";
import FollowersView from "./views/followers/FollowersView.js";
import ErrorView from "./views/error/ErrorView.js";

export const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    router.resolve();
};

export const router = new Navigo("/", { hash: false });

router
    .on("/", () => new HomeView())
    .on("/home", () => new HomeView())
    .on("/login", () => new LoginView())
    .on("/settings", () => new SettingsView())
    .on("/member/:username", ({ data }) => new MemberView(data))
    // .on("/member/:username/followed", ({ data }) => new FollowedView(data))
    // .on("/member/:username/followers", ({ data }) => new FollowersView(data))
    .on("/admin", () => new AdminView())
    .on("/post/:id_post/comments", ({ data }) => new CommentsView(data))
    .on("/messages", () => new MessagesView())
    .on("/notifications", () => new NotificationsView())
    .notFound(() => new ErrorView());