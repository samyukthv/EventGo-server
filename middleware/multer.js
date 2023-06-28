const multer = require("multer")
const path = require('path')



// multerMiddleware.js

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
     console.log('Reached multer destination function');
      // Define the destination folder based on the image type
      let destinationFolder;
      if (file.fieldname === 'coverImage') {
        destinationFolder = path.join(__dirname,'../public/coverImage');
      } else if (file.fieldname === 'image') {
        destinationFolder = path.join(__dirname,'../public/image');
      } else if(file.fieldname === 'profileImage') {
        destinationFolder = path.join(__dirname,'../public/profileImage');
      }else if(file.fieldname === 'organizerCoverImage') {
        destinationFolder = path.join(__dirname,'../public/organizerCoverImage');
      }else if(file.fieldname === 'organizerProfileImage') {
        destinationFolder = path.join(__dirname,'../public/organizerProfile');
      }else if(file.fieldname ==='postImage'){
       destinationFolder = path.join(__dirname,'../public/organizerPost');
      }else{
        return cb(new Error('Invalid image type'));
      }
  
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + ".jpg"
        cb(null,file.fieldname + "-" + unique)
    }
  });
  
  const upload = multer({ storage:storage });
  
  module.exports = upload;