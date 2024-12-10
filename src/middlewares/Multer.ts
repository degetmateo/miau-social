import multer from 'multer';

class Multer {
    private storage: multer.StorageEngine;
    private multer: multer.Multer;

    constructor () {
        this.storage = multer.memoryStorage();
        this.multer = multer({ storage: this.storage, fileFilter: this.filter });
    }

    private filter = (_: any, file: Express.Multer.File, cb: any) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
        }
    }

    Upload = (filename: string) => {
        return this.multer.single(filename);
    }
}

export default new Multer();