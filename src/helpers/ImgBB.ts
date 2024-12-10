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
        
            const request = await fetch(`${this.API_URL}?key=${process.env.IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
        
            const response = await request.json() as any;
            if (!request.ok) throw new BadGatewayError(response.error.message);
            return response;
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