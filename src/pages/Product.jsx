import React from 'react'
import Navbar from '../components/Navbar'
import ProductHeader from '../components/ProductCont'
const ProductPage = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-teal-50/40 via-stone-50 to-stone-100 pt-4 pb-10">
      <Navbar/>
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5 mt-2">
        <ProductHeader/>
      </div>
    </div>
  )
}

export default ProductPage
