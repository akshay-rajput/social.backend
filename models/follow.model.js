const mongoose = require("mongoose");
const { Schema } = mongoose;

const followSchema = new Schema({
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "Need userId to set follows"
  },
  follows: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "Need id of user to be followed"
  }

});

const Follow = mongoose.model("Follow", followSchema);

module.exports = { Follow };