import Component from "../Component.js";
import {importCSS} from "../../helpers.js";
import PostsManager from "../../modules/PostsManager.js";

importCSS('/public/components/posts-container/posts-container.css');

class PostsContainer extends Component {
    constructor () {
        super();
        this.container = document.createElement('div');
        this.container.classList.add('posts-container');
    }

    clear = () => {
        this.container.innerHTML = '';
    }

    render = () => {
        return this.container;
    }

    renderPosts = (posts) => {
        for (const p of posts) {
            this.container.append(PostsManager.Create(p));
        }
    }

    append (post) {
        this.container.append(PostsManager.Create(post));
        // this.container.append(new Separator().render());
    }

    prepend (post) {
        // this.container.prepend(new Separator().render());
        this.container.prepend(PostsManager.Create(post));
    }
}

export default PostsContainer;