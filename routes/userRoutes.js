const express= require('express');
const router = express.Router();
const authentication = require('../middleware/authMiddleware');
const Authorization = require('../middleware/adminMiddleware');
const { register, login, getAllUsers, getOneUser, deleteUser } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.delete('/:id', authentication, deleteUser);
router.get('/',authentication,Authorization, getAllUsers);
router.get('/:id', authentication, getOneUser);

module.exports = router;