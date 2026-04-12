import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ProductPage from "./pages/Product";
import AdminPage from "./pages/Admin";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/user/products" element={<ProtectedRoute><ProductPage/></ProtectedRoute>} />
        <Route path={"/admin/products"} element={<ProtectedRoute><AdminPage/></ProtectedRoute>} />
        <Route path={"/admin/products/newProduct"} element={<ProtectedRoute><AddProduct/></ProtectedRoute>} />
        <Route path={"/admin/products/editProduct/:id"} element={<ProtectedRoute><EditProduct/></ProtectedRoute>} />
        <Route path={"/users/cart"} element={<ProtectedRoute><Cart/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
