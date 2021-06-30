let express = require('express');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
let router = express.Router();

// search route
router.route('/')
.get(async function(req, res){
    try{
        const searchString = req.query.q;

        let postsFound = [];
        let usersFound = [];

        usersFound = await User.find({"username": { "$regex": searchString, "$options": "i" }}).limit(5);

        postsFound = await Post.find({$text: {$search: searchString}}).limit(5).populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ]);

        if(usersFound?.length > 0 || postsFound?.length > 0){
            res.status(200).json({
                success: true,
                queryPassed: searchString,
                message: 'Search Results found',
                users: usersFound,
                posts: postsFound
            })
        }
        else{
            res.status(200).json({
                success: false,
                queryPassed: searchString,
                message: 'No users or posts with that query',
                users: [],
                posts: []
            })
        }

    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Cannot perform search'
        })
    }
})


module.exports = router;