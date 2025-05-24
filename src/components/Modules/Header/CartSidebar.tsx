import { FaTimes, FaShoppingCart, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { CartProduct } from "../../../ContextApi/CartProvider";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartProduct[];
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemoveItem: (id: number) => void;
}

const CartSidebar = ({
  isOpen,
  onClose,
  cartData,
  onQuantityChange,
  onRemoveItem,
}: CartSidebarProps) => {

  console.log("cartData =>" , cartData)
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-y-0 left-0 w-[85%] sm:w-[400px] bg-white shadow-lg transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* هدر سبد خرید */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-[#7a4522]">سبد خرید</h2>
            <button
              onClick={onClose}
              className="p-2 hover:text-[#D97706] transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* محتوای سبد خرید */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartData.length > 0 ? (
              <div className="space-y-4">
                {cartData.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg relative">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-[#171717] mb-1">
                          {item.title.slice(0,30)}...
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.price.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#473e39]">
                        {item.price.attributes.map((attr) => (
                          <span key={attr.id} className="flex items-center gap-1">
                            {attr.group.type === "color" ? (
                              <div
                                className="w-3 h-3 rounded-full border border-[#fff1cc]"
                                style={{ backgroundColor: attr.value }}
                              />
                            ) : (
                              <span>{attr.name}</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-[#7a4522]">
                          {item.price.discount
                            ? item.price.discount_price.toLocaleString()
                            : item.price.price.toLocaleString()}{" "}
                          تومان
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onQuantityChange(item.price.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#fff1cc] text-[#7a4522] hover:bg-[#7a4522] hover:text-white transition-colors"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="text-sm text-[#473e39] min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onQuantityChange(item.price.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#fff1cc] text-[#7a4522] hover:bg-[#7a4522] hover:text-white transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  سبد خرید شما خالی است
                </h3>
                <p className="text-sm text-gray-400">
                  می‌توانید از محصولات ما دیدن کنید
                </p>
              </div>
            )}
          </div>

          {/* فوتر سبد خرید */}
          {cartData.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">جمع کل:</span>
                <span className="text-[#7a4522] font-bold">
                  {cartData.reduce((total, item) => total + (item.price.price * item.quantity), 0).toLocaleString()} تومان
                </span>
              </div>
              <Link 
                to={"/checkout/cart"} 
                onClick={onClose}
                className="w-full flex justify-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors"
              >
                پرداخت
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar; 