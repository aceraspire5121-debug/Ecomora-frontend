import React from "react";
import { getUserFromToken } from "../utils/auth";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Snackbar, Alert,IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product,onDelete,onFetch,onShowMessage,onShowMessage2 }) => {
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";
  const [open, setopen] = useState(false)
  const [loading, setloading] = useState(false)
  const navigate=useNavigate()

  const addToCart=async ()=>{
    try{
    const token=localStorage.getItem("CommerceToken");
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${product._id}`,{
        method:"POST",
        headers:{Authorization: `Bearer ${token}`},
      })
      const data=await res.json();
      if (res.ok) {
      console.log("Added to cart:", data);
      onShowMessage2()

    } else {
      console.error(data.message);
    }
  }catch(err)
  {
    console.error("Error:", err);
  }
  }

  const deleteProduct = async () => { // ohh har function ke liye ek alag execution context banta hai jiska ek part memory space hota hai aur uski memory space me bo uske andar jo data use hota hai use store karta hai jiski bajah se jitni bar deleteProduct banega bo har bar us time avaibale product ko store kar lega jo ki bo use kar raha hai, isliye har deleteProduct ka ek alag execution context hai jiski memory me us particular card ke assosiated product store hai
    try {
      setloading(true)
      const token = localStorage.getItem("CommerceToken")
      const id = product._id
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (res.ok) {
        setopen(true)
        onDelete(product._id)
        onShowMessage()
        onFetch()
        
      }

    } catch(error) {
       console.log(error)
     }
     finally{
      setloading(false)
     }
  }

  return (
    <article className="group relative flex flex-col rounded-2xl border border-stone-100 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-teal-200/60 hover:shadow-[0_20px_40px_-28px_rgba(15,118,110,0.35)]">
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 to-stone-50">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700/90">
        {product.category}
      </span>

      <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-stone-900">{product.name}</h2>

      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">{product.description}</p>

      <p className="mt-3 text-lg font-bold tabular-nums text-stone-900">₹{product.price}</p>

      <div className="mt-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${product.stock > 0
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
              : "bg-red-50 text-red-700 ring-1 ring-red-200/80"
            }`}
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      {!isAdmin && ( // i have given group to the parent i.e article so by this now i can apply on child whenever parent is hovered, apply group-hover.. to the child
       <IconButton
    className="opacity-0 translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 ease-out"
    size="small"
    onClick={addToCart}
    sx={{
      position: "absolute",
      bottom: 14,
      right: 14,
      width: 38,
      height: 38,
      color: "#0f766e",
      backgroundColor: "#ffffff",
      border: "1px solid rgba(13, 148, 136, 0.24)",
      boxShadow: "0 10px 22px -12px rgba(15, 118, 110, 0.5)",
      transition: "all 220ms ease",
      "&:hover": {
        backgroundColor: "#f0fdfa",
        borderColor: "rgba(13, 148, 136, 0.5)",
        boxShadow: "0 14px 26px -12px rgba(15, 118, 110, 0.6)",
        transform: "translateY(-1px) scale(1.04)",
      },
    }}
  >
    <AddShoppingCartIcon sx={{ fontSize: 19 }} />
  </IconButton>
      )}

      {isAdmin && (
        <div className="mt-4 flex gap-2 border-t border-stone-100 pt-4">
          <button
            type="button"
            className="flex-1 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 transition hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-900"
            onClick={()=>navigate(`/admin/products/editProduct/${product._id}`,{
              state:{product}
            })}
          >
            Edit
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-red-200/80 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
            onClick={deleteProduct}
            disabled={loading}
          >
            {loading?"Deleting...":"Delete"}
          </button>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
