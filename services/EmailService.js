const Email = require("../models/Email")

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    Email.find(where)
        .limit(limit)
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => {
    new Promise((resolve, reject) => {
        where = where || {};
        Email.countDocuments(where)
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });
}

const update = async (where, acObj) => new Promise((resolve, reject) => {

    Email.where(where).updateOne(acObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (acObj) => new Promise((resolve, reject) => {
    var email = new Email(acObj);
    email
        .save()
        .then(Email => resolve(Email))
        .catch(e => reject(e));
});





module.exports = {
    get,
    create,
    update,
    getCount
}