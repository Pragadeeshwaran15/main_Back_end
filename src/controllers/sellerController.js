const Product = require('../models/productModel');
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require("../utils/errorHandler");
const Seller=require("../models/sellerModel")
const sendEmail = require("../utils/email");
const User=require("../models/userModel")

//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next)=>{
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

  
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})

//Delete Product - api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })

})

// get seller products  - api/v1/admin/products
exports.getSellerProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
});


// get information about the seller
exports.sellerRegister=catchAsyncError(async(req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        
        const { shopname, brand,email, address,country,state,city,pincode,phone } = req.body;
        let sellerUser=await Seller.findOne({ email: email });
        if(!sellerUser){
    const info = await Seller.create({
        shopname, brand,email, address,country,state,city,pincode,phone
    });
    const message = `<h1>Welcome to ShoppingGo Seller Service</h1><br><br>
    <P> Hi there,Thanks for register in ShoppingGo seller Service You Registeration is allmost completed 
       you information has been recevied and once Validations process is completed you will become our trustable seller...
    </p>
<br><br> <span>This Process take 3 to 4 days and our agent will call you for verification soon</span>`;

    sendEmail({
      email: user.email,
      subject: "ShoppingGo Seller Verification Mail",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
      info
    })}
    else{
        res.status(400).send({
            message:` The Email ID ${sellerUser.email} is already exists!!`
        })
    }
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
})

//get the stored info from database
exports.getAllSellers = catchAsyncError(async (req, res, next) => {
   try {
    const sellers = await Seller.find();
    res.status(200).json({
      success: true,
      sellers,
    });
   } catch (error) {
    res.status(500).send({
        message:error.message
    })
   }
  });
  
  
exports.Reject = catchAsyncError(async (req, res, next) => {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return next(
        new ErrorHandler(`User not found with this id ${req.params.id}`)
      );
    }
    await seller.deleteOne();
    res.status(200).json({
      success: true,
    });
  });
// verification code
 exports.verified= catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const updatedSeller = await Seller.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!updatedSeller) {
        return res.status(404).json({ success: false, message: 'Seller not found' });
      }
  
      res.status(200).json({ success: true, seller: updatedSeller });
    } catch (error) {
      console.error('Error updating seller status:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });