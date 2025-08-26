const express= require('express');
const router = express.Router();
const authentication = require('../middleware/authMiddleware');
const Authorization = require('../middleware/adminMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dotenv = require('dotenv');
dotenv.config();
const { register, login, getAllUsers, getOneUser, deleteUser,updateUser } = require('../controller/userController');

router.post('/register', upload.single('pfp'), register);
router.post('/login', login);
router.delete('/:id', authentication, deleteUser);
router.get('/', authentication, Authorization, getAllUsers);
router.patch("/:id", upload.single("pfp"), updateUser); 
router.get('/:id', authentication, getOneUser);

module.exports = router;