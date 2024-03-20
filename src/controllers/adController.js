const Ad = require("../models/admodel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

exports.postAd = catchAsyncError(async (req, res, next) => {
   try {
    const { adbanner } = req.body;
  
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }
  
    if (req.file) {
      adbanner = `${process.env.BACKEND_URL}/uploads/Ads/${req.file.originalname}`;
    }
  
    const adimage = await Ad.create({
      adbanner,
    });
  
    res.status(200).json({
        message:"success",adimage
    })
   } catch (error) {
    res.status(500).send({
        message:error.message
    })
   }
  });

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteAd = catchAsyncError(async (req, res, next) => {
    try {
        const adimgae = await Ad.findById(req.params.id);
        if (!adimgae) {
          return next(
            new ErrorHandler(`User not found with this id ${req.params.id}`)
          );
        }
        await user.deleteOne();
        res.status(200).json({
          success: true,
        }); 
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
  });
//Update ad - /api/v1/update
exports.updateAd = catchAsyncError(async (req, res, next) => {
    let newUserData = {
    };
  
    let adbanner;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }
  
    if (req.file) {
      adbanner = `${BASE_URL}/uploads/Ads/${req.file.originalname}`;
      newUserData = { ...newUserData, adbanner };
    }
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      user,
    });
  });

exports.getAllimgaes = catchAsyncError(async (req, res, next) => {
    const images = await Ad.find();
    res.status(200).json({
      success: true,
      images,
    });
  });