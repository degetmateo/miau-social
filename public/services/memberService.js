import Service from "../modules/Service.js";

const getByUsername = async (data = {
    username
}) => {
    try {
        return await Service.Fetch(`/api/member/${data.username}`, {
            method: "GET"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

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

        return await Service.Fetch('/api/member/update-profile', {
            method: 'POST',
            body: form
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const updateUsername = async (data = {
    username: ''
}) => {
    try {
        return await Service.Fetch('/api/member/update-username', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error(error);
        throw error;  
    };
};

const updatePassword = async (data = {
    password: '',
    new_password: ''
}) => {
    try {
        return await Service.Fetch('/api/member/update-password', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error(error);
        throw error;  
    };
};

export const memberService = {
    getByUsername,
    updateProfile,

    updateUsername,
    updatePassword
};