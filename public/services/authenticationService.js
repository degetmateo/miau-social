const authenticate = async (data = {
    token: ""
}) => {
    try {
        const request = await fetch ('/api/authentication/authenticate', {
            method: 'POST',
            headers: { "authorization": `Bearer ${data.token}` }
        });
        
        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const signin = async (data = {
    username: '',
    password: '',
    captcha_token: ''
}) => {
    try {
        const request = await fetch('/api/authentication/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw response.error;
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const signup = async (data = {
    email: '',
    username: '',
    name: '',
    password: '',
    captcha_token: ''
}) => {
    try {
        const request = await fetch('/api/authentication/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const verify = async (data = {
    token: ''
}) => {
    try {
        const request = await fetch('/api/authentication/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const activate = async (data = {
    email: '',
    captcha_token: ''
}) => {
    try {
        const request = await fetch('/api/authentication/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw response.error;
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const recoverPassword = async (data = {
    token: '',
    username: ''
}) => {
    try {
        const request = await fetch('/api/authentication/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw response.error;
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const recoverUsername = async (data = {
    token: '',
    email: ''
}) => {
    try {
        const request = await fetch('/api/authentication/recover-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw response.error;
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const resetPassword = async (data = {
    grecaptcha_token: '',
    token: '',
    password: ''
}) => {
    try {
        const request = await fetch('/api/authentication/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();
        if (!request.ok) throw response.error;
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const authenticationService = {
    authenticate,
    signin,
    signup,
    verify,
    activate,
    recoverPassword,
    recoverUsername,
    resetPassword
}