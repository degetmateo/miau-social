import Alert from "../components/alert/alert";

class Service {
    API = '/api/post'

    get = async ({
        mode = 'global',
        offset = 0,
        id_member = null
    }) => {
        try {
            const URL = mode === 'global' ? 
                `${this.API}?offset=${offset}&id_member=${id_member}` :
                `${this.API}/following?offset=${offset}`;

            const request = await fetch(URL, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            const response = await request.json();
            if (!request.ok) throw new Error(response.error.message);
            
            return response;
        } catch (error) {
            console.error(error);
            new Alert(error.message);
        }
    }

    post = async ({
        content = '',
        images = []
    }) => {
        try {
            const request = await fetch (this.API, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': "Application/JSON"
                },
                body: JSON.stringify({ content, images })
            });
            
            const response = await request.json();
            if (!request.ok) throw new Error(response.error.message);

            return response;
        } catch (error) {
            console.error(error);
            new Alert(error.message);
        }
    }
}

export default new Service();