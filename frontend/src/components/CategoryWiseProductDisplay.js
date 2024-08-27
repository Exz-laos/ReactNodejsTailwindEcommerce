import React, { useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayKIPCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
const CategoryWiseProductDisplay = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    

    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data",categoryProduct.data)
        setData(categoryProduct?.data)
    }

    
    useEffect(()=>{
        fetchData()
    },[])
     



  return (
    <div className='container mx-auto px-4 my-6 relative'>
        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
      
       <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] 
       justify-between md:gap-6 overflow-x-scroll scrollbar-none transition-all'
        >
        {  
           loading ? (
            loadingList.map((product,index)=>{
                return (
                <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] 
                    md:max-w-[320px] bg-white rounded-sm shadow'>
                    <div className='bg-slate-200 h-56 p-4 min-w-[280px] md:min-w-[145px] 
                     flex justify-center items-center animate-pulse'>
                    </div>
                    <div className='p-4 grid w-full gap-2'>
                      <h2 className='p-1 py-2 bg-slate-200 animate-pulse rounded-full'> </h2>
                         
                      <p className='p-1 py-1 w-40 bg-slate-200 animate-pulse rounded-full'></p>
                            <div className='flex'>
                                <p className='bg-slate-200 w-full h-4 animate-pulse rounded-full'></p>
                                  
                                <p className=' bg-slate-200 w-full h-2 animate-pulse rounded-full'></p>
                                 
                            </div>
                            <button className=' py-3 rounded-full bg-slate-200 animate-pulse' >
        
                            </button>
                    </div>
  
                </div>
                )
            })
           ):(
            data.map((product,index)=>{
                return (
                <Link to={`/product/${product?._id}`}
                className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] 
                    md:max-w-[320px] bg-white rounded-sm shadow'>
                    <div className='bg-slate-200 h-56 p-4 min-w-[280px] md:min-w-[145px] 
                     flex justify-center items-center'>
                            <img src={product.productImage[0]} 
                            className='object-scale-down h-full hover:scale-110 transition-all 
                            mix-blend-multiply' />
                    </div>
            
                    <div className='p-4 grid gap-3'>
                      <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>
                            {product?.productName}</h2>
                      <p className='capitalize text-slate-500'>{product?.category}</p>

                            <div className='flex'>
                                <p className='text-2xl text-red-600 font-medium'>
                                    { displayKIPCurrency(product?.sellingPrice) }</p>
                                <p className='text-base text-slate-500 line-through px-3 py-4'>
                                    { displayKIPCurrency(product?.price)  }</p>
                            </div>
                            <button className='text-sm bg-red-600 hover:bg-red-700
                             text-white px-3 py-0.5 rounded-full' onClick={(e) => addToCart(e.product?._id)} >
                                Add to Cart
                            </button>
                    </div>
  
                </Link>
                )
            })
           )

           
        }
       </div>
    
    </div>
  )
}

export default CategoryWiseProductDisplay