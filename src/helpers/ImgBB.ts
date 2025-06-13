import BadGatewayError from "../errors/BadGatewayError";
import GenericError from "../errors/GenericError";

class ImgBB {
    private readonly API_URL = 'https://api.imgbb.com/1/upload';

    upload = async (data: {
        buffer: Express.Multer.File['buffer'];
    }) => {
        try {
            const formData = new FormData();
            formData.append('image', data.buffer.toString('base64'));

            const response: any = await new Promise(async (resolve, reject) => {
                setTimeout(() => {
                    reject(new BadGatewayError('No hemos podido enviar tu publicación.'));
                }, 10000);

                const request = await fetch(`${this.API_URL}?key=${process.env.IMGBB_KEY}`, {
                    method: "POST",
                    body: formData
                });
            
                const res = await request.json() as any;
                if (!request.ok) reject(new Error(res.error.message));
                resolve(res);
            });

            return response;
        } catch (error) {
            if (error instanceof GenericError) throw error;
            else {
                console.error(error);
                throw new BadGatewayError('No hemos podido enviar tu publicación.');
            };
        };
    };

    delete = async (data: {
        delete_url: string;
    }) => {
        try {
            const request = await fetch(data.delete_url, { method: "GET" });
            const response = await request.json();
            if (!request.ok) throw new BadGatewayError(response.error.message);
            return response.data;
        } catch (error) {
            if (error instanceof GenericError) throw error;
            else {
                console.error(error);
                throw new BadGatewayError('Ha ocurrido un error inesperado.');
            }
        }
    }
}

export default new ImgBB();