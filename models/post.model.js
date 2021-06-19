const mongoose = require("mongoose");
const { Schema } = mongoose;
require('mongoose-type-url');

/** 
 * {    
 *      <br>&nbsp;&nbsp; id: ObjectId, 
 *      <br>&nbsp;&nbsp; userId: ObjectId, ref-User,
 *      <br>&nbsp;&nbsp; content: string,
 *      <br>&nbsp;&nbsp; caption: string,
 *      <br>&nbsp;&nbsp; images: [{ imageUrl, altText}, ...],
 *      <br>&nbsp;&nbsp; likes: [{likedByUser: userId, ref-User}, ...], 
 *      <br>&nbsp;&nbsp; comments: [{commentText: string (non-emtpy), commentByUser: userId, ref-user}],
 *      <br>&nbsp;&nbsp; hashtags: [{string, minlength: 2}, ...],
 *      <br>&nbsp;&nbsp; createdAt: date,
 *      <br>&nbsp;&nbsp; updatedAt: date
 * <br>
 * }
*/

const postSchema = new Schema({
    id: Schema.Types.ObjectId,
    userId: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    content: {
        type: String,
    },
    caption: {
        type: String
    },
    images: [
        {
            imageUrl: {
                type: mongoose.SchemaTypes.Url,
                message: "Invalid Image url"
            },
            altText: String
        }
    ],
    likes: [
        {
            likedByUser: {
                type: Schema.Types.ObjectId, 
                ref: "User"
            }
        }
    ],
    comments: [
        {
            commentText: {
                type: String,
                minLength: [1, "Comment cannot be empty"]
            },
            commentByUser: {
                type: Schema.Types.ObjectId, 
                ref: "User"
            }
        }
    ],
    hashtags: [
        {
            type: String,
            minLength: [2, "Hashtag must be at least 2 character long"]
        }
    ]
},
{
    timestamps: true,
});

postSchema.index({
    content: 'text',
    hashtags: 'text'
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };

/*
    sample post

    userId: "60cc4504c4b9e6224c10a236",
    content: "This is my first post here. Checking to see if things work.",
    caption: "",
    images: [
        {
            imageUrl: "https://avatars.dicebear.com/api/jdenticon/124.svg",
            altText: "Dicebear avatar"
        }
    ],
    likes: [],
    comments: [],
    hashtags: ["newbee", "testing"]
*/