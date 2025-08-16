const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/dbconfig');

const app = express();
connectDB()
const PORT= process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.json());
app.use('/users', require("./routes/userRoutes"))
app.use('/cart', require("./routes/cartRoute"))
app.use('/categories', require("./routes/categoryRoute"))
app.use('/products', require("./routes/productRoute"))
app.use('/orders', require("./routes/ordersRoute"))


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(error.status||500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app; 
