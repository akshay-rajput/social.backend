const mongoose = require("mongoose");
const { Schema } = mongoose;
require('mongoose-type-url');

// comments are used to generate jsdoc

/** 
 * {    
 *      <br>&nbsp;&nbsp; linkType: String,
 *      <br>&nbsp;&nbsp; url: url
 * <br>
 * }
*/
const linkSchema = new Schema({
    linkType: {
        type: String
    },
    url: {
        type: mongoose.SchemaTypes.Url,
        message: "Url format is wrong" 
    }
})

/** 
 * {    
 *      <br>&nbsp;&nbsp; id: ObjectId, 
 *      <br>&nbsp;&nbsp; name: min 2 chars, required,
 *      <br>&nbsp;&nbsp; email: unique, required,
 *      <br>&nbsp;&nbsp; username: unique, min 2 chars, required,
 *      <br>&nbsp;&nbsp; password: min 6 chars, required,
 *      <br>&nbsp;&nbsp; bio: string, 
 *      <br>&nbsp;&nbsp; links: [linkSchema, ..],
 *      <br>&nbsp;&nbsp; location: string,
 *      <br>&nbsp;&nbsp; avatarUrl: url,
 *      <br>&nbsp;&nbsp; createdAt: data
 * <br>
 * }
*/
const userSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: "User cannot be added without a name",
        minLength: [2, "Name should be atleast 2 character long"] 
    },
    email: {
        type: String,
        unique : true,
        required: "User cannot be added without an email" 
    },
    username: {
        type: String,
        unique : true,
        required: "Username required", 
        minLength: [2, "Username should be atleast 2 character long"] 
    },
    password: {
        type: String,
        required: "User cannot be added without password",
        minLength: [6, "Password should be atleast 6 character long"]
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    links: [
        {
          type: linkSchema
        }
    ],
    avatarUrl: {
        type: mongoose.SchemaTypes.Url,
        message: "Avatar needs a proper url"
    }
},
{
    timestamps: true,
});

// index for search
userSchema.index({
    username: 'text',
    name: 'text',
});

const User = mongoose.model("User", userSchema);

module.exports = { User };


/*
    sample user json

    "name": "akshay",
    "email": "ak@ak.com",
    "username": "akshay_here",
    "password": "tester",
    "bio": "Frontend developer, learning @NeogCamp",
    "location": "India",
    "links": [
        {
            "linkType": "Blog",
            "url": "https://myblog.io"
        },
        {
            "linkType": "Twitter",
            "url": "https://myblog.io"
        }
    ],
    "avatarUrl": "https://avatars.dicebear.com/api/jdenticon/124.svg"

*/