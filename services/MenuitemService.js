const MenuItem = require("../models/MenuItem");

const get = async (where, limit) => new Promise((resolve, reject) => {
    limit = limit || 10;
    where = where || {};
    MenuItem.find(where)
        .limit(limit).sort({ list_priority: -1 })
        .exec((err, doc) => (err ? reject(err) : resolve(doc)));
});

const getCount = async (where) => {
    new Promise((resolve, reject) => {
        where = where || {};
        MenuItem.countDocuments(where)
            .exec((err, doc) => (err ? reject(err) : resolve(doc)));
    });
}

const update = async (where, acObj) => new Promise((resolve, reject) => {

    MenuItem.where(where).updateOne(acObj, (err, count) =>
        err ? reject(err) : resolve(count)
    );
});


const create = async (acObj) => new Promise((resolve, reject) => {
    var menuitem = new MenuItem(acObj);
    menuitem
        .save()
        .then(MenuItem => resolve(MenuItem))
        .catch(e => reject(e));
});


module.exports = {
    get,
    create,
    update,
    getCount
}