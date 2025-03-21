const get = async (data = {
    username,
    offset
}) => {
    try {
        const request = await fetch(`/api/post?${data.username ? 'username='+data.username : ''}&offset=${data.offset}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getFollowing = async (data = {
    offset: 0
}) => {
    try {
        const request = await fetch(`/api/post/following?offset=${data.offset}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const post = async (data = {
    content,
    images,
    id_replied_post
}) => {
    try {
        const form = new FormData();

        form.append('content', data.content);
        
        data.images = data.images.map((image, i) => {
            return {
                src: image.src,
                type: image.type,
                index: i
            }
        });

        const userImages = data.images.filter(i => i.type === 'user');
        const tenorImages = data.images.filter(i => i.type === 'tenor');

        for (let i = 0; i < userImages.length; i++) {
            const image = userImages[i];
            const blob = await fetch(image.src).then(r => r.blob());
            form.append('image-'+image.index, blob, `image-${image.index}.png`);
        }

        for (let i = 0; i < tenorImages.length; i++) {
            const image = tenorImages[i];
            form.append('tenor-'+image.index, image.src);
        }

        if (data.id_replied_post) form.append('id_replied_post', data.id_replied_post);

        const request = await fetch('/api/post', {
            method: 'POST',
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
            body: form
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postService = {
    get,
    getFollowing,
    post
}