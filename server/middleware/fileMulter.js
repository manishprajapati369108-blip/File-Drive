import multer, { memoryStorage } from "multer";

const uploadMiddleware = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
})

export default uploadMiddleware