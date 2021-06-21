let express = require('express');
// const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Follow } = require('../models/follow.model');
let router = express.Router();

router.route('/')
.get(async function(req, res){
    // check if main feed or profile feed
    let showHomeFeed = req.headers.showhomefeed;
    let userId = req.headers.userid;

    if(showHomeFeed){
        try{
            // all posts for user feed
            let userFeedPosts = []

            let followData = await Follow.find({ userId: userId });

            let followList = [];
            followData.map(data => followList.push(data.follows));
            
            let promisesOfFollowingPosts = followList.map(async (following) => {
                try{
                    let followingPosts = await Post.find({publisher: following})
                                        .populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ])
                                        .sort({createdAt: -1});
                
                    // array of all posts
                    if(followingPosts.length > 0){
                        userFeedPosts.push(followingPosts);
                    }
                }
                catch(err){
                    console.log('error while getting follow posts - ', err.message);
                    res.status(400).json({
                        success: false,
                        message: "Error while getting posts.",
                        error: err.message
                    })
                }
                
            })

            await Promise.all(promisesOfFollowingPosts);

            // all followed users
            // const cursor = await Follow.find({ userId: userId }).cursor();

            // // for each followed user
            // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                
            //     // find posts of the user that is followed
            //     // let followPosts = await Post.find({publisher: doc.follows})
            //     //                         .populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ])
            //     //                         .sort({createdAt: -1});
                
            //     // console.log('followedPost: ', followPosts);
            //     userFeedPosts.push(
            //         
            //     );
            //     // userFeedPosts.push(followPosts);
            // }

            console.log('userFeed: ', userFeedPosts);

            res.status(200).json({
                success: true,
                message: "Fetched user feed",
                feedLength: userFeedPosts.length,
                posts: userFeedPosts
            })
            
        }catch{ error => {
                res.status(500).json({
                    success: false,
                    message: 'Cannot get posts',
                    error: error.message,
                })
            }
        }
    }
    else{
        try{
            // const profilePosts = await Post.find({userId: userId})
            const profilePosts = await Post.find({publisher: userId}).populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
    
            res.status(200).json({
                success: true,
                posts: profilePosts
            })
            
        }catch{ error => {
                res.status(500).json({
                    success: false,
                    message: 'Cannot get posts',
                    error: error.message,
                })
            }
        }
    }
})


module.exports = router;