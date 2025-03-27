class PostsHandler {
    constructor () {
        this.posts = [];
    }

    find (id) {
        return this.posts.find(p => p.id === id);
    }

    add (post) {
        if (this.find(post.id)) {
            this.update(post);
            return;
        }

        this.posts.push(post);
    }

    clear () {
        this.posts = [];
    }

    get () {
        return this.posts;
    }

    update (post) {
        let i = 0;
        while (i < this.posts.length) {
            if (this.posts[i].id === post.id) break;
            i++;
        }

        this.posts[i] = post;
    }

    getThread (post, thread) {
        if (!thread) thread = [];
        if (!post.target_post_id) return thread;
        if (post.type === 'quote') return thread;
        
        const rp = this.find(post.target_post_id);
        if (!rp) return thread;

        thread.push(rp);
        return this.getThread(rp, thread);
    }

    getReplies (post) {
        return this.posts.filter(p => p.target_post_id === post.id);
    }
}

export default new PostsHandler();