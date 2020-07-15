const express = require("express");
const Post = require("../models/post");
const multer = require("multer");



const router = express.Router();


// Creating custome Image parsing functionality using multer(npm package)
// Creating image type or MIME type: which image formate can be accepted while uploading image on frontend.
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// Storing the image,if valid and also throwing error. it takes two objects: destination and filename.
// cb: callback function.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;      // here, null means image file type is valid.
        }
        cb(error, "backend/images");
        // important: give the path of the images folder from the server.js file.
    },
    // creating file name and extension after getting from the frontend.
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});



// Post route method: This will handle HTTP Post request verb coming from frontend.
// "":root directory. 
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// post: is the mongoose database schema. post.save() is mongoose middleware (save) to save data to the mongodb.
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({                                  // instantialing new post: constructor function. Here, in post object, we are parsing the body of the request body 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then((createdPost) => {                        // CreatedPost: is an object that will get saved to the mongodb.
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
});



// Put route method: This will handle HTTP Put request verb coming from frontend.
router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({                                // instantiating new post object for storing request
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post)
    post.updateOne(post).then(result => {                                  // post.updateOne: mongoose update method.
        res.status(200).json({ message: 'Update successfull!' });
    });
});



// GET route method: This will handle HTTP GET request verb coming from frontend.
router.get("", (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Posts fetching successfully',
                posts: documents
            });
        });
});


// GET route method: This will handle HTTP GET request verb coming from frontend.
// Here, we are finding Post by id. That means we are looking for the post that are already present in the database.
router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    });
});


// DELETE route method: This will handle HTTP DELETE request verb coming from frontend.
// deleteOne is the mongoose method. which takes id from the request and deleting _id from the database.
router.delete("/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Post deleted!' });
    })
});


module.exports = router;