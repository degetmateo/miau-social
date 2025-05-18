import Post from "../components/post/Post.js";
import Observer from "../interfaces/Observer.js";
import EventsHandler from "./EventsHandler.js";

class PostsManager extends Observer {
    constructor () {
        super();
        this.observerId = 'posts-manager';
        this.posts = new Array();
        EventsHandler.addObserver(this);
    };

    Update (data) {
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].data.id == data.id) {
                this.posts[i].update(data);
            };
        };
    };

    Create (data, options = {
        expanded: false,
        onReply: () => {},
        onQuote: () => {},
        onUpvote: () => {},
        date: 'relative'
    }) {
        const post = new Post(data, options);
        this.posts.push(post);
        return post;
    };

    Add (data) {
        const post = new Post(data, options);
        this.posts.push(post);
    };

    Delete (data) {
        this.posts = this.posts.filter(p => p.data.id != data.id);
    };

    Clear () {
        this.posts = new Array();
    };

    FindById (id) {
        return this.posts.find(p => p.data.id == id);
    };

    GetThread (post, thread) {
        if (!thread) thread = [];
        if (!post.data.target_post_id) return thread;
        if (post.data.type === 'quote') return thread;
        const repliedPost = this.FindById(post.data.target_post_id);
        if (!repliedPost) return thread;
        thread.push(repliedPost);
        return this.GetThread(repliedPost, thread);
    };

    GetReplies (post) {
        return this.posts.filter(p => p.data.target_post_id === post.data.id && p.data.type === 'reply');
    };

    onVisibilityChange () {
        for (let i = 0; i < this.posts.length; i++) {
            this.posts[i].update(this.posts[i].data);
        };
    };
};

export default new PostsManager();