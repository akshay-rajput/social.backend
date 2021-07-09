let express = require('express');
const { Post } = require('../models/post.model');
const {extend} = require('lodash')
let router = express.Router();

// posts route
router.route('/')
.get(async function(req, res){
    try{
        const allPosts = await Post.find({}).populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ]);

        res.status(200).json({
            success: true,
            posts: allPosts
        })
        
    }catch{ error => {
            res.status(500).json({
                success: false,
                error,
                message: 'Cannot get posts'
            })
        }
    }

}).post(async function(req, res){
    try{
        const post = req.body
        
        // console.log('post: ', post)
        const newPost = new Post(post);
        // console.log('newPost is : ', newPost)
        const savedPost = await newPost.save()

        res.status(200).json({
            success: true,
            message: "Post created successfully!",
            post: savedPost
        })
    }catch(error){
        console.log('\n error:', error + '\n')
        res.status(500).json({
            success: false,
            message: 'Cannot add post',
            error: error
        })
    }
})

// middleware for RUD ops for single post
router.param("postId", async (req, res, next, postId) => {
    try{
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        let fullPost = await post.populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ]).execPopulate();

        // set post inside req object to use below 
        req.post = post;
        req.fullPost = fullPost;
        next();
    }
    catch(error){
        res.status(400).json({
            success: false,
            error,
            message: "Error getting post, please check your request"
        })
    }
})

// single post
router.route('/:postId')
.get((req, res) => {
    // take post out of req object
    let {fullPost} = req

    res.status(200).json({
        success: true,
        post: fullPost
    })
    
})
.post(async (req, res) => {
    // the post date passed by client
    const postUpdate = req.body

    // the post which was found by id
    let {post} = req

    post = extend(post, postUpdate)

    try{
        post = await post.save()

        let fullPost = await post.populate([{path: 'publisher likes.likedByUser comments.commentByUser', model: "User", select:["_id","name","username", "avatarUrl"]} ]).execPopulate();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: fullPost
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message: "Error while saving post"
        })
    }
})
.delete(async (req, res) => {
    let {post} = req
    
    try{
        await post.remove()
        res.status(200).json({
            success: true,
            deleted: true,
            message: "Post deleted successfully!",
            post
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message: "Error while deleting post"
        })
    }
})

module.exports = router;