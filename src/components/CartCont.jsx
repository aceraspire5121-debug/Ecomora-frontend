import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
  IconButton,
  Snackbar, Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CartCont = () => {
  const [cartItems, setcartItems] = useState([]) // array of objects
  const [open, setopen] = useState(false)
  const [open2, setopen2] = useState(false)
  const requestId = useRef(0)
  const oldcart = useRef([])

  const fetchCart = async () => {
    const token = localStorage.getItem("CommerceToken")
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json();
    console.log(data.cart.items)
    setcartItems(data.cart.items) // data.cart.items array ka reference pass kar dia hamne cartItems ko, setcartitems me reference pass hota hai actual data nhi
    oldcart.current = structuredClone(data.cart.items) // isme hame reference nhi chahiye hame chahiye deep copy kyoki ham ye backup ke liye rakh rahe hai aur backup me hame deep copy rakhna chahiye na ki reference since cartItems ke pass bhi reference hai agar usne kuch change kar dia array me to bo changes oldcart me bhi aa jayenge to fir ye backup kaise hua isliye ham deepcopy rakhenge iskki
  }

  useEffect(() => {
    fetchCart()
  }, [])

  // State:- persist value across re render and also trigger re render when changed
  //useRef:- persist value across re renders but do not trigger re render when changed
  //whenever user click, managequantity runs so for every click, a function call is created or in better way we can say that every click(function call) creates a instance of the same function which holds its own currentRequest value
  // EX:- Click1 :-managequantity{ currentrequest=1 }
  //      Click2 :-managequantity{ currentrequest=2 }
  //      Click1 :-managequantity{ currentrequest=3 }

  //whenever respond comes from backend if failed then move to its own instance of the function not to the latest instance i.e if click 2 generates a api calls but it fails due to server issue then the respond which came due to api call 2 will not go to the instance created because of click3, it will go back to the instance where currentRrequest==2

  const manageQuantity = async (item, manage) => {

    //  const oldcart=[...cartItems]
    const currentRequest = ++requestId.current // currentRequest belong to the instances of function

    setcartItems(prev =>
      prev.map(i => i.product._id === item.product._id ? { ...i, quantity: manage ? i.quantity + 1 : i.quantity - 1 } : i

        // ...i mtlb i ki properties copy karo yaha jaise product,quantity uske baad quantity:, iska mtlb hai sab copy karne ke baad quantity ko override kardo, kaise override karoge manage true to badakar,agar manage false to minus karke
        //single expression:- {} ye nhi chahiye aur {}use nhi kia to return bhi nhi lagana padega:-implicit return
        //multiple expression:- {} use karne padenge and sincle curly braces use kiye to return bhi lagana padega
      ).filter(i => i.quantity > 0) // 0 se badi quantity hai to rakho barna hatado
    )
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ manage })
      })
      const data = await res.json();
      if (res.ok) {
        console.log("Quantity Updated", data);
      } else {
        console.error(data.message);
      }
      // setcartItems(data.cart.items)
    } catch (err) {
      if (currentRequest === requestId.current) // manlo request 2 fail hui to bo apne instance me aaya jaha par currentrequest=2 hoga, bo check karega ki kya currentRequest===requestId.current hai par manlo third click se requestId.current 3 ho gaya hai to yaha fail ho jayega aur koi  update nhi karega
      {
        setopen2(true)
        try {
          await fetchCart()
        } catch (err) {
          if (currentRequest === requestId.current)
            setcartItems(oldcart.current)
          console.log(err)
        }
      }
      console.error("Error:", err);
    }
  }

  const deleteFromCart = async (item) => {
    try {
      const token = localStorage.getItem("CommerceToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item.product._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        setopen(true)
      } else {
        console.error(data.message);
      }
      setcartItems(data.cart.items)
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: 4,
        px: 2,
        background:
          "linear-gradient(180deg, rgba(240,253,250,0.6) 0%, rgba(248,250,252,1) 45%)",
      }}
    >
      <Box sx={{ width: "min(1100px, 100%)", mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}
        >
          My Cart
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Review your selected items and place your order.
        </Typography>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">

          {/* Left: cart items */}
          <Stack spacing={2.5} sx={{ flex: 1.7 }}>
            {cartItems.map((item) => (
              <Paper
                key={item.product._id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "rgba(15,118,110,0.14)",
                  boxShadow: "0 12px 30px -22px rgba(15,23,42,0.25)",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Box
                    component="img"
                    src={item.product.images?.[0]?.url || "https://via.placeholder.com/150"}
                    alt={item.product.name}
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2.5,
                      objectFit: "contain",
                      border: "1px solid #e2e8f0",
                    }}
                  />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {item.product.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {item.product.category}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5, bgcolor: "#fff" }}
                          onClick={() => manageQuantity(item, false)} >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Typography sx={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                          {item.quantity}
                        </Typography>

                        <IconButton size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 1.5, bgcolor: "#fff" }}
                          onClick={() => manageQuantity(item, true)} >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography sx={{ fontWeight: 800 }}>
                          ₹{item.product.price}
                        </Typography>

                        <IconButton size="small" sx={{ color: "#ef4444", bgcolor: "rgba(239,68,68,0.08)" }}
                          onClick={() => deleteFromCart(item)} >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          {/* Right: summary */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "rgba(15,118,110,0.16)",
              boxShadow: "0 16px 34px -24px rgba(15,23,42,0.25)",
              height: "fit-content",
              position: { lg: "sticky" },
              top: 24,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Order Summary
            </Typography>

            <Stack spacing={1.2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 700 }}>{cartItems.length > 0 ? "₹120" : "₹0"}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Discount</Typography>
                <Typography sx={{ fontWeight: 700, color: "#059669" }}>-₹0</Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 800 }}>Total</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: "1.1rem" }}>
                ₹{cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) + (cartItems.length > 0 ? 120 : 0)}
              </Typography>
            </Stack>

            <TextField
              size="small"
              fullWidth
              placeholder="Coupon code"
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.25,
                borderRadius: 2.5,
                fontWeight: 800,
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
              }}
            >
              Checkout
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1, fontWeight: 700, color: "text.secondary" }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Stack>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setopen(false)} // jab ye band hoga to jate jate ye setopen ko false kar dega aur iski bajah se, snackbar jo ki open the open={true} par bo open=false hone par fir close ho jayega, to ek tareeke se ye apne aap ko ui se hi hide kar raha hai onclose par
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // position lagayi hai uski
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setopen(false)}
        >
          Removed from cart
        </Alert>
      </Snackbar>
      <Snackbar
        open={open2}
        autoHideDuration={2000}
        onClose={() => setopen2(false)} // jab ye band hoga to jate jate ye setopen ko false kar dega aur iski bajah se, snackbar jo ki open the open={true} par bo open=false hone par fir close ho jayega, to ek tareeke se ye apne aap ko ui se hi hide kar raha hai onclose par
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // position lagayi hai uski
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setopen2(false)}
        >
          Failed to update
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartCont;