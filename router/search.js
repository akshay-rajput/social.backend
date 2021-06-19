let express = require('express');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
let router = express.Router();

// users route
router.route('/')
.get(async function(req, res){
    try{
        const searchString = req.query.q;

        let postsFound = [];
        let usersFound = [];

        // find users & posts with that query
        // await User.find({"username": { "$regex": searchString, "$options": "i" }})
        //     .limit(5)
        //     .exec( function(err, docs) { 
        //         if(err){
        //             console.log('Error finding users > ', err);
        //         }
        //         else{
        //             console.log('users: ', docs);

        //             if(docs.length > 0){
        //                 usersFound = docs;
        //             }
        //         }             
        // });
        
        usersFound = await User.find({"username": { "$regex": searchString, "$options": "i" }}).limit(5);

        postsFound = await Post.find({$text: {$search: searchString}}).limit(5);
        // await Post.find({$text: {$search: searchString}})
        //     .limit(5)
        //     .exec(await function(err, docs) { 
        //         if(err){
        //             console.log('Error finding posts > ', err);
        //         }
        //         else{
        //             console.log('posts: ', docs.length);

        //             if(docs.length > 0){
        //                 postsFound = docs;
        //             }
        //         } 
        // });

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