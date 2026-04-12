import React from 'react'
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children}) => {
  const token=localStorage.getItem("CommerceToken")
  if(!token){
    // navigate("/login") // this is not allowed in react during first rendering, you can use this buttons, useeffectbecause there it is called after rendering not during rendering but here it is called during the redering of page and this is not supported by react / agar yahi use karna hai to tum useeffect lagao aur token ko dependency rakho jiski bajah se rendering par nhi chalega aur react support kar dega ya fir tum Navigate ka use karo
   return <Navigate to="/login" /> 
  }
  return children;
}

export default ProtectedRoute
