const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Endpoint to process payment
exports.processPayment = catchAsyncError(async (req, res, next) => {
    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment" },
        shipping: req.body.shipping
    });

    // Send back the client secret of the PaymentIntent to the client
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    });
});

// Endpoint to send the Stripe API key
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
    // Send the Stripe API key to the client
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});

