const mongoose = require('mongoose')


const UrlSchema = new mongoose.Schema({

    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person",
    },
    shortUrl: {
        type: String,
        unique: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
    urlCode: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [String],


}, { timestamps: true })

module.exports = mongoose.model("urls", UrlSchema)
