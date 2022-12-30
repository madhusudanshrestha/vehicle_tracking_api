import fs from 'fs'
/**
 * Save image to file
 */
const saveImage = (file: Express.Multer.File): string | null => {
  const { path: tmp_path, originalname } = file
  if (tmp_path) {
    /** The original name of the uploaded file
            stored in the variable "originalname". **/
    const target_path = 'uploads/' + Date.now() + '_' + originalname
    /** A better way to copy the uploaded file. **/
    const src = fs.createReadStream(tmp_path)
    const dest = fs.createWriteStream(target_path)
    src.pipe(dest)
    return target_path
  }
  return null
}

export { saveImage }
