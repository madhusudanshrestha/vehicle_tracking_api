import multer from 'multer'
/**
 * Multer to handle Multipart uploads
 */
const multipartMiddleware = multer({ dest: 'uploads/' }) //save images on upload folder

export default multipartMiddleware
