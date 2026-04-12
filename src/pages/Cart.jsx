import React from 'react'
import Navbar from '../components/Navbar'
import CartCont from '../components/CartCont'

const Cart = () => {
  return (
  <div className="min-h-full bg-gradient-to-b from-teal-50/40 via-stone-50 to-stone-100 pt-4 pb-10">
    <Navbar/> 
    <div >
      <CartCont/>
    </div>
  </div>
  

  )
}

export default Cart
