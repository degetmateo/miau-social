const getByUsername = async ({
    username
}) => {
    try {
        const request = await fetch(`/api/member/${username}`, {
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

const updateProfile = async (data = {
    name: '',
    bio: '',
    location: '',
    link: '',
    icon: null,
    icon_action: 'none',
    banner: null,
    banner_action: 'none'
}) => {
    try {
        const form = new FormData();

        form.append('name', data.name);
        form.append('bio', data.bio);
        form.append('location', data.location);
        form.append('link', data.link);
        form.append('icon', data.icon);
        form.append('icon_action', data.icon_action);
        form.append('banner', data.banner);
        form.append('banner_action', data.banner_action);

        const request = await fetch('/api/member/update-profile', {
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

export const memberService = {
    getByUsername,
    updateProfile
}