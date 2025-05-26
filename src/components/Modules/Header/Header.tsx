import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  FaAngleDown,
  FaAngleRight,
  FaCircleChevronDown,
  FaCircleChevronRight,
} from "react-icons/fa6";
import MobileMenu from "./MobileMenu";
import CartSidebar from "./CartSidebar";
import toast from "react-hot-toast";
import { useCart } from "../../../ContextApi/CartProvider";
import { debounce } from "lodash";

// اضافه کردن تایپ NodeJS
declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}

export interface CartProduct {
  id: number;
  title: string;
  price: {
    id: number;
    price: number;
    regular_price: number;
    sale_price: number;
    discount: null;
    discount_price: number;
    cart_max: number;
    cart_min: number;
    attributes: [];
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

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  type: string;
  image: string;
}

interface Menu {
  id: number;
  type: string;
  lang: string;
  static_type: string | null;
  title: string;
  link: string | null;
  menuable_id: number | null;
  menu_id: number | null;
  ordering: number;
  created_at: string;
  updated_at: string;
  children: any | null;
  childrenmenus: any[];
}

export interface Category {
  id: number;
  image: string;
  title: string;
  slug: string;
  categories: any[];
  category_id: number | null;
  products_count: number;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductMegaMenuOpen, setIsProductMegaMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { cartData, fetchCart, handleQuantityChange, removeItem, totalItems } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    profile_photo_url: string;
  } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCategories = async () => {
    const response = await fetch("https://admin.mydivix.com/api/v1/categories");
    const data = await response.json();

    if (data.success) {
      setCategories(data.result.data);
      console.log("categories =>", categories);
    }
  };
  const fetchMenus = async () => {
    const response = await fetch("https://admin.mydivix.com/api/v1/menus");
    const data = await response.json();

    if (data.success) {
      setMenus(data.result);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenus();
    
    
  }, []);



