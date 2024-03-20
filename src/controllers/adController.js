const Ad = require("../models/admodel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// Define the postAd controller function
exports.postAd = catchAsyncError(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let adbanner = ''; // Initialize adbanner variable

    // Check if there's a file uploaded
    if (req.file) {
      // Construct the adbanner URL using the backend URL and file name
      adbanner = `${process.env.BACKEND_URL}/uploads/Ads/${req.file.originalname}`;
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