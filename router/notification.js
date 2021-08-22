let express = require('express');
const { User } = require('../models/user.model');
const { Notification } = require('../models/notification.model');
const {extend} = require('lodash');
let router = express.Router();

router.route('/')
.get(async function(req, res){
    let userId = req.headers.userid;
    try{
        // get all notifications of a user
        if(userId){
            let notifications = await Notification.find({ notificationTo: userId })
            .populate([{path: 'notificationFrom notificationTo', model: "User", select:["_id","name","username", "avatarUrl"]} ]);
        
            res.status(200).json({
                success: true,
                message: 'Fetched notifications for user',
                notifications: notifications
            })
        }
        else{
            res.status(400).json({
                success: false,
                message: 'Need userid to get notification'
            })
        }

    }
    catch(error){
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Cannot get notification for user'
        })
    }
})
.post(async function(req, res){
    let notificationData = req.body;

    let markAllRead = req.headers.markallread;
    let userId = req.headers.userid;

    if(markAllRead){
        // update all notifications of this user
        try{
            await Notification.updateMany({"notificationTo": userId}, {"$set":{"markedAsRead": true}});
            
            res.status(200).json({
                success: true,
                message: "All notifications marked read!"
            });
        }
        catch(error){
            console.log('error updating all notifications');
            res.status(400).json({
                success: false,
                message: "Error updating notifications!",
                error: error.message
            });
        }
    }
    else{
        // create notification
        try{
            const newNotification = new Notification(notificationData);
    
            const savedNotification = await newNotification.save();
    
            res.status(200).json({
                success: true,
                message: "Notification created successfully!",
                notification: savedNotification
            })
        }
        catch(err){
            console.log('Error creating notification: ', err.message);
            res.status(400).json({
                success: false,
                message: "Problem creating notification",
                error: err.message
            })
        }
    }
})

router.route('/:notificationId')
.post(async (req, res) => {
    let notificationData = req.body;
    let notificationId = req.params.notificationId;
    
    try{
        // the notification which was found by id
        let notification = await Notification.findById(notificationId);

        notification = extend(notification, notificationData);

        notification = await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            notification
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
            message: "Error while saving notification"
        })
    }
    
})
module.exports = router;