import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import type { Product } from "../../../types/Product";

interface ProductCardProps {
  product: Product;
  is_favorite?: boolean;
  onAddToCart?: (quantity: number) => void;
  onToggleFavorite?: () => void;
}

export default function ProductCard({
  product,
  is_favorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(is_favorite);
  const [isLoading, setIsLoading] = useState(false);

  if (!product) {
    return null;
  }

  const handleAddToHeart = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا ابتدا وارد حساب کاربری خود شوید", {
          position: "top-center",
          duration: 2000,
          style: {
            background: "#7a4522",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
        });
        return;
      }

      const response = await fetch("https://admin.mydivix.com/api/v1/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsFavorite(!isFavorite);
        if (onToggleFavorite) {
          onToggleFavorite();
        }
        toast.success(
          isFavorite ? "محصول از علاقه‌مندی‌ها حذف شد" : "محصول به علاقه‌مندی‌ها اضافه شد",
          {
            position: "top-center",
            duration: 2000,
            style: {
              background: "#7a4522",
              color: "#fff",
              borderRadius: "10px",
              padding: "16px",
            },
          }
        );
      } else {
        toast.error(data.message || "خطا در افزودن به علاقه‌مندی‌ها", {
          position: "top-center",
          duration: 2000,
          style: {
            background: "#7a4522",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور", {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#7a4522",
          color: "#fff",
          borderRadius: "10px",
          padding: "16px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#6F1D1B]/20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#7a4522",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          duration: 2000,
        }}
      />
      <div className="relative h-48 sm:h-56 md:h-64">
        <img
          src={product.image as string}
          alt={product.title}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-3 sm:p-4">
        <span className="text-xs sm:text-sm text-[#6F1D1B]">{product.category}</span>
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-bold text-[#222] my-1 sm:my-2">{product.title}</h3>
          <div className="flex flex-col items-end">
            <span className="text-sm sm:text-base text-[#6F1D1B] font-bold">
              {product.price.toLocaleString()} تومان
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-3">
          <Link
            to={`/products/${product.slug}`}
            className="bg-[#7a4522] text-white py-1 px-3 sm:px-4 rounded-lg text-sm sm:text-base hover:bg-[#6F1D1B] transition-colors duration-300"
          >
            مشاهده جزئیات
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleAddToHeart}
              disabled={isLoading}
              className={`p-1.5 sm:p-2 ${
                isFavorite ? "text-red-500" : "text-[#6F1D1B]"
              } hover:text-[#432818] transition-colors duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#6F1D1B] border-t-transparent rounded-full animate-spin"></div>
              ) : isFavorite ? (
                <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
