var api_key = 'ffefc4e4-4c42c01e';
var domain = 'www.mydomain.com';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

const OrderService = require("../services/OrderService");
const { ObjectId } = require('mongodb');


const sendMail = async (req, res, next) => {

    let errMsg = "not-possible";
    let errCode = 404;

    let order_id = req.body.order_id


    let orderData = await OrderService.getDetail({ _id: ObjectId(order_id) }).catch(e => next(e))

    if (orderData && orderData.length > 0) {
        var data = {
            from: 'Excited User <sandbox47bdcf383d7a457a9394534bfe2554d5.mailgun.org>',
            to: orderData[0].user_email,
            subject: 'Your Order:  ' + (orderData[0].menu_items).toString(),
            text: 'Testing some Mailgun awesomeness!'
        };
        let emaildata = new Promise((resolve, reject) => {
            mailgun.messages().send(data, function (error, body) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(body)
                }
            });
        });

        if (emaildata) {
            res.send(baseController.generateResponse(errCode, errMsg, { data: data }));
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