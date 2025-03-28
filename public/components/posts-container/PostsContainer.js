import Component from "../Component.js";
import {importCSS} from "../../helpers.js";
import Post from "../post/Post.js";
import Separator from "../separator/Separator.js";

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
            this.container.append(new Post(p, { expanded: false }).render());
            this.container.append(new Separator().render());
        }
    }

    append (post) {
        this.container.append(new Post(post, { expanded: false }).render());
        this.container.append(new Separator().render());
    }

    prepend (post) {
        this.container.prepend(new Separator().render());
        this.container.prepend(new Post(post, { expanded: false }).render());
    }
}

export default PostsContainer;