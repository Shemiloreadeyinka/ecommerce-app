const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/dbconfig');

const app = express();
connectDB()
const PORT= process.env.PORT || 3000;

app.use(express.json());
app.get('/user', require("./routes/userRoutes"))
app.get('/cart', require("./routes/cartRoute"))
app.get('/category', require("./routes/categoryRoute"))
app.get('/product', require("./routes/productRoute"))
app.get('/orders', require("./routes/ordersRoute"))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})