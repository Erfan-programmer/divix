interface CartItem {
    id: number;
    quantity: number;
  }
  
  // کلید برای ذخیره سبد خرید در localStorage
  const CART_STORAGE_KEY = 'divix_cart';
  
  // دریافت سبد خرید از localStorage
  export const getCartFromStorage = (): CartItem[] => {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  };
  
  // ذخیره سبد خرید در localStorage
  export const saveCartToStorage = (cart: CartItem[]): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };
  
  // افزودن محصول به سبد خرید
  export const addToCart = (productId: number, quantity: number = 1): CartItem[] => {
    const cart = getCartFromStorage();
    
    // بررسی وجود محصول در سبد
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      // اگر محصول قبلاً در سبد وجود دارد، تعداد آن را افزایش می‌دهیم
      cart[existingItemIndex].quantity += quantity;
    } else {
      // اگر محصول جدید است، آن را به سبد اضافه می‌کنیم
      cart.push({ id: productId, quantity });
    }
    
    // ذخیره سبد به‌روز شده در localStorage
    saveCartToStorage(cart);
    
    return cart;
  };
  
  // حذف محصول از سبد خرید
  export const removeFromCart = (productId: number): CartItem[] => {
    const cart = getCartFromStorage();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCartToStorage(updatedCart);
    return updatedCart;
  };
  
  // به‌روزرسانی تعداد محصول در سبد خرید
  export const updateCartItemQuantity = (productId: number, quantity: number): CartItem[] => {
    const cart = getCartFromStorage();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // اگر تعداد صفر یا منفی است، محصول را حذف می‌کنیم
        return removeFromCart(productId);
      } else {
        // در غیر این صورت، تعداد را به‌روز می‌کنیم
        cart[itemIndex].quantity = quantity;
        saveCartToStorage(cart);
      }
    }
    
    return cart;
  };
  
  // دریافت تعداد کل محصولات در سبد خرید
  export const getCartItemCount = (): number => {
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  // دریافت تعداد یک محصول خاص در سبد خرید
  export const getItemQuantity = (productId: number): number => {
    const cart = getCartFromStorage();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  // پاک کردن سبد خرید
  export const clearCart = (): void => {
    localStorage.removeItem(CART_STORAGE_KEY);
  };
  
  // تبدیل سبد خرید به رشته JSON برای استفاده در هدر
  export const getCartHeaderValue = (): string => {
    const cart = getCartFromStorage();
    return JSON.stringify(cart);
  }; 