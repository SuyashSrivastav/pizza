const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var menuItemSchema = new Schema({

    food_name: String,
    price: Number,
    description: String,
    image: String,
    list_priority: {
        type: Number,
        default: 1
    },
    removed: {
        type: Boolean,
        default: false
    },
    created_at: Date

});

module.exports = mongoose.model("MenuItem", menuItemSchema);