import Alert from "../components/alert/alert.js";
import Aside from "../components/aside/Aside.js";
import Header from "../components/header/Header.js";
import Nav from "../components/nav/Nav.js";
import PostCreator from "../components/post-creator/PostCreator.js";
import Post from "../components/post/Post.js";
import { postService } from "../services/postService.js";
import publicationViewStyles from "../styles/publication.view.styles.js";
import publicationViewTemplate from "../templates/publication.view.template.js";
import GenericView from "./generic.view.js";

export default class extends GenericView {
    constructor () {
        super();
        this.view.classList.add('publication-view');
        this.view.innerHTML = publicationViewTemplate() + publicationViewStyles();

        this.navContainer = this.view.querySelector('#nav-container');
        this.headerContainer = this.view.querySelector('#header-container');
        this.asideContainer = this.view.querySelector('#aside-container');

        this.header = new Header({ text: 'Publicación' });
        this.header.setAttribute('id', 'publication-header');
        this.headerContainer.append(this.header)

        this.aside = new Aside();
        this.aside.setAttribute('id', 'publication-aside');
        this.asideContainer.append(this.aside);

        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };

        this.threadContainer = this.view.querySelector('#thread-container');
        this.publicationContainer = this.view.querySelector('#publication-container');
        this.creatorContainer = this.view.querySelector('#creator-container');
        this.repliesContainer = this.view.querySelector('#replies-container');
    };

    async init (meta) {
        this.app.innerHTML = '';
        this.app.append(this.view);
        this.navContainer.append(Nav);

        this.threadContainer.innerHTML = '';
        this.publicationContainer.innerHTML = '';
        this.repliesContainer.innerHTML = '';
        this.creatorContainer.innerHTML = '';

        try {
            const res = await postService.get({ _id: meta.data.id });
            const data = res[0];
            console.log(data)
            const publication = new Post(data);
            this.publicationContainer.append(publication);

            this.creator = new PostCreator({
                alert: '¡Respuesta enviada!',
                target_id: data._id,
                title: `Responder a @${data.author.username}`,
                type: 'reply'
            });

            this.creator.updateName(window.app.member.name);
            this.creator.updateIcon(window.app.member.icon.url);

            this.creatorContainer.append(this.creator);

            this.creator.onSuccess((response) => {
                publication.footer.increaseRepliesCount();
                data.comment_count = parseInt(data.comment_count) + 1;
                this.repliesContainer.prepend(new Post(response));
            });

            let replies = await postService.get({ targetPublicationId: meta.data.id, type: 'reply' });
            replies = replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            for (const reply of replies) {
                this.repliesContainer.prepend(new Post(reply));
            };

            const previousScroll = this.view.scrollTop;
            const previousHeight = this.view.scrollHeight;

            let thread = data.thread_publications || [];
            for (const p of thread) {
                this.threadContainer.prepend(new Post(p));
            };

            const newHeight = this.view.scrollHeight;
            const heightDifference = newHeight - previousHeight;

            this.view.scrollTop = previousScroll + heightDifference;
        } catch (error) {
            console.error(error);
            new Alert(error.message, { error: true });
        };
    };

    reset () {};
};