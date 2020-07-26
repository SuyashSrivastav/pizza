var api_key = require("../config/apikey").api_key
var domain = require("../config/domain").domain;
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

const baseController = require("./BaseController");
const OrderService = require("../services/OrderService");
const emailService = require("../services/EmailService")
const { ObjectId } = require('mongodb');


const sendMail = async (req, res, next) => {

    let errMsg = "not-possible";
    let errCode = 404;

    let order_id = req.body.order_id


    let orderData = await OrderService.getDetail({ _id: ObjectId(order_id) }).catch(e => next(e))

    if (orderData && orderData.length > 0 && orderData[0].user_email) {

        let items = []
        for (var i in orderData[0].menu_items) {
            items.push({
                Item: orderData[0].menu_items[i].name,
                Quantity: orderData[0].menu_items[i].quantity,
                //  Price: orderData[0].menu_items[i].price
            })
        }

        // console.log(JSON.stringify(items).replace(/[{()}]/g, '').replace(/[\[\]']+/g, ''))

        var data = {
            from: 'Pizza Hub! <suyash.srivastava@opalina.in>',
            to: orderData[0].user_email,
            subject: 'Pizza order with billing.',
            text: 'The details of your Pizza Hub order are: ' + '\n' + '\n'
                + JSON.stringify(items).replace(/[{()}]/g, '').replace(/[\[\]']+/g, '') + '\n' +
                'with a total amount of ₹ ' + orderData[0].amount + '\n' + 'It will be dilivered soon..' + '\n' + '\n' + 'Enjoy your meal with Pizza Hub!'
        };

        let emaildata = await new Promise((resolve, reject) => {
            mailgun.messages().send(data, function (error, body) {
                if (error) {
                    reject(error)
                    res.send(baseController.generateResponse(errCode, errMsg, { error: error }));
                }
                else {
                    resolve(body)
                }
            });
        });

        if (emaildata.id) {
            let emailcreated = await emailService.create({
                user_id: orderData[0].user_id,
                email: orderData[0].user_email,
                id: emaildata.id,
                message: emaildata.message,
                created_at: new Date()
            })

            errMsg = "success";
            errCode = 0;
            res.send(baseController.generateResponse(errCode, errMsg, { email_data: emailcreated }));
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
    sendMail
}