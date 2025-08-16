const express= require('express');
const router = express.Router();
const {createOrder,getMyOrders,getOrderById,cancelOrder,trackOrder,getAllOrders,getOrdersByUser,updateOrderStatus,updateShipping,deleteOrder}=require('../controller/ordersController')
const authentication= require('../middleware/authMiddleware')
const Authorization= require('../middleware/adminMiddleware')

router.post('/',authentication,createOrder)
router.get('/',authentication, getMyOrders )
router.get('/:_id',authentication, getOrderById)
router.patch('/:_id/cancel', authentication, cancelOrder)
router.get('/:_id/track',authentication,trackOrder)
//admin routes
router.get('/admin',authentication,Authorization,getAllOrders)                            
router.get('/admin/:userid',authentication,Authorization,getOrdersByUser)
router.patch('/admin/:orderid/status',authentication,Authorization,updateOrderStatus)
router.patch('/admin/:orderid/shipping',authentication,Authorization,updateShipping)
router.delete('/admin/:orderid',authentication,Authorization,deleteOrder)




module.exports = router;