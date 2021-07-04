let express = require('express');
require('dotenv').config();
let router = express.Router();
const { cloudinary } = require('../cloudinary');
const upload = require("../multer");

router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log('uploading to clud: ',req);
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            imageUrl: result
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: 'Problem uploading file',
            error: err.message
        })
    }
});

module.exports = router;