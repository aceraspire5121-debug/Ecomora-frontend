import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {Box,Button, Paper,Stack,TextField, Typography,} from "@mui/material";
import { useEffect } from 'react'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton,Snackbar,Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
const EditProduct = () => {
    const { id } = useParams() //useParams() returns an object i.e { id: "123" } thats why we have to destructure it
    const location = useLocation()
    const product = location.state?.product
      const navigate = useNavigate()
  const [images, setimages] = useState([])
  const [open, setopen] = useState(false)
  const [loading, setloading] = useState(false)

   const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm();

    useEffect(() => {
    if(product)
    {
        console.log(product.images)
        reset({
            name:product.name,
            description:product.description,
             price: product.price,
             category: product.category,
             stock: product.stock,
        })
         setimages(product.images || []); // reset kebal form field ki values ko set karta hai state ki nhi isliye state ko bahar karo jo bhi karna hai, ab images hamara array of objects ban raha hai
    }

    }, [product,reset])


const savingProduct= async (data)=>{
  try{
    setloading(true)
    if(images.length===0)
    {
      alert("Please upload at least one image")
      return
    }
    const formData=new FormData()
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("stock", data.stock);

  images.forEach((item) => {
  if (typeof item !== "string") { // agar use new image upload nhi karega to images state ke andar cloudinary ke urls honge aur agar url hai to hame kuch bhi nhi karna hai
    formData.append("images", item); // only files
  }
});

  const token=localStorage.getItem("CommerceToken")
     const res=await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`,{ // isme mujhe files+text data dono bhejne hai isliye formData ka use karna padega barna mai direct likh skta tha body:json.stringfy(data), par isse files nhi jayengi isliye formdata ka use karunga
      method:"PUT",
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 important
        },
        body: formData,
     })
     if(res.ok){
     setopen(true)
     reset() // jaise hi add hua reset kar dia mtlb sab kuch khali kar dia
     setimages([])
     navigate("/admin/products")
     }
      const result = await res.json();
    console.log(result);
  }catch(error){
     console.log(error);
  }
  finally{
    setloading(false)
  }
}

    return (
       <Box
      sx={{
        minHeight: "100%",
        py: 5,
        px: 2,
        bgcolor: "#f8fafc",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 680,
          mx: "auto",
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
    <IconButton
    onClick={()=>navigate(-1)}
    sx={{mb:1,bgcolor:"#f1f5f9",
      "&:hover" :{
        bgcolor:"#e2e8f0"
      }
    }}
    >
      <ArrowBackIcon/>

    </IconButton>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Edit Product
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Fill in product details like name, description, price, and images.
        </Typography>

        <Stack
          component="form"
          spacing={2.5}
          noValidate  // browser kuch validate nhi karega
          autoComplete="off" // auto complete suggestions of browser ko band karta hai
          onSubmit={handleSubmit(savingProduct)}
        >
          <TextField
            name="name"
            label="Product name"
            required
            fullWidth
            {...register("name",{required:"Product Name is required"})}
            placeholder="e.g. Wireless earbuds"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            name="description"
            label="Description"
            required
            fullWidth
            multiline
            minRows={4}
            {...register("description",{required:"Description is required"})}
            placeholder="Short description"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
             error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="price"
              label="Price (₹)"
              type="number"
              required
              fullWidth
              {...register("price",{required:"price is required"})}
              inputProps={{ min: 0 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              error={!!errors.price}
            helperText={errors.price?.message}
            />
            <TextField
              name="stock"
              label="Stock"
              type="number"
              required
              fullWidth
              {...register("stock",{required:"stock is required"})}
              inputProps={{ min: 0 }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              error={!!errors.stock}
            helperText={errors.stock?.message}
            />
          </Stack>

          <TextField
            name="category"
            label="Category"
            required
            fullWidth
            {...register("category",{required:"category is required"})}
            placeholder="e.g. Electronics"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
             error={!!errors.category}
            helperText={errors.category?.message}
          />

          {/* Image Upload */}
          <Box
            sx={{
              p: 2,
              border: "1px dashed #cbd5f5",
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "#f9fafb",
            }}
          >
            {images.length === 0 ? (
              <> {/** react ko ek root chahiye hota hai delivery ke liye islye jab ham form banate hai to form ke andar wrap karte hai andar ke contents ko, ya kuch aur bhi likhte hai tab bhi multiple cheezo ko wrapp karte hi hai single ke andar chahe bo div ho, box ho ya form ho. Same yaha ham typography, button , typography teen cheeze de rahe hai to inhe wrap karna hi hoga ek single me to uske liye use kia <> ye ek invisible wrapper hai jo ki div me resolve bhi nhi hota aur react isko root mankar delivery bhi kar deta hai */}
                <Typography fontWeight={600} mb={1}>
                  Upload Images
                </Typography>

                <Button
                  variant="contained"
                  component="label" // hamne apne button ko as a label bana dia, HTML rule hai ki <label> ke andar input hai to label par click karne se input trigger hoga, agar ham label nhi banayenge to ispr click karne se input trigger nhi hoga
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Select Files
                  <input
                    type="file"
                    name="images"
                    accept="image/*" // can only select jpeg,jpg,png not select pdf,vedio
                    multiple
                    onChange={(e) => setimages([...e.target.files])}
                    hidden // ye input ko hide karke rakh raha hai kebal button lebal visible hai input nhi, par jab lebal par click hoga to ye hidden input trigger ho jayega
                  />
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  You can upload up to 4 images
                </Typography>
              </>) : (<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
  {images.map((item, index) => (
    <Box key={index} sx={{ position: "relative" }}>
      
      {/* Image */}
      <img
        src={
    item.url
      ? item.url // cloudinary image
      : URL.createObjectURL(item) // new uploaded file
  }
        alt="preview"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      {/* Remove Button */}
      <Box
        onClick={() =>
          setimages(images.filter((_, i) => i !== index))
        }
        sx={{
          position: "absolute",
          top: -5,
          right: -5,
          bgcolor: "red",
          color: "white",
          width: 20,
          height: 20,
          borderRadius: "50%",
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ✕
      </Box>

    </Box>
  ))}
</Box>)}
          </Box>

          {/* Actions */}
          {/** stack internally display="flex" hota hai isliye isme hame zaroorat nhi padti us cheez ki */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ pt: 2 }}
          >
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
              onClick={() => navigate(-1)} // ya to function call karlo jaise onclick=(back) ye bhi click karne ke baad chalgea par agar function yahi par banana hai to hame arraow function ka use lena padta hai jisse click karne ke baad chale
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Snackbar
        open={open} // if open true it will be shown else not
        autoHideDuration={3000}
        onClose={()=>setopen(false)}
        >
          <Alert severity="success" variant="filled" >
             Product Edited successfully
          </Alert>
        </Snackbar>
    </Box>
    )
}

export default EditProduct
