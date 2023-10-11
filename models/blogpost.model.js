const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const default_url = "https://via.placeholder.com/300";
const pageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: "Some subtitle text"
    },
    description: {
        type: String,
        default: "Some body text"
    },
    author: {
        type: String,
        default: "Some author text"
    },
    date: {
        type: String,
        default: "Some date text"
    },
    tags: {
        type: String,
        default: "blog"
    },
    footer: {
        type: String,
        default: "Some footer text"
    },
    images: {
        main: {
            type: String,
            default: default_url
        },
        alt_1: {
            type: String,
            default: default_url
        },
        alt_2: {
            type:String,
            default: default_url
        },
        alt_3: {
            type:String,
            default: default_url
        },
        alt_4: {
            type:String,
            default: default_url
        },
        alt_5: {
            type:String,
            default: default_url
        },
        alt_6: {
            type:String,
            default: default_url
        }
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Blogpost = mongoose.model("Blogpost", pageSchema);
module.exports = Blogpost;