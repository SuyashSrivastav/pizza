const CartItem = require("../models/CartItem");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    CartItem.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => {
    new Promise((resolve, reject) => {
        where = where || {};
        CartItem.countDocuments(where)
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });
}

const update = async (where, acObj) => new Promise((resolve, reject) => {

    CartItem.where(where).updateOne(acObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (acObj) => new Promise((resolve, reject) => {
    var cartitem = new CartItem(acObj);
    cartitem
        .save()
        .then(CartItem => resolve(CartItem))
        .catch(e => reject(e));
});


const getCartItems = async (where) =>
    new Promise((resolve, reject) => {
        where = where || {};
        CartItem.aggregate([
            { $match: where },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: 'menu_item_id',
                    foreignField: "_id",
                    as: "menuitems"
                }
            },
            {
                $project: {
                    item_quantity: 1,
                    user_id: 1,
                    menu_item_id: 1,
                    menu_item_name: { $arrayElemAt: ['$menuitems.food_name', 0] },
                    menu_item_price: { $multiply: [{ $arrayElemAt: ['$menuitems.price', 0] }, '$item_quantity'] },
                    menu_item_description: { $ifNull: [{ $arrayElemAt: ['$menuitems.description', 0] }, ""] },
                    created_at: 1
                }
            },
            { $sort: { created_at: 1 } }
        ])
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });


const getCartBilling = async (where) =>
    new Promise((resolve, reject) => {
        where = where || {};
        CartItem.aggregate([
            { $match: where },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: 'menu_item_id',
                    foreignField: "_id",
                    as: "menuitems"
                }
            },
            {
                $project: {
                    item_quantity: 1,
                    user_id: 1,
                    menu_item_id: 1,
                    menu_item_name: { $arrayElemAt: ['$menuitems.food_name', 0] },
                    menu_item_price: { $multiply: [{ $arrayElemAt: ['$menuitems.price', 0] }, '$item_quantity'] },
                    menu_item_description: { $ifNull: [{ $arrayElemAt: ['$menuitems.description', 0] }, ""] },
                    created_at: 1
                }
            },
            {
                $group: {
                    _id: '$user_id',
                    total_amount: { $sum: '$menu_item_price' },
                    menu_items: { $addToSet: { item_id: '$menu_item_id', name: '$menu_item_name', price: '$menu_item_price', quantity: '$item_quantity', description: '$menu_item_description' } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    _id: 0,
                    user_id: '$_id',
                    name: { $arrayElemAt: ['$user.name', 0] },
                    address: { $ifNull: [{ $arrayElemAt: ['$user.address', 0] }, ""] },
                    email: { $ifNull: [{ $arrayElemAt: ['$user.email', 0] }, ""] },
                    total_amount: 1,
                    menu_items: 1
                }
            }
        ])
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });


module.exports = {
    get,
    create,
    update,
    getCount,
    getCartItems,
    getCartBilling
}