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
                    console.log('following publisher: ', userId);
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
            
            // add user's posts to feed
            let userOwnPosts = await Post.find({publisher: userId})
            .populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ])
            .sort({createdAt: -1});

            if(userOwnPosts?.length > 0){
                userFeedPosts.push(userOwnPosts)   
            }

            userFeedPosts = userFeedPosts.flat(2);
            
            userFeedPosts.sort((post, nextPost) => nextPost.createdAt - post.createdAt);
            
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
    
			profilePosts.sort((post, nextPost) => nextPost.createdAt - post.createdAt);
			
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