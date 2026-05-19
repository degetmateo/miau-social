import jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";

class JWT {
    Generate = (data: any, expiresIn: any): Promise<string> => {
        return new Promise((resolve, reject) => {
            const payload = { data };

            jwt.sign(payload, process.env.JWT_KEY, { expiresIn }, (err, token) => {
                if (err) reject("Error al generar el token.");
                resolve(token);
            });
        });
    }

    Validate = (token: string) => {
        try {
            const { data } = jwt.verify(token, process.env.JWT_KEY) as any;
            return data;
        } catch (error) {
            throw new UnauthorizedError("No estás autorizado.");
        }
    }
}

export default new JWT();