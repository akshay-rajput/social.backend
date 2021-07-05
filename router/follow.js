let express = require('express');
let router = express.Router();
const { Follow } = require('../models/follow.model');
const {extend} = require('lodash')

router.route('/')
.get(async function(req, res){
    let userId = req.headers.userid;

    if(userId){
        try{
            let followingList = await Follow.find({userId: userId}).populate([{path: 'follows', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
            let followerList = await Follow.find({follows: userId}).populate([{path: 'userId', model: "User", select:["_id","name","username", "avatarUrl"]} ]);

            console.log('Followers: ', followerList);

            res.status(200).json({
                success: true, 
                message: 'Follower data found',
                followers: followerList,
                following: followingList
            })
        }
        catch(err){
            res.status(404).json({
                success: false, 
                message: "Error getting follower data",
                error: err.message
            })
        }
    }
    else{
        res.status(404).json({
            success: false, 
            message: "Need user id to find follower data",
        })
    }
})


router.route('/:followUserId')
.post(async function(req, res){
    let userId = req.headers.userid;
    let followUserId = req.params.followUserId;

    if(userId === followUserId){
        res.status(400).json({
            success: false, 
            message: 'You cannot follow yourself'
        })
    }

    if(userId){
        let followData = {
            userId: userId,
            follows: followUserId
        }

        const newFollowData = new Follow(followData);

        try{
            followData = await newFollowData.save();

            console.log('followed: ', followData);

            // get updated data
            let followingList = await Follow.find({userId: followUserId}).populate([{path: 'follows', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
            let followerList = await Follow.find({follows: followUserId}).populate([{path: 'userId', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
        
            let userFollowingList = await Follow.find({userId: userId}).populate([{path: 'follows', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
        
            res.status(200).json({
                success: true, 
                message: 'Followed successfully',
                followers: followerList,
                following: followingList,
                userFollowingList: userFollowingList
            })
        }
        catch(err){
            res.status(400).json({
                success: false, 
                message: 'Error occured while updating follow data',
                error: err.message
            })
        }
    }
    else{
        res.status(404).json({
            success: false, 
            message: "Need user id to set follower data",
        })
    }

})
.delete(async (req, res) => {
    let userId = req.headers.userid;
    let followUserId = req.params.followUserId;

    if(userId && followUserId){
        try{
            await Follow.deleteOne({userId: userid, follows: followUserId});
            
            // await followEntry.remove();
            res.json({
                success: true,
                unfollowed: true,
                message: "Unfollowed successfully!"
            })
        }
        catch(error){
            res.json({
                success: false,
                unfollowed: false,
                message: "Error while unfollowing",
                error: error.message
            })
        }
    }
    else{
        res.json({
            success: false,
            message: "Need both users id for unfollow.",
        })
    }
})

module.exports = router