  const isActiveRoute = (path: string) => {
    if (path === "/products" || path === "/product") {
      return location.pathname.includes("/product");
    }
    return location.pathname === path;
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // تابع جستجو با debounce از lodash
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `https://admin.mydivix.com/api/v1/search/products?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          
          console.log("data  =>" ,  data);
          if (data.success) {
            setSearchResults(data.result.data.map((item: any) => ({
              id: item.id,
              slug: item.slug,
              title: item.title,
              type: 'محصول',
              image: item.image || '/images/placeholder.jpg'
            })));
          } else {
            setSearchResults([]);
            toast.error('خطا در دریافت نتایج جستجو');
          }
        } catch (error) {
          console.error('خطا در جستجdxxdswdxو:', error);
          toast.error('خطا در جستجو');
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500)
  ).current;

  // تابع handleSearch
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const navigate = useNavigate()
  return (
    <header className={`bg-[#fff1cc] text-[#7a4522] shadow-lg relative z-50 `}>
      {/* بخش بالایی هدر */}

      <div className="max-w-7xl container mx-auto">

      <div
        className={`${
          isScrolled ? "fixed top-0 left-0 right-0 bg-[#fff1cc] shadow-lg" : ""
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* لوگو */}
            <div className="flex items-center gap-20">
              {/* منوی اصلی */}
              <div
                className={`flex items-center space-x-2 transition-all duration-500`}
              >
                <img
                 onClick={()=> navigate("/")}
                  src="/images/divix-logo-final.png"
                  alt="Next.js Logo"
                  width={100}
                  height={100}
                  className="dark:invert"
                />
              </div>
              <nav
                className={`hidden lg:flex items-center gap-10  transition-all duration-500 `}
              >
                {menus.map((menu) => {
                  if (
                    menu.type === "static" &&
                    menu.static_type === "products"
                  ) {
                    return (
                      <div
                        key={menu.id}
                        className="relative group"
                        onMouseEnter={() => setIsProductMegaMenuOpen(true)}
                        onMouseLeave={() => setIsProductMegaMenuOpen(false)}
                      >
                        <Link
                          to="/products"
                          className={`flex items-center gap-1 text-primary-gold transition-colors py-2 ${
                            isActiveRoute("/products")
                              ? "text-primary-gold"
                              : ""
                          }`}
                        >
                          {menu.title}
                          <FaAngleDown
                            className={`transition-transform ${
                              isProductMegaMenuOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </Link>

                        <div
                          className={`absolute top-full mt-2 right-0 w-[800px] bg-secondary-black-light rounded-lg shadow-xl transition-all duration-300 ${
                            isProductMegaMenuOpen
                              ? "opacity-100 bg-[#FFF1CC] visible"
                              : "opacity-0 invisible"
                          }`}
                        >
                          <div className="flex">
                            <div className="w-1/4 border-l border-gray-800">
                              <div className="py-4">
                                {categories.map((category, index) => (
                                  <div
                                    key={category.id}
                                    className={`relative px-6 py-3 cursor-pointer transition-all ${
                                      activeCategory === index
                                        ? "text-[var(--primary-light)] bg-[var(--primary)]"
                                        : "text-primary-gold"
                                    }`}
                                    onMouseEnter={() =>
                                      setActiveCategory(index)
                                    }
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{category.title}</span>
                                      <FaAngleRight
                                        className={`transition-transform ${
                                          activeCategory === index
                                            ? "rotate-180"
                                            : "rotate-0"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="w-3/4 p-6">
                              <div className="flex flex-wrap gap-4 overflow-y-auto custom-scrollbar">
                                {categories.map((category, index) => (
                                  <div
                                    key={category.id}
                                    className={`w-full ${
                                      activeCategory === index
                                        ? "block"
                                        : "hidden"
                                    }`}
                                  >
                                    <h3 className="text-primary-gold font-bold mb-4">
                                      {category.title}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      {category.categories.map(
                                        (subCategory) => (
                                          <Link
                                            key={subCategory.id}
                                            to={`/products?category_id=${subCategory.slug}`}
                                            className="flex items-center gap-3 p-2 hover:bg-[#ffffff] rounded-lg transition-colors group"
                                          >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                              {subCategory.image && (
                                                <img
                                                  src={subCategory.image}
                                                  alt={subCategory.title}
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                              )}
                                            </div>
                                            <div>
                                              <span className="hover:text-primary-gold transition-colors block">
                                                {subCategory.title}
                                              </span>
                                              <span className="text-gray-400 text-sm">
                                                {subCategory.products_count}{" "}
                                                محصول
                                              </span>
                                            </div>
                                          </Link>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (menu.type === "static" && menu.static_type === "posts") {
                    return (
                      <div key={menu.id} className="relative group">
                        <Link
                          to="/blogs"
                          className={`flex items-center gap-1 text-primary-gold transition-colors py-2 ${
                            isActiveRoute("/blog") ? "text-primary-gold" : ""
                          }`}
                        >
                          {menu.title}
                        </Link>
                      </div>
                    );
                  }
                  if (menu.type === "normal" && menu.childrenmenus.length > 0) {
                    return (
                      <div
                        key={menu.id}
                        className="relative group"
                        onMouseEnter={() => setOpenMenuId(menu.id)}
                        onMouseLeave={() => setOpenMenuId(null)}
                      >
                        <Link
                          to="/products"
                          className={`flex items-center gap-1 text-primary-gold transition-colors py-2 ${
                            isActiveRoute("/products")
                              ? "text-primary-gold"
                              : ""
                          }`}
                        >
                          {menu.title}
                          <FaCircleChevronDown
                            className={`transition-transform ${
                              openMenuId === menu.id ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </Link>

                        <div
                          className={`absolute rounded-lg top-full right-0 w-fit bg-secondary-black-light border-t border-gray-800 shadow-xl transition-all duration-300 ${
                            openMenuId === menu.id
                              ? "opacity-100 visible"
                              : "opacity-0 invisible"
                          }`}
                        >
                          {menu.childrenmenus.map((childMenu) => (
                            <div
                              key={childMenu.id}
                              className="rounded-lg  childmenu-container relative min-w-[200px] min-w- flex flex-col group/sub"
                            >
                              <Link
                                to={childMenu.link || "#"}
                                className="flex justify-between childmenu-container items-center  min-w-fit px-4 py-2 text-primary-gold hover:bg-white/5 transition-colors"
                              >
                                {childMenu.title}
                                {childMenu.menus &&
                                  childMenu.menus.length > 0 && (
                                    <FaCircleChevronRight
                                      className={`childmenu-svg transition-transform ${
                                        openMenuId === menu.id
                                          ? "hover:rotate-180"
                                          : "rotate-90"
                                      }`}
                                    />
                                  )}
                              </Link>

                              {childMenu.menus &&
                                childMenu.menus.length > 0 && (
                                  <div className="absolute min-w-fit rounded-l-lg top-0 right-full w-fit bg-secondary-black-light border-t border-gray-800 shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300">
                                    {childMenu.menus.map((minimenus: any) => (
                                      <Link
                                        key={minimenus.id}
                                        to={minimenus.link || "#"}
                                        className="block w-full px-4 py-2 text-primary-gold hover:bg-white/5 transition-colors"
                                      >
                                        {minimenus.title}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={menu.id}
                      to={menu.link || "#"}
                      className={`transition-colors ${
                        isActiveRoute(menu.link || "")
                          ? "text-primary-gold"
                          : "text-primary-gold"
                      }`}
                    >
                      {menu.title}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* بخش جستجو و آیکون‌ها */}
            <div className="flex items-center gap-4">
              {/* جستجو */}
              <div ref={searchRef} className=" flex-1">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`p-2 hover:text-[#D97706] transition-colors transition-all duration-500`}
                >
                  <FaSearch className="text-xl" />
                </button>

                {/* پنل جستجو */}
                {isSearchOpen && (
                  <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-500 ${
                      isSearchOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div
                      ref={searchRef}
                      className="flex flex-col w-[95%] sm:w-[80%] md:w-[70%] lg:w-[50%] mx-auto items-center gap-2 mt-4"
                    >
                      <div className="flex w-full items-center gap-2">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="جستجوی محصولات..."
                          className="w-full px-4 py-2 rounded-lg bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 transform scale-100 animate-fadeIn text-sm sm:text-base"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="p-2 hover:text-[#D97706] transition-colors"
                        >
                          <FaTimes className="text-lg sm:text-xl" />
                        </button>
                      </div>
                      {searchQuery.length > 2 && (
                        <div className="w-full bg-white rounded-lg shadow-lg mt-2 p-2 sm:p-4">
                          <h3 className="text-base sm:text-lg font-bold text-[#7a4522] mb-2">
                            نتایج جستجو
                          </h3>
                          {isSearching ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="w-6 h-6 border-2 border-[#7a4522] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                              {searchResults.map((result) => (
                                <Link
                                  key={result.id}
                                  to={`/products/${result?.slug}`}
                                  className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                    setSearchResults([]);
                                  }}
                                >
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={result.image}
                                      alt={result.title}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm sm:text-base truncate">
                                      {result.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {result.type}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-4">نتیجه‌ای یافت نشد</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* سبد خرید */}
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-[#7a4522] hover:text-[#5a3315] transition-colors"
                >
                  <FaShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#7a4522] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* دکمه ورود */}
              <Link
                to={userData?.first_name.length ? "/user-panel" : "/login"}
                className={`hidden md:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2 rounded-full  transition-all duration-500`}
              >
                {userData?.first_name?.length ? (
                  <>
                    <FaUser />
                    <span>
                      {userData.first_name} {userData.last_name}
                    </span>
                  </>
                ) : (
                  <>
                    <FaUser />
                    <span>ورود / ثبت نام</span>
                  </>
                )}
              </Link>

              {/* منوی موبایل */}
              <button
                className={`lg:hidden p-2 hover:text-[#D97706] transition-colors  transition-all duration-500`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        userData={userData}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        menus={menus}
      />

      {/* سبد خرید */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={removeItem}
      />
      </div>

    </header>
  );
};

export default Header;
