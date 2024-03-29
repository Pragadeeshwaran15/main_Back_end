const express = require('express');
const app = express();
const cors=require("cors")
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )

const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')
const payment = require('./routes/payment')
const home=require('./routes/home')
const seller=require('./routes/seller')

app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',order);
app.use('/api/v1',payment);
app.use('/api/v1',seller);
app.use('/',home);



app.use(errorMiddleware)

module.exports = app;