const Ad = require("../models/admodel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

exports.postAd = catchAsyncError(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let adbanner = ''; // Initialize adbanner variable
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get("host")}`;
    }
    // Check if there's a file uploaded
    if (req.files && req.files.length > 0) {
      // Assuming req.files is an array of uploaded files
      adbanner = req.files.map(file => `${BASE_URL}/uploads/Ads/${file.originalname}`);
    } else {
      // If no file is uploaded, use the adbanner value from the request body
      adbanner = req.body.adbanner;
    }

    // Create a new ad record in the database
    const adimage = await Ad.create({
      adbanner,
    });

    // Send success response with the created ad image data
    res.status(200).json({
      message: 'Success',
      adimage,
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