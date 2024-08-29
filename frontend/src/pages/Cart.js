import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayKIPCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import {loadStripe} from '@stripe/stripe-js';
const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)

    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async() =>{
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })
        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }
    }
    const handleloading = async()=> {
        await fetchData()
    }
    useEffect(()=>{
        setLoading(true)
        handleloading()
        setLoading(false)
    },[])

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()


        if(responseData.success){
            fetchData()
        }
    }

    const decraseQty = async(id,qty) =>{
        if(qty >= 2){
             const response = await fetch(SummaryApi.updateCartProduct.url,{
                 method : SummaryApi.updateCartProduct.method,
                 credentials : 'include',
                 headers : {
                     "content-type" : 'application/json'
                 },
                 body : JSON.stringify(
                     {   
                         _id : id,
                         quantity : qty - 1
                     }
                 )
             })
 
             const responseData = await response.json()
 
 
             if(responseData.success){
                 fetchData()
             }
         }
     }

     const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    // const handlePayment  = async () => {
   
    //     // recreating the `Stripe` object on every render.
    //     const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    //     const response = await fetch(SummaryApi.payment.url,{
    //         method : SummaryApi.payment.method,
    //         credentials : 'include',
    //         headers : {
    //             "content-type" : 'application/json'
    //         },   
    //         body: JSON.stringify({
    //             cartItems : data
    //         })
    //      }
    //     )
    //     const responseData = await response.json()

    //     if(responseData?.id){
    //         stripePromise.redirectToCheckout({seasionId : responseData.id})
    //     }
    //     console.log("payment response: ", responseData)
    // }
   
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY); // Initialize Stripe once

const handlePayment = async () => {
    try {
        const stripe = await stripePromise; // Await for stripePromise here to get the Stripe object
        const response = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                cartItems: data
            })
        });

        const responseData = await response.json();

        if (responseData?.id) {
            // Correctly use sessionId instead of seasionId
            stripe.redirectToCheckout({ sessionId: responseData.id });
        } else {
            console.error('Error: session ID not found in response');
        }
    } catch (error) {
        console.error('Error during payment:', error);
    }
}




    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)




  return (
    <div className='container mx-auto'>
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
             {/***view product */}
             <div className='w-full max-w-3xl'>
                  {
                      loading ? (
        
                        loadingCart?.map((el,index) => {
                            return(
                                <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32  my-2 border border-slate-300 animate-pulse rounded'>
                                 
                                </div>
                                
                            )
                        })            

                    ) :(


                        // data.map((product,index)=>{
                        //     return(
                        //      <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-40 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                        //           <div className='w-40 h-40 bg-slate-200'>
                        //                <img src={product?.productId?.productImage[0]} 
                        //                className='w-full h-full object-scale-down mix-blend-multiply'/>
                        //          </div>
                        //     <div className='px-10 py-2 relative'>
                        //           {/**delete product */}
                        //           <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer'
                        //           onClick={()=>deleteCartProduct(product?._id)} >
                        //                 <MdDelete/>
                        //             </div>

                        //          {/**detail product */}
                        //          <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>
                        //             {product?.productId?.productName}</h2>

                        //          <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                        //             <div className='flex flex-col lg:flex-row justify-between'>
                        //                     <p className='text-red-600 font-medium text-lg'>
                        //                      {displayKIPCurrency(product?.productId?.sellingPrice)}</p>
                        //                     <p className='text-slate-600 font-semibold text-lg'> {displayKIPCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                        //             </div>
                                    
                        //             <div className='flex items-center gap-3 mt-1'>
                        //                 <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded '  onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                        //                 <span>{product?.quantity}</span>
                        //                 <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded '
                        //                 onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                        //             </div>
                        //      </div>
                                 
                                   
                        //      </div>
                        //     )
                        //    })
                        data.map((product, index) => {
                            return (
                                <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-40 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                    <div className='w-40 h-40 bg-slate-200'>
                                        <img 
                                            src={product?.productId?.productImage?.[0]} 
                                            className='w-full h-full object-scale-down mix-blend-multiply' 
                                            alt={product?.productId?.productName || 'Product Image'}
                                        />
                                    </div>
                                    <div className='px-10 py-2 relative'>
                                        {/** delete product */}
                                        <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer'
                                            onClick={() => deleteCartProduct(product?._id)} >
                                            <MdDelete />
                                        </div>
                        
                                        {/** detail product */}
                                        <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>
                                            {product?.productId?.productName || 'No Product Name'}
                                        </h2>
                        
                                        <p className='capitalize text-slate-500'>
                                            {product?.productId?.category || 'No Category'}
                                        </p>
                                        
                                        <div className='flex flex-col lg:flex-row justify-between'>
                                            <p className='text-red-600 font-medium text-lg'>
                                                {displayKIPCurrency(product?.productId?.sellingPrice || 0)}
                                            </p>
                                            <p className='text-slate-600 font-semibold text-lg'>
                                                {displayKIPCurrency((product?.productId?.sellingPrice || 0) * (product?.quantity || 1))}
                                            </p>
                                        </div>
                        
                                        <div className='flex items-center gap-3 mt-1'>
                                            <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' 
                                                onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                            <span>{product?.quantity || 0}</span>
                                            <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' 
                                                onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        
                        
                       
                    )
                  }
             </div>
               {/***Summary*/}
               {
                data[0] && (
                    <div  className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                            </div>
                        ):(
                            <div className='h-36 bg-white'>
                            <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>

                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Total Price</p>
                                <p>{displayKIPCurrency(totalPrice)}</p>    
                            </div>

                            <button className='bg-blue-600 p-2 text-white w-full mt-2'
                            onClick={handlePayment}>Payment</button>

                        </div>
                        )
                    }
                 </div>
                )
               }
              



        </div>
        
    </div>
  )
}

export default Cart
