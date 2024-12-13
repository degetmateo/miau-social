import Component from "../Component.js";
import {importCSS} from "../../helpers.js";
import Post from "../post/Post.js";

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
            this.container.appendChild(new Post(p, { date: 'informal' }).getElement());
        }
    }
}

export default PostsContainer;