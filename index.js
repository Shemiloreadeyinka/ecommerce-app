const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/dbconfig');
const cookieParser = require('cookie-parser');

const app = express();
connectDB()
const PORT= process.env.PORT || 3000;
app.use(cookieParser())


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/users', require("./routes/userRoutes"))
app.use('/cart', require("./routes/cartRoute"))
app.use('/categories', require("./routes/categoryRoute"))
app.use('/products', require("./routes/productRoute"))
app.use('/orders', require("./routes/ordersRoute"))


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status||500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app; 
