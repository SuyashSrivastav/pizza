const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const baseController = require("./BaseController");


const menuItemService = require("../services/MenuitemService")
const cartItemService = require("../services/CartitemService")


const addMenuItem = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id
    let menuItemId = req.body.menu_item_id
    let quantity = req.body.quantity ? req.body.quantity : 1

    let menuItemData = await menuItemService.get({ _id: menuItemId, removed: false }).catch(e => next(e))

    if (menuItemData && menuItemData.length > 0) {

        let addToCart = await cartItemService.create({
            user_id: userId,
            menu_item_id: menuItemData[0]._id,
            quantity: quantity,
            created_at: new Date()
        }).catch(e => next(e))

        if (addToCart && JSON.stringify(addToCart) !== '{}') {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg));
        }
        else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const removeMenuItem = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id
    let menuItemId = req.body.menu_item_id

    if (ObjectId.isValid(menuItemId)) {

        let removeFromCart = await cartItemService.update({ user_id: userId, menu_item_id: menuItemId }, { $set: { removed: true } }).catch(e => next(e))

        if (removeFromCart && removeFromCart.nModified == 1) {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg));
        }
        else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const saveMenuItemForLater = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id
    let menuItemId = req.body.menu_item_id

    if (ObjectId.isValid(menuItemId)) {

        let removeFromCart = await cartItemService.update({ user_id: userId, menu_item_id: menuItemId }, { $set: { saved_for_later: true } }).catch(e => next(e))

        if (removeFromCart && removeFromCart.nModified == 1) {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg));
        }
        else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const changeItemQuantity = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id
    let menuItemId = req.body.menu_item_id
    let newQuantity = req.body.new_quantity
    if (ObjectId.isValid(menuItemId) && newQuantity) {

        let updateQuantity = await cartItemService.update({ user_id: userId, menu_item_id: menuItemId }, { $set: { item_quantity: newQuantity } }).catch(e => next(e))

        if (updateQuantity && updateQuantity.nModified == 1) {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg));
        }
        else {
            errMsg = "update-fail";
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const getCartItems = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id

    if (ObjectId.isValid(userId)) {

        let cartData = await cartItemService.getCartItems({ user_id: ObjectId(userId), removed: false, saved_for_later: false }).catch(e => next(e))

        if (cartData && cartData.length > 0) {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg, { cart_items: cartData }));
        }
        else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const getBilling = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let userId = req.user_data.id

    if (ObjectId.isValid(userId)) {

        let cartData = await cartItemService.getCartBilling({ user_id: ObjectId(userId), removed: false, saved_for_later: false }).catch(e => next(e))

        if (cartData && cartData.length > 0) {
            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg, { bill: cartData[0] }));
        }
        else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

module.exports = {
    getCartItems,
    changeItemQuantity,
    removeMenuItem,
    addMenuItem,
    saveMenuItemForLater,
    getBilling
}


