const express = require('express');
const { newProduct, updateProduct, deleteProduct, getSellerProducts,sellerRegister,getAllSellers,Reject ,verified} = require('../controllers/sellerController');
const { orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route("/seller/register").post(isAuthenticatedUser,sellerRegister)
router.route('/seller/product/new').post(isAuthenticatedUser, authorizeRoles('seller'), upload.array('images'), newProduct);
router.route('/seller/products').get(isAuthenticatedUser, authorizeRoles('seller'), getSellerProducts);
router.route('/seller/product/:id').delete(isAuthenticatedUser, authorizeRoles('seller'), deleteProduct);
router.route('/seller/product/:id').put(isAuthenticatedUser, authorizeRoles('seller'),upload.array('images'), updateProduct);
router.route('/seller/orders').get(isAuthenticatedUser, authorizeRoles('seller'), orders)
router.route('/seller/order/:id').put(isAuthenticatedUser, authorizeRoles('seller'), updateOrder)
                        .delete(isAuthenticatedUser, authorizeRoles('seller'), deleteOrder)
// admin Only
router.route("/seller/all").get(isAuthenticatedUser, authorizeRoles('admin'),getAllSellers)
router.route("/seller/delete/:id").delete(isAuthenticatedUser, authorizeRoles('admin'),Reject)
router.route("/seller/verified/:id").put(isAuthenticatedUser, authorizeRoles('admin'),verified)
module.exports = router;