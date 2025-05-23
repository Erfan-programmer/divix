import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

export interface CartProduct {
  id: number;
  title: string;
  price: {
    id: number;
    price: number;
    regular_price: number;
    sale_price: number;
    discount: boolean;
    discount_price: number;
    cart_max: number;
    cart_min: number;
    attributes: {
      id: number;
      name: string;
      value: string;
      group: {
        type: string;
      };
    }[];
  };
  sale_price: number;
  image: string;
  quantity: number;
  color: string;
  warranty: string;
  seller: string;
  description: string;
  unit: string;
  is_special: boolean;
}

export interface CartResponse {
  success: boolean;
  message: string;
  result: {
    id: number;
    cart_id: string;
    discount_id: number | null;
    total_discount: number;
    shipping_cost: string;
    shipping_cost_amount: number;
    final_price: number;
    weight: number;
    products: CartProduct[];
  };
}

interface CartContextType {
  cartData: CartProduct[];
  isLoading: boolean;
  setOpenTest: (status: boolean) => void;
  isOpenTest: boolean;
  error: string | null;
  isUpdatingQuantity: boolean;
  handleQuantityChange: (id: number, newQuantity: number) => Promise<void>;
  updateQuantity: (id: number, type: string) => void;
  removeItem: (id: number) => Promise<void>;
  fetchCart: (options?: FetchCartOptions) => Promise<void>;
  cartSummary: CartResponse["result"] | null;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
  addToCart: (id: number, quantity: number) => Promise<void>;
  forceUpdate: number;
  totalItems: number;
}

interface FetchCartOptions {
  showToast?: boolean;

  updateLocalStorage?: boolean;
  onSuccess?: (data: CartResponse) => void;
  onError?: (error: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartData, setCartData] = useState<CartProduct[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [cartSummary, setCartSummary] = useState<CartResponse["result"] | null>(
    null
  );
  const [isOpenTest, setOpenTest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    console.log("handleQuantityChange", id, newQuantity);

    const cartItem = cartData.find((item) => item.price.id === id);
    if (!cartItem) {
      toast.error("محصول در سبد خرید یافت نشد");
      return;
    }

    if (!cartItem.price.id) {
      toast.error("خطا در شناسه محصول");
      return;
    }

    if (newQuantity < 0 || newQuantity > cartItem.price.cart_max) {
      toast.error(
        newQuantity > cartItem.quantity
          ? "تعداد محصول به حداکثر رسیده است"
          : "تعداد محصول نمی‌تواند کمتر از 1 باشد"
      );
      return;
    }

    setIsUpdatingQuantity(true);
    try {
      if (newQuantity === 0) {
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/cart/${cartItem.price.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "cart-id": `${localStorage.getItem("cart-id")}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          await fetchCart();
          toast.success("محصول با موفقیت از سبد خرید حذف شد");
        }

        else {
          toast.error(data.message || "خطا در حذف محصول");
        }
        return;
      }

      const isDecrease = newQuantity < cartItem.quantity;
      const endpoint = isDecrease
        ? "https://admin.mydivix.com/api/v1/cart/decrease"
        : "https://admin.mydivix.com/api/v1/cart";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cart-id": `${localStorage.getItem("cart-id")}`,
        },
        body: JSON.stringify({
          price_id: cartItem.price.id,
          quantity: 1,
        }),
      });

      if (response.status === 422) {
        toast.error('تعداد محصول در انبار تمام شده است');
        return;
      }
      const data = await response.json();
      if (data.success) {
        await fetchCart();
        toast.success("تعداد محصول با موفقیت بروزرسانی شد");
      } else {
        console.error("خطا در بروزرسانی تعداد:", data.message);
        toast.error(data.message || "خطا در بروزرسانی تعداد");
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const updateQuantity = (id: number, type: string) => {
    const cartItem = cartData.find((item) => item.price.id === id);
    if (!cartItem) return;

    const newQuantity =
      type === "+" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    console.log("updateQuantity", id, newQuantity);
    handleQuantityChange(id, newQuantity);
  };

  const fetchCart = useCallback(async (options: FetchCartOptions = {}) => {
    const {
      showToast = false,
      onSuccess,
      onError,
    } = options;

    try {
      setIsLoading(true);
      const cartId = localStorage.getItem("cart-id");
      let response;

      if (cartId) {
        response = await fetch("https://admin.mydivix.com/api/v1/cart", {
          headers: { "cart-id": cartId },
        });
      } else {
        response = await fetch("https://admin.mydivix.com/api/v1/cart");
      }

      if (!response.ok) {
        throw new Error("خطا در ارتباط با سرور");
      }

      const data: CartResponse = await response.json();

      if (data.success) {
        setCartData(data.result.products);
        setCartSummary(data.result);
        setError(null);
        setForceUpdate(prev => prev + 1);
        if (data.result.id !== localStorage.getItem("cart-id") as null) {
          localStorage.setItem("cart-id", data.result.id.toString());
        }

        if (onSuccess) {
          onSuccess(data);
        }
      } else {
        throw new Error(data.message || "خطا در دریافت اطلاعات سبد خرید");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در دریافت اطلاعات سبد خرید";
      setError(errorMessage);

      if (showToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const total = cartData.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  }, [cartData]);

  const removeItem = async (id: number) => {
    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/cart/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "cart-id": `${localStorage.getItem("cart-id")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchCart();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("خطا در حذف محصول از سبد خرید");
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    try {
      setIsUpdatingQuantity(true);
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          quantity,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        console.log("provider updateCartItem");

        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      setError("خطا در به‌روزرسانی سبد خرید");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const removeCartItem = async (id: number) => {
    try {
      setIsUpdatingQuantity(true);
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      setError("خطا در حذف آیتم از سبد خرید");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const value = {
    cartData,
    cartSummary,
    isLoading,
    error,
    isUpdatingQuantity,
    handleQuantityChange,
    isOpenTest,
    setOpenTest,
    updateQuantity,
    removeItem,
    totalItems,
    fetchCart,
    updateCartItem,
    removeCartItem,
    addToCart: async (id: number, quantity: number) => {
      try {
        const response = await fetch("https://admin.mydivix.com/api/v1/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "cart-id": `${localStorage.getItem("cart-id")}`,
          },
          body: JSON.stringify({
            price_id: id,
            quantity,
          }),
        });

        const data = await response.json();
        if (data.success) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    },
    forceUpdate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
