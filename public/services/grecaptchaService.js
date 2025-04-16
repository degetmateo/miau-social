import { RECAPTCHA_KEY } from "../config.js";

const execute = (action) => {
    return new Promise((resolve, reject) => {
        try {
            grecaptcha.ready(() => {
                grecaptcha.execute(RECAPTCHA_KEY, {
                    action: action || 'submit'
                }).then((token) => resolve(token));
            });   
        } catch (error) {
            reject(error);
        }
    });
}

export const grecaptchaService = {
    execute
}