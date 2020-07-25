const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var cartItemSchema = new Schema({

    user_id: Schema.Types.ObjectId,
    menu_item_id: Schema.Types.ObjectId,
    item_quantity: {
        type: Number,
        default: 1
    },
    added: {
        type: Boolean,
        default: true
    },
    saved_for_later: {
        type: Boolean,
        default: false
    },
    removed: {
        type: Boolean,
        default: false
    },
    created_at: Date

});

module.exports = mongoose.model("CartItem", cartItemSchema);