var express = require("express");

var router = express.Router();


const userController = require("./controller/UserController");
const menuItemController = require("./controller/MenuitemController");
const cartController = require("./controller/CartItemController")
const paymentController = require("./controller/PaymentController")
const emailController = require("./controller/EmailController")


const authorization = require("./authorization");

/**User Routes */

router.post("/user/register", userController.signUp)
router.post("/user/login", userController.signIn)
router.get("/user/details", authorization.verifyToken, userController.getUser)
router.post("/user/edit-info", authorization.verifyToken, userController.editUserInfo)

router.get("/user/logout", authorization.verifyToken, userController.signOut)


/**Menu Routes*/

router.post("/menu/create", menuItemController.uploads, menuItemController.addMenuItem)
router.get("/menu/list", menuItemController.getMenuItemList)


/**Cart Routes */

router.post("/cart/add-item", authorization.verifyToken, cartController.addMenuItem)
router.post("/cart/remove-item", authorization.verifyToken, cartController.removeMenuItem)
router.post("/cart/change-quantity", authorization.verifyToken, cartController.changeItemQuantity)
router.post("/cart/save-for-later", authorization.verifyToken, cartController.saveMenuItemForLater)
router.get("/cart/list-items", authorization.verifyToken, cartController.getCartItems)

router.get("/cart/get-bill", authorization.verifyToken, cartController.getBilling)




/**Payment */

router.get("/pmt/init", authorization.verifyToken, paymentController.initPayment)


/**Email */

router.post("/email/send", authorization.verifyToken, emailController.sendMail)



module.exports = router;