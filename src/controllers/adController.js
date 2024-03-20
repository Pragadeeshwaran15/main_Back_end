const Ad = require("../models/admodel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

exports.postAd = catchAsyncError(async (req, res, next) => {
  
  try {
  let adbanner;
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    adbanner = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  const banner = await Ad.create({
    
    adbanner  });


    // Send success response with the created ad image data
    res.status(200).json({
      message: 'Success',
      banner,
    });
  } catch (error) {
    // Handle any errors that occur during ad creation
    console.error('Error creating ad:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
})

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteAd = catchAsyncError(async (req, res, next) => {
    try {
        const adimgae = await Ad.findById(req.params.id);
        if (!adimgae) {
          return next(
            new ErrorHandler(`User not found with this id ${req.params.id}`)
          );
        }
        await Ad.deleteOne();
        res.status(200).json({
          success: true,
        }); 
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
  });
exports.getAllimgaes = catchAsyncError(async (req, res, next) => {
    const images = await Ad.find();
    res.status(200).json({
      success: true,
      images,
    });
  });