const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const default_url = "https://via.placeholder.com/300";
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    footer: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: default_url
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;