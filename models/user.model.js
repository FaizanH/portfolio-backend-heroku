const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email_address: {
        type: String,
        default: ""
    },
    roles: {
        type: [String],
        default: ["Employee"]
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);