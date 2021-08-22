let express = require('express');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const {extend} = require('lodash')
let router = express.Router();

// users route
router.route('/')
.get(async function(req, res){
    try{
        const userList = await User.find({})

        userList.forEach(user => {
            user.password = null;
        })
        
        res.status(200).json({
            success: true,
            totalUsers: userList.length,
            users: userList
        })
        
    }catch(error){
        res.status(500).json({
            success: false,
            error,
            message: 'Cannot get users'
        })
    }

})

// top users
router.route('/top')
.get(async function(req, res){
    try{
        const allPosts = await Post.find({}).populate([{path: 'publisher', model: "User", select:["_id","name","username", "avatarUrl"]} ]);

        let groupedPosts = allPosts.reduce(
            // reducer function and empty object as initial
            (result, post) => {
                // add existing posts to group property and append current post
                result[post.publisher.name] = [...result[post.publisher.name] || [], post];
                return result;
            }, {}
        );

        let topUserData = [];
        for (const userName in groupedPosts) {
            if (Object.hasOwnProperty.call(groupedPosts, userName)) {
                const userPosts = groupedPosts[userName];
                let userData = {
                    totalPosts: userPosts.length,
                    userInfo: userPosts[0].publisher
                }
                topUserData.push(userData);
            }
        }

        topUserData.sort((user, nextUser) => nextUser.totalPosts - user.totalPosts);

        let topThreeUsers = topUserData.slice(0,3);

        res.status(200).json({
            success: true,
            topUsers: topThreeUsers,
        })
        
    }catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message: 'Cannot get top users'
        })
    }
})

// middleware for RUD ops for single user
router.param("userId", async (req, res, next, userId) => {
    try{
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next();
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message: "Error getting user, please check your request"
        })
    }
})

// single user
router.route('/:userId')
.get((req, res) => {
    // take user out of req object
    let {user} = req
    
    // dont send pwd 
    user.password = null;

    res.json({
        success: true,
        user: user
    })
    
})
.post(async (req, res) => {
    try{
        // version causing problems with update
        delete req.body.__v;
            
        // the user data passed by client
        const userUpdate = req.body

        // the user which was found by id
        let {user} = req

        // overwrite null from request
        userUpdate.password = user.password;

        user = extend(user, userUpdate)

        user = await user.save()

        // dont send pwd
        user.password = null;

        res.json({
            success: true,
            message: "User updated successfully",
            user
        })
    }
    catch(error){
        console.log("error updating user: ", error)
        res.json({
            success: false,
            message: "Error updating user information",
            error: error.message
        })
    }
})
.delete(async (req, res) => {
    try{
        let {user} = req
        await user.remove()
        res.json({
            success: true,
            deleted: true,
            user
        })
    }
    catch(error){
        console.log("error during user delete: ", error)
        res.json({
            success: false,
            deleted: false,
            message: error.message,
            error
        })
    }
});



module.exports = router;