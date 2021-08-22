let express = require('express');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const bcrypt = require ('bcrypt');
let router = express.Router();

// users route
router.route('/')
.post(async function(req, res){
    try{
        const userData = req.body;

        let foundUser = await User.findOne({
            email: userData.email,
        })

        // console.log('foundUser: ', foundUser);
        if(foundUser){
            let secret = process.env.SECRETKEY;
            let token = jwt.sign({ userId: foundUser._id, username: foundUser.name}, secret, { expiresIn: '24h' })

            const validPassword = await bcrypt.compare(userData.password, foundUser.password);

            if (validPassword) {
                
                foundUser.password = null;

                res.status(200).json({
                    success: true,
                    message: 'User login successful',
                    user: foundUser,
                    token: token
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'User credentials wrong.',
                    user: {},
                })
            }

        }else{
            res.status(400).json({
                success: false,
                message: 'User credentials are wrong',
                user: {}
            })
        }
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Cannot login user'
        })
    }
})


module.exports = router;