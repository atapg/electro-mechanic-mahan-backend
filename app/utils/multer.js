const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (!req.file) req.file = []

        if (
            !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)
        ) {
            req.fileValidationError = 'Only image files are allowed!'
            return cb(new Error('Only image files are allowed!'), false)
        }

        cb(null, './public')
    },
    filename(req, file, cb) {
        cb(null, ~~(Date.now() / 1000) + '_' + file.originalname)
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
})

module.exports = upload
