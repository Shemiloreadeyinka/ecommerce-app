const express= require('express');
const router = express.Router();
const authentication = require('../middleware/authMiddleware');
const Authorization = require('../middleware/adminMiddleware');
const { register, login, Delete, getAllUsers, getOneUser } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:id', authentication, Delete);
router.get('/getusers',authentication,Authorization, getAllUsers);
router.get('/getuser', authentication, getOneUser);

module.exports = router;