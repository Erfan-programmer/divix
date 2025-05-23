import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import { CartProvider } from "./ContextApi/CartProvider";
import Home from "./page/Home";
import "swiper/swiper-bundle.css";
import ProductsPage from "./components/Templates/Products/Products";
import ProductsDetails from "./components/Templates/Products/ProductsDetails";
import BlogsPage from "./components/Templates/Blog/BlogPage";
import BlogDetail from "./components/Templates/Blog/BlogDetails";
import ContactPage from "./page/Contact";
import ShippingCart from "./page/Checkbox/Shipping";
import ChechoutCart from "./page/Checkbox/Cart";
import LoginPage from "./page/Login";
import RegisterPage from "./page/Register";
import Dashboard from "./page/user-panel/Dashoard";
import Profile from "./page/user-panel/Profile";
import Orders from "./page/user-panel/Orders";
import Favorites from "./page/user-panel/Favorites";
import UserPanelLayout from "./components/Layout/UserPanel";
import ThankYou from "./page/Checkbox/ThankYou";
import ScrollToTop from "./components/Modules/ScrollToTop";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <ScrollToTop />
          {/* <ScrollToTop /> */}
          <div className="min-h-screen bg-secondary-black text-white">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="blogs" element={<BlogsPage />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />

                <Route path="thank-you" element={<ThankYou />} />
                <Route path="checkout">
                  <Route path="cart" element={<ChechoutCart />} />
                  <Route path="shipping" element={<ShippingCart />} />
                </Route>

                <Route path="/products/:id" element={<ProductsDetails />} />

                {/* user panel */}
                <Route path="user-panel" element={<UserPanelLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="favorites" element={<Favorites />} />
                </Route>
                {/* user panel */}
              </Route>
              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Auth */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
