const mongoose = require('mongoose');

// Creating a blueprint or schema, how a data should look like.
// Important: In typescript we write string in lowercase: "string", whereas in node we write in capital letter "String".
// Mongoose automatically generates id as _id for each post object.
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

// Creating mongoose model and exporting outside:
module.exports = mongoose.model('Post', postSchema);