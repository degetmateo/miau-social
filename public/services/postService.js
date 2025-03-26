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
    type,
    target_id
}) => {
    try {
        const form = new FormData();

        form.append('content', data.content);
        form.append('type', data.type);

        for (let i = 0; i < data.images.length; i++) {
            const image = data.images[i];

            if (image.type === 'user') {
                const blob = await fetch(image.src).then(r => r.blob());
                form.append('image-'+i, blob, `image-${i}.png`);
            } else {
                form.append('tenor-'+i, image.src);
            };
        };

        if (data.target_id) form.append('target_id', data.target_id);

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