const mongoose = require("mongoose");
const { Schema } = mongoose;

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