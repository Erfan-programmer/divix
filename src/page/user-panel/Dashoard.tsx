"use client";

import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaHeart,
  FaShoppingBag,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// نوع داده برای تیکت
interface Ticket {
  id: number;
  title: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
}

// نوع داده برای محصول مورد علاقه
interface FavoriteProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  is_available: boolean;
}

// نوع داده برای سفارش
interface Order {
  id: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/tickets?per_page=3",
        {
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("خطا در دریافت تیکت‌ها");
      }

      const data = await response.json();
      if (data.success) {
        setRecentTickets(data.result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت تیکت‌ها");
    }
  };

  const fetchFavoriteProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/favorites?per_page=3",
        {
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("خطا در دریافت محصولات مورد علاقه");
      }

      const data = await response.json();
      if (data.success) {
        setFavoriteProducts(data.result.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت محصولات مورد علاقه"
      );
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://admin.mydivix.com/api/v1/orders?per_page=3",
        {
          headers: {
            accept: "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("خطا در دریافت سفارشات");
      }

      const data = await response.json();
      if (data.success) {
        setRecentOrders(data.result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت سفارشات");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          // fetchRecentTickets(), // کامنت شده
          fetchFavoriteProducts(),
          fetchRecentOrders(),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // تبدیل وضعیت سفارش به متن فارسی
  const getOrderStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "در انتظار پرداخت";
      case "processing":
        return "در حال پردازش";
      case "completed":
        return "تکمیل شده";
      case "cancelled":
        return "لغو شده";
      default:
        return status;
    }
  };

  // تبدیل وضعیت سفارش به رنگ
  const getOrderStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // اسکلتون لودینگ برای محصولات مورد علاقه
  const FavoriteProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-gray-50 rounded-lg p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // اسکلتون لودینگ برای سفارشات
  const OrdersSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-gray-50 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* هدر صفحه */}
      <div className="bg-[#432818] rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3">
          <FaUser className="w-8 h-8 text-[#FFF1CC]" />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFF1CC]">
              پنل کاربری
            </h1>
            <p className="text-xs sm:text-sm text-[#FFF1CC]/80 mt-1">
              خوش آمدید!
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* بخش محصولات مورد علاقه */}
          <div className="bg-white rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaHeart className="w-6 h-6 text-[#432818]" />
                <h2 className="text-base sm:text-lg font-bold text-[#432818]">
                  محصولات مورد علاقه
                </h2>
              </div>
              <Link
                to="/user-panel/favorites"
                className="flex items-center gap-2 text-[#432818] hover:text-[#432818]/80 text-sm"
              >
                <span>مشاهده همه</span>
                <FaChevronLeft className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <FavoriteProductsSkeleton />
            ) : favoriteProducts.length === 0 ? (
              <div className="text-center py-8">
                <FaHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  هنوز محصولی به لیست علاقه‌مندی‌های شما اضافه نشده است
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-[#432818] hover:text-[#432818]/80 text-sm"
                >
                  مشاهده محصولات
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="aspect-square mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#432818] font-bold">
                        {product.price
                          ? product.price.toLocaleString("fa-IR")
                          : "0"}{" "}
                        تومان
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-xs text-[#432818] hover:text-[#432818]/80"
                      >
                        مشاهده
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* بخش سفارشات اخیر */}
          <div className="bg-white rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaShoppingBag className="w-6 h-6 text-[#432818]" />
                <h2 className="text-base sm:text-lg font-bold text-[#432818]">
                  سفارشات اخیر
                </h2>
              </div>
              <Link
                to="/user-panel/orders"
                className="flex items-center gap-2 text-[#432818] hover:text-[#432818]/80 text-sm"
              >
                <span>مشاهده همه</span>
                <FaChevronLeft className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <OrdersSkeleton />
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <FaShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">شما هنوز سفارشی ثبت نکرده‌اید</p>
                <Link
                  to="/products"
                  className="inline-block mt-4 text-[#432818] hover:text-[#432818]/80 text-sm"
                >
                  مشاهده محصولات
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-900">#{order.id}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          {order.items} کالا
                        </span>
                        <span className="text-[#432818] font-bold">
                          {order.total
                            ? order.total.toLocaleString("fa-IR")
                            : "0"}{" "}
                          تومان
                        </span>
                      </div>
                      <Link
                        to={`/user-panel/orders/${order.id}`}
                        className="text-[#432818] hover:text-[#432818]/80"
                      >
                        مشاهده
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
