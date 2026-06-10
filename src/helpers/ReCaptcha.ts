import BadGatewayError from "../errors/BadGatewayError";
import GenericError from "../errors/GenericError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { PARAMETERS } from "../static/parameters";

class ReCaptcha {
    public readonly API_URL: string = 'https://www.google.com/recaptcha/api/siteverify';

    async Verify (token: string) {
        try {
            if (process.env.ENV === 'dev') {
                return {
                    score: 10,
                    success: true
                };
            };

            const request = await fetch(this.API_URL + `?secret=${process.env.RECAPTCHA_KEY}&response=${token}`, { 
                method: 'POST'
            });

            type ERROR_CODE = 
                'missing-input-secret' | 
                'invalid-input-secret' |
                'missing-input-response' |
                'invalid-input-response' |
                'bad-request' |
                'timeout-or-duplicate'; 

            const response: {
                success: boolean;
                score: number;
                action: string;
                challenge_ts: Date;
                hostname: string;
                'error-codes': ERROR_CODE[]
            } = await request.json();

            if (!request.ok) throw new BadGatewayError();
            if (!response.success) {
                throw new UnauthorizedError(null, response["error-codes"][0].toUpperCase());
            }
            if (response.score <= PARAMETERS.RECAPTCHA_SCORE) {
                throw new UnauthorizedError(null, "LOW_SCORE");
            }

            return response;
        } catch (error) {
            if (error instanceof GenericError) throw error;
            else {
                console.error(error);
                throw new BadGatewayError();
            }
        }
    }
}

export default new ReCaptcha();