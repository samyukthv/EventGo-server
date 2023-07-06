const multer = require("multer")
const path = require('path')



// multerMiddleware.js

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Reached multer destination function');
    // Define the destination folder based on the image type
    const destinationMap = {
      coverImage: 'coverImage',
      image: 'image',
      profileImage: 'profileImage',
      organizerCoverImage: 'organizerCoverImage',
      organizerProfileImage: 'organizerProfile',
      postImage: 'organizerPost',
    };

    const destinationFolder = destinationMap[file.fieldname];
    if (destinationFolder) {
      const destinationPath = path.join(__dirname, `../public/${destinationFolder}`);
      cb(null, destinationPath);
    } else {
      cb(new Error('Invalid image type'));
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + ".jpg";
    cb(null, file.fieldname + "-" + unique);
  }
});

const upload = multer({ storage });

module.exports = upload;
