import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTimes, FaAngleLeft } from "react-icons/fa";

interface Category {
  id: number;
  image: string;
  title: string;
  slug: string;
  categories: any[];
  category_id: number | null;
  products_count: number;
}

interface SubMenu {
  id: number;
  title: string;
  link: string | null;
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
interface userData  {
  first_name: string;
  last_name: string;
  profile_photo_url: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  userData: userData | null;
  onClose: () => void;
  categories?: Category[];
  menus?: Menu[];
}

interface AccordionProps {
  title: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  href?: string;
  isActiveRoute?: boolean;
}

const Accordion = ({
  title,
  isActive,
  onToggle,
  children,
  href,
  isActiveRoute,
}: AccordionProps) => {
  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-300 ${isActive ? "bg-[#7a4522] text-[#FFF1CC]" : "bg-white text-[#473e39]"
          }`}
      >
        {href ? (
          <Link
            to={href}
            className={`flex-1 ${isActive
                ? "text-[#FFF1CC]"
                : isActiveRoute
                  ? "text-[#7a4522]"
                  : "text-[#473e39]"
              }`}
          >
            {title}
          </Link>
        ) : (
          <span
            className={`flex-1 ${isActive ? "text-[#FFF1CC]" : "text-[#473e39]"
              }`}
          >
            {title}
          </span>
        )}
        <button onClick={onToggle} className="p-2">
          <FaAngleLeft
            className={`transition-transform duration-300 ${isActive ? "rotate-90 text-[#FFF1CC]" : "rotate-0"
              }`}
          />
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="pr-4 space-y-2">{children}</div>
      </div>
    </div>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  userData,
  categories = [],
  menus = [],
}: MobileMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(
    null
  );

  const isActiveRoute = (path: string) => {
    if (path === "/products" || path === "/product") {
      return location.pathname.includes("/product");
    }
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-y-0 right-0 w-[85%] max-w-md bg-[#FFF1CC] shadow-xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر منو */}
        <div className="flex items-center justify-between p-4 border-b border-[#fff1cc]">
          <button
            onClick={onClose}
            className="p-2 hover:text-[#D97706] transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2 rounded-full"
          >
            {userData?.first_name?.length ? (
              <>
                <FaUser />
                <span>
                  {userData?.first_name} {userData?.last_name}
                </span>
              </>
            ) : (
              <>
                <FaUser />
                <span>ورود / ثبت نام</span>
              </>
            )}
          </Link>
        </div>

        {/* محتوای منو */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4 space-y-4">
            {menus.map((menu) => {
              if (menu.type === "static" && menu.static_type === "products") {
                return (
                  <Accordion
                    key={menu.id}
                    title={menu.title}
                    isActive={activeCategory === menu.id}
                    onToggle={() =>
                      setActiveCategory(
                        activeCategory === menu.id ? null : menu.id
                      )
                    }
                    href="/products"
                    isActiveRoute={isActiveRoute("/products")}
                  >
                    {categories.map((category) => (
                      <Accordion
                        key={category.id}
                        title={category.title}
                        isActive={activeSubCategory === category.id}
                        onToggle={() =>
                          setActiveSubCategory(
                            activeSubCategory === category.id
                              ? null
                              : category.id
                          )
                        }
                        href={`/products?category_id=${category.id}`}
                      >
                        {category.categories.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            to={`/products?category_id=${subCategory.id}`}
                            className="flex items-center gap-3 p-2 bg-white/30 rounded-lg hover:bg-white/50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              {subCategory.image && (
                                <img
                                  src={subCategory.image}
                                  alt={subCategory.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <span className="block text-[#473e39]">
                                {subCategory.title}
                              </span>
                              <span className="text-sm text-gray-500">
                                {subCategory.products_count} محصول
                              </span>
                            </div>
                          </Link>
                        ))}
                      </Accordion>
                    ))}
                  </Accordion>
                );
              }

              if (menu.type === "static" && menu.static_type === "posts") {
                return (
                  <Link
                    key={menu.id}
                    to="/blogs"
                    className={`block p-2 bg-white rounded-lg ${isActiveRoute("/blog")
                        ? "text-[#7a4522]"
                        : "text-[#473e39]"
                      }`}
                  >
                    {menu.title}
                  </Link>
                );
              }

              if (menu.type === "normal" && menu.childrenmenus.length > 0) {
                return (
                  <Accordion
                    key={menu.id}
                    title={menu.title}
                    isActive={activeCategory === menu.id}
                    onToggle={() =>
                      setActiveCategory(
                        activeCategory === menu.id ? null : menu.id
                      )
                    }
                    href={menu.link || "#"}
                    isActiveRoute={isActiveRoute(menu.link || "")}
                  >
                    {menu.childrenmenus.map((childMenu) => (
                      <Accordion
                        key={childMenu.id}
                        title={childMenu.title}
                        isActive={activeSubCategory === childMenu.id}
                        onToggle={() =>
                          setActiveSubCategory(
                            activeSubCategory === childMenu.id
                              ? null
                              : childMenu.id
                          )
                        }
                      >
                        {childMenu.menus?.map((subMenu: SubMenu) => (
                          <Link
                            key={subMenu.id}
                            to={subMenu.link || "#"}
                            className="block p-2 bg-white/30 rounded-lg hover:bg-white/50 transition-colors text-[#473e39]"
                          >
                            {subMenu.title}
                          </Link>
                        ))}
                      </Accordion>
                    ))}
                  </Accordion>
                );
              }

              return (
                <Link
                  key={menu.id}
                  to={menu.link || "#"}
                  className={`block p-2 bg-white rounded-lg ${isActiveRoute(menu.link || "")
                      ? "text-[#7a4522]"
                      : "text-[#473e39]"
                    }`}
                >
                  {menu.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
