const Order = require("../models/Order")

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Order.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => {
    new Promise((resolve, reject) => {
        where = where || {};
        Order.countDocuments(where)
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });
}

const update = async (where, acObj) => new Promise((resolve, reject) => {

    Order.where(where).updateOne(acObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (acObj) => new Promise((resolve, reject) => {
    var order = new Order(acObj);
    order
        .save()
        .then(Order => resolve(Order))
        .catch(e => reject(e));
});


const getDetail = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Order.aggregate([
        { $match: where },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $project: {
                user_id: 1,
                menu_items: 1,
                amount: 1,
                user_name: { $arrayElemAt: ['$users.name', 0] },
                user_email: { $arrayElemAt: ['$users.email', 0] },
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
    getDetail
}