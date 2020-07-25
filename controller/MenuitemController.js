const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const baseController = require("./BaseController");
var fs = require("fs");
var multer = require("multer");
var serverurl = "http://localhost:8001/";


const menuItemService = require("../services/MenuitemService")

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'E://PIZZA MANIA//ItemImages');
        },
        filename: function (req, file, cb) {
            // console.log(req, '..', file)
            var name = file.fieldname + "__" + Date.now() + "." + file.mimetype.substring(6)
            cb(null, name)
        }
    })
})

const uploads = upload.single('myImage')

// const uploadImage = async (req, res, next) => {
//     let errMsg = "file-not-uploaded";
//     let errCode = 404;
//     var files = req.file
//     if (!files) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next(error)
//     }
//     else if (files.mimetype === "image/jpeg" || files.mimetype === "image/png" || files.mimetype == "image/jpg") {
//         // console.log(files)
//         errMsg = "file-uploaded", errCode = 0;

//         res.send(baseController.generateResponse(errCode, errMsg, { file_path: serverurl + "ItemImages/" + files.filename }));

//     }
//     else {
//         res.send(baseController.generateResponse(errCode, errMsg));
//     }
// }


const addMenuItem = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let foodName = req.body.food_name
    let price = req.body.price
    let description = req.body.description
    let listPriority = req.body.list_priority

    var files = req.file
    if (!files) {
        errCode = 400;
        errMsg = 'Please upload a an Image';
        res.send(baseController.generateResponse(errCode, errMsg));
    }
    else if (files.mimetype === "image/jpeg" || files.mimetype === "image/png" || files.mimetype == "image/jpg") {
        if (foodName && price) {
            let createitem = await menuItemService.create({
                food_name: foodName,
                price: price,
                description: description,
                list_priority: listPriority,
                created_at: new Date(),
                image: "E:/PIZZA MANIA/ItemImages/" + files.filename
            }).catch(e => next(e))



            if (createitem && JSON.stringify(createitem) !== '{}') {
                errMsg = "success";
                errCode = 0;
                res.send(baseController.generateResponse(errCode, errMsg, { food_item: createitem }));
            }
            else {
                res.send(baseController.generateResponse(errCode, errMsg));
            }
        }
        else {
            errMsg = "input-parameter-not-found"
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    }
    else {
        errMsg = 'Please upload a an Image';
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}

const getMenuItemList = async (req, res, next) => {

    let errMsg = "not-found";
    let errCode = 404;

    let menuItemList = await menuItemService.get({ removed: false }).catch(e => next(e))
    if (menuItemList && menuItemList.length > 0) {

        errMsg = "success";
        errCode = 0;
        res.send(baseController.generateResponse(errCode, errMsg, { menu_items: menuItemList }));
    }
    else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}



module.exports = {
    addMenuItem,
    getMenuItemList,
    uploads
}