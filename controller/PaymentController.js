const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const baseController = require("./BaseController");

const stripe = require('stripe')('sk_test_51H8qO7AtOYNsdEbHoHLco4JXyqIXUxmUTGy5dkrGs5FUhaes5A55CiYn2zAI3gdTUSGkPpB2o3fDjDcg3IeBbwO300rFldfNcw');


const cartItemService = require("../services/CartitemService")
const OrderService = require("../services/OrderService")

/*Payament here */
const initPayment = async (req, res) => {

    let errMsg = "payment-init-error", errCode = 404;
    var userId = req.user_data.id;

    let cartData = await cartItemService.getCartBilling({ user_id: ObjectId(userId), removed: false, saved_for_later: false }).catch(e => next(e))

    if (cartData && cartData.length > 0) {


        var orderObj = {
            user_id: userId,
            menu_items: cartData[0].menu_items,
            amount: cartData[0].total_amount,
            timestamp: new Date(),
            status: "PENDING"
        }

        var orderInfo = await OrderService.create(orderObj).catch(e => { console.log(e) });
        if (orderInfo && JSON.stringify(orderInfo) !== '{}') {

            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(cartData[0].total_amount),
                currency: 'inr',
                // Verify your integration in this guide by including this parameter
                metadata: { integration_check: 'accept_a_payment' },
            });

            if (paymentIntent) {
                res.send(baseController.generateResponse(errCode, errMsg, { payment_intent: paymentIntent }));
            }

        } else {
            res.send(baseController.generateResponse(errCode, errMsg));
        }
    } else {
        res.send(baseController.generateResponse(errCode, errMsg));
    }
}



module.exports = {
    initPayment
}