const mongoose = require("mongoose");
const { Schema } = mongoose;

/** 
 * {    
 *      <br>&nbsp;&nbsp; id: ObjectId, 
 *      <br>&nbsp;&nbsp; postId: ObjectId, ref-Post,
 *      <br>&nbsp;&nbsp; notificationType: like or comment,
 *      <br>&nbsp;&nbsp; markAsRead: true or false,
 *      <br>&nbsp;&nbsp; notificationTo: userId, ref - User, 
 *      <br>&nbsp;&nbsp; notificationFrom: userId, ref - User,
 *      <br>&nbsp;&nbsp; createdAt: date,
 *      <br>&nbsp;&nbsp; updatedAt: date
 * <br>
 * }
*/
const notificationSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: "Need post id for notification"
  },
  notificationType: String,
  markedAsRead: {
    type: Boolean,
    default: false
  },
  notificationTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "Need userId to send notification"
  },
  notificationFrom: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "Need id of user that is sending notification"
  }
},
{
    timestamps: true,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };

/*
    sample notification data
    {
        postId: "60cf1612793d872250688449",
        notificationType: "Like",
        markedAsRead: false,
        notificationTo: "60cc4504c4b9e6224c10a236",
        notificationFrom: "60cdcbbafa49c628944ebd1c"
    }

*/