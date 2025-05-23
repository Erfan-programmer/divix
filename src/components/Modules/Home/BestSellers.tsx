import {Link} from "react-router-dom";
import {  FaArrowLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCards } from "swiper/modules";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  regular_price?: number | null;
  sale_price?: number | null;
  image: string;
  category: string;
  is_available: boolean;
  slug: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "کیف چرم دست‌دوز",
    price: 1200000,
    regular_price: 1500000,
    sale_price: 1200000,
    image: "/images/header_image.jpg",
    category: "کیف چرم",
    is_available: true,
    slug: "leather-bag",
  },
  {
    id: 2,
    title: "کفش چرم مردانه",
    price: 1800000,
    regular_price: 2000000,
    sale_price: 1800000,
    image: "/images/header_image.jpg",
    category: "کفش چرم",
    is_available: true,
    slug: "leather-shoes",
  },
  {
    id: 3,
    title: "کیف پول چرم",
    price: 650000,
    regular_price: 800000,
    sale_price: 650000,
    image: "/images/header_image.jpg",
    category: "کیف چرم",
    is_available: true,
    slug: "leather-wallet",
  },
  {
    id: 4,
    title: "کفش چرم زنانه",
    price: 1500000,
    regular_price: 1800000,
    sale_price: 1500000,
    image: "/images/header_image.jpg",
    category: "کفش چرم",
    is_available: true,
    slug: "leather-women-shoes",
  },
];

export default function BestSellers() {
  return (
    <div className="container mx-auto px-4">
      <section className="bg-[#f3c1a0] prouduct-slider rounded-2xl sm:rounded-3xl shadow-lg">
        <div className="flex justify-between rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4 bg-[#7a4522] items-center mb-8 sm:mb-10 md:mb-12">
          <div className="text-right">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">پرفروش ترین دستبند ها</h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 sm:gap-2 text-white text-sm sm:text-base transition-colors duration-300"
          >
            مشاهده همه
            <FaArrowLeft className="text-xs sm:text-sm" />
          </Link>
        </div>
        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          <Swiper
            modules={[Navigation, Autoplay, EffectCards]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={{
                    id: product.id,
                    title: product.title,
                    title_en: product.title,
                    type: "product",
                    price: product.price || 0,
                    regular_price: product.regular_price || 0,
                    sale_price: product.sale_price || 0,
                    slug: product.slug,
                    image: product.image,
                    special: false,
                    category: product.category,
                    published_date: new Date().toISOString(),
                    is_available: product.is_available
                  }}
                />
              </SwiperSlide>
            ))}
            <button className="swiper-button-prev !w-8 !h-8 sm:!w-10 sm:!h-10 !bg-[#FFF1CC] !text-[#6F1D1B] text-[.8rem] !rounded-full"></button>
            <button className="swiper-button-next !w-8 !h-8 sm:!w-10 sm:!h-10 !bg-[#FFF1CC] !text-[#6F1D1B] text-[.8rem] !rounded-full"></button>
          </Swiper>
        </div>
      </section>
    </div>
  );
}

