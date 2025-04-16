class ReCaptcha {
    public readonly API_URL: string = 'https://www.google.com/recaptcha/api/siteverify';

    async Verify (token: string) {
        try {
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

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new ReCaptcha();