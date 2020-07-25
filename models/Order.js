const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var OrderSchema = new Schema({

    user_id: Schema.Types.ObjectId,
    menu_items: [{
        item_id: Schema.Types.ObjectId,
        quantity: Number,
        name: String,
        price: Number,
        description: String
    }],
    amount: Number,
    timestamp: Date,
    updated_at: Date,
    status: String,
    description: String

});

module.exports = mongoose.model("Order", OrderSchema);