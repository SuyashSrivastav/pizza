const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var emailSchema = new Schema({

    user_id: Schema.Types.ObjectId,
    gateway: {
        type: String,
        default: "mailgun"
    },
    id: String,
    message: String,
    created_at: Date

});

module.exports = mongoose.model("Email", emailSchema);