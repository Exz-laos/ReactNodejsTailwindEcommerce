

// const stripe = require('../../config/stripe');
// const userModel = require("../../models/userModel");

// const paymentController = async (request, response) => {
//     try {
//         const { cartItems } = request.body;

//         console.log("CartItems", cartItems);

//         // Find the user in the database using the userId from the request
//         const user = await userModel.findOne({
//             _id: request.userId
//         });

//         // Define parameters for creating a Stripe checkout session
//         const params = {
//             submit_type: 'pay',
//             mode: 'payment',
//             payment_method_types: ['card'],
//             billing_address_collection: 'auto',
//             shipping_options: [
//                 {
//                     shipping_rate: 'shr_1PszEyP0fi1YZUTAC48wB25E'
//                 }
//             ],
//             customer_email: user.email,
//             line_items: cartItems.map((item) => {
//                 return {
//                     price_data: {
//                         currency: 'lak',
//                         product_data: {
//                             name: item.productId.productName,
//                             images: item.productId.productImage,
//                             metadata: {
//                                 productId: item.productId._id
//                             }
//                         },
//                         unit_amount: item.productId.sellingPrice * 100 // Ensure the amount is in cents
//                     },
//                     adjustable_quantity: {
//                         enabled: true,
//                         minimum: 1
//                     },
//                     quantity: item.quantity
//                 }
//             }),
//             success_url: `${process.env.FRONTEND_URL}/success`, // Corrected spelling
//             cancel_url: `${process.env.FRONTEND_URL}/cancel`,   // Corrected spelling
//         };

//         // Create a Stripe checkout session with the defined parameters
//         const session = await stripe.checkout.sessions.create(params);
        
//         // Send a response with the session object and a 303 status code
//         response.status(303).json(session);

//     } catch (error) {
//         // Send a JSON response with the error message if an error occurs
//         response.json({
//             message: error?.message || error,
//             error: true,
//             success: false
//         });
//     }
// };

// module.exports = paymentController;



const stripe = require('../../config/stripe');
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body;
        console.log("CartItems", cartItems);

        const user = await userModel.findOne({
            _id: request.userId
        });

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: 'shr_1PszEyP0fi1YZUTAC48wB25E'
                }
            ],
            customer_email: user.email,
            line_items: cartItems.map((item) => {
                return {
                    price_data: {
                        currency: 'lak',
                        product_data: {
                            name: item.productId.productName,
                            // Filter out empty image URLs
                            images: item.productId.productImage.filter(image => image && image.trim() !== ''),
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        // Ensure unit_amount is an integer
                        unit_amount: Math.round(item.productId.sellingPrice * 100)
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                };
            }),
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);
        response.status(303).json(session);
    } catch (error) {
        response.json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = paymentController;

