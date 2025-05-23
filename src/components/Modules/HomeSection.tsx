import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaTruck,
  FaHandSparkles,
  FaShieldAlt
} from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import type { Category } from "./Header/Header";

const features = [
  {
    id: 1,
    title: "چرم طبیعی و باکیفیت",
    description: "استفاده از چرم طبیعی و باکیفیت در تمام محصولات",
    icon: <FaStar className="text-3xl text-[#6F1D1B]" />,
  },
  {
    id: 2,
    title: "دست‌دوز و منحصر به فرد",
    description: "تولید محصولات به صورت دست‌دوز و منحصر به فرد",
    icon: <FaHandSparkles className="text-3xl text-[#6F1D1B]" />,
  },
  {
    id: 3,
    title: "ضمانت اصالت",
    description: "ضمانت اصالت و کیفیت تمام محصولات",
    icon: <FaShieldAlt className="text-3xl text-[#6F1D1B]" />,
  },
  {
    id: 4,
    title: "تحویل سریع",
    description: "تحویل در کمتر از 24 ساعت در تهران",
    icon: <FaTruck className="text-3xl text-[#6F1D1B]" />,
  },
];

export default function HomeSections() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBannners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://admin.mydivix.com/api/v1/banners", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // فیلتر کردن بنرهای index_middle_banners
        const middleBanners = data.result.filter(
          (banner: any) => banner.group === "index_middle_banners"
        );
        setBanners(middleBanners);
        console.log("middleBanners", data.result)
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannners();
  }, []);

  // دسته‌بندی‌های محصولات
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://admin.mydivix.com/api/v1/categories");
      const data = await response.json();

      if (data.success) {

        setCategories(data.result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 space-y-12 sm:space-y-14 md:space-y-16">
      {/* بخش بنرها */}
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* بنر اول */}

            {banners.slice(2).map((banner: any) => (
              <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src={`https://admin.mydivix.com/${banner?.image}`}
                  alt="بنر تخفیف‌های ویژه"
                  width={600}
                  height={300}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* بخش دسته‌بندی‌ها */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#432818] text-center mb-6 sm:mb-8 flex justify-center items-center gap-2">
            <MdOutlineCategory className="text-xl sm:text-2xl md:text-3xl" />
            <span>دسته‌بندی محصولات</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image || '/images/placeholder.png'}
                  alt={category.title}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#432818] to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                  <div className="absolute bottom-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                        {category.title}
                      </h3>
                    </div>
                    <ul className="space-y-1 sm:space-y-2">
                      {category.categories && category.categories.map((subCategory: any, index: number) => (
                        <li
                          key={subCategory.id || index}
                          className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity"
                        >
                          {subCategory.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* بخش ویژگی‌های فروشگاه */}
      <section className="bg-white py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#432818] mb-3 sm:mb-4">
              چرا ما را انتخاب می‌کنند؟
            </h2>
            <p className="text-sm sm:text-base text-[#666] max-w-2xl mx-auto px-4">
              ما با ارائه محصولات باکیفیت و خدمات عالی، تجربه‌ای متفاوت از خرید
              محصولات چرمی را برای شما فراهم می‌کنیم
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#F3C1A0] backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#FFF1CC] p-2 sm:p-3 rounded-full">
                    {React.cloneElement(feature.icon as React.ReactElement)}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#432818] mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
