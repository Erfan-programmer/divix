import { FaArrowLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "./ProductLists.css"
import ProductCard from "./ProductCard";
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "کیف چرم دست‌دوز",
    price: 1200000,
    image: "/images/header_image.jpg",
    category: "کیف",
  },
  {
    id: 2,
    title: "کمربند چرم طبیعی",
    price: 450000,
    image: "/images/header_image.jpg",
    category: "کمربند",
  },
  {
    id: 3,
    title: "کفش چرم مردانه",
    price: 1800000,
    image: "/images/header_image.jpg",
    category: "کفش",
  },
  {
    id: 4,
    title: "دستبند چرم دست‌دوز",
    price: 350000,
    image: "/images/header_image.jpg",
    category: "اکسسوری",
  },
  {
    id: 5,
    title: "کیف پول چرم",
    price: 650000,
    image: "/images/header_image.jpg",
    category: "کیف",
  },
  {
    id: 6,
    title: "کمربند چرم زنانه",
    price: 380000,
    image: "/images/header_image.jpg",
    category: "کمربند",
  },
];

export default function ProductLists() {
  return (
    <div className="bg-[#FFFBF0] py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        {/* عنوان بخش */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#432818]">محصولات پرفروش</h2>
          <Link
            to="/products"
            className="text-sm sm:text-base text-[#7A4522] hover:text-[#432818] transition-colors duration-300"
          >
            مشاهده همه
          </Link>
        </div>

        {/* اسلایدر محصولات */}
        <section className="bg-[#F3C1A0] prouduct-slider rounded-2xl sm:rounded-3xl shadow-lg">
          <div className="flex bg-[#7a4522] rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4 justify-between items-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-right">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">پرفروش‌ها</h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 sm:gap-2 text-white text-sm sm:text-base transition-colors duration-300"
            >
              مشاهده همه
              <FaArrowLeft className="text-xs sm:text-sm" />
            </Link>
          </div>
          <div className="pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
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
                  <ProductCard product={{
                    id: product.id,
                    title: product.title,
                    title_en: product.title,
                    type: "product",
                    price: product.price || 0,
                    regular_price: product.price || 0,
                    sale_price: product.price || 0,
                    slug: `product-${product.id}`,
                    image: product.image,
                    special: false,
                    category: product.category,
                    published_date: new Date().toISOString(),
                    is_available: true
                  }} />
                </SwiperSlide>
              ))}
              <button className="swiper-button-prev !w-8 !h-8  p-4 !bg-[#FFF1CC] !text-[#6F1D1B] text-[.rem] !rounded-full"></button>
              <button className="swiper-button-next !w-8 !h-8  p-4 sm:!w-10 sm:!h-10 !bg-[#FFF1CC] !text-[#6F1D1B] text-[.8rem] !rounded-full"></button>
            </Swiper>
          </div>
        </section>
      </div>
    </div>
  );
}
