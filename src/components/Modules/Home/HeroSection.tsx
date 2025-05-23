import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import type { Category } from "../Header/Header";
import "./HeroSection.css"
interface Slide {
  id: number;
  title: string;
  link: string;
  image: string;
  ordering: number;
  description: string | null;
  published: number;
  group: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchSlides = async () => {
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/sliders/main");
      const data = await response.json();

      if (data.success) {
        // مرتب‌سازی اسلایدها بر اساس فیلد ordering
        const sortedSlides = data.result.sort((a: Slide, b: Slide) => a.ordering - b.ordering);
        setSlides(sortedSlides);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://admin.mydivix.com/api/v1/categories");
      const data = await response.json();

      if (data.success) {
        const allSubCategories = data.result.data.reduce((acc: Category[], category: any) => {
          if (category.categories && category.categories.length > 0) {
            return [...acc, ...category.categories];
          }
          return acc;
        }, []);

        setCategories(allSubCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchCategories();
  }, []);

  const renderSkeletonSlides = () => {
    return Array(3).fill(0).map((_, index) => (
      <SwiperSlide key={`skeleton-${index}`}>
        <div className="relative w-full h-[500px] bg-[#fff1cc] animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent">
            <div className="container mx-auto px-4 py-8 absolute bottom-0">
              <div className="h-8 w-64 bg-[#7A4522]/20 rounded-lg animate-pulse mb-4"></div>
              <div className="h-4 w-48 bg-[#7A4522]/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ));
  };

  const renderSkeleton = () => {
    return Array(8).fill(0).map((_, index) => (
      <SwiperSlide key={`skeleton-${index}`}>
        <div className="flex flex-col items-center">
          <div className="w-22 h-22 p-1 rounded-full border-2 border-[#D97706] animate-pulse">
            <div className="rounded-full overflow-hidden bg-gray-200 w-20 h-20" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded mt-2 animate-pulse" />
        </div>
      </SwiperSlide>
    ));
  };

  if (isLoading) {
    return (
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          speed={800}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="h-[60vh]"
        >
          {renderSkeletonSlides()}

          {/* Navigation Buttons */}
          <div className="swiper-button-next !text-white after:!text-2xl" />
          <div className="swiper-button-prev !text-white after:!text-2xl" />

          {/* Pagination */}
          <div className="swiper-pagination !bottom-4" />
        </Swiper>

        {/* Categories Slider Skeleton */}
        <div className="category-slider bg-[#FFFBF0] pt-4 pb-12 relative">
          <div className="container mx-auto px-4">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              centeredSlides={false}
              slidesPerView={2}
              spaceBetween={30}
              style={{
                width: '100%',
                padding: '0 10px'
              }}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: ".categories-button-next",
                prevEl: ".categories-button-prev",
              }}
              pagination={{
                clickable: true,
                bulletClass: "categories-pagination-bullet",
                bulletActiveClass: "categories-pagination-bullet-active",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 8,
                  spaceBetween: 20,
                },
              }}
            >
              {renderSkeleton()}

              {/* Navigation Buttons */}
              <div className="categories-button-next !text-[#6F1D1B] after:!text-2xl !w-10 !h-10 !bg-white/80 !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-white transition-colors" />
              <div className="categories-button-prev !text-[#6F1D1B] after:!text-2xl !w-10 !h-10 !bg-white/80 !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-white transition-colors" />

              {/* Pagination */}
              <div className="categories-pagination !bottom-0" />
            </Swiper>
          </div>
        </div>
      </div>
    );
  }



  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        speed={800}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="h-[60vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.link} className="block relative w-full h-[100vh]">
              <img
                src={`https://admin.mydivix.com/${slide.image}`}
                alt={slide.title}
                className="object-cover object-center w-full h-[80vh] sm:h-[400px] md:h-[500px] lg:h-[60vh]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="container mx-auto px-4 py-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div className="swiper-button-next !text-white after:!text-2xl" />
        <div className="swiper-button-prev !text-white after:!text-2xl" />

        {/* Pagination */}
        <div className="swiper-pagination !bottom-4" />
      </Swiper>

      {/* Categories Slider */}
      <div className="category-slider bg-[#FFFBF0] pt-4 pb-12 relative">
        <div className="container mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            centeredSlides={false}
            slidesPerView={2}
            spaceBetween={30}
            style={{
              width: '100%',
              padding: '0 10px'
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".categories-button-next",
              prevEl: ".categories-button-prev",
            }}
            pagination={{
              clickable: true,
              bulletClass: "categories-pagination-bullet",
              bulletActiveClass: "categories-pagination-bullet-active",
            }}
            breakpoints={{
              640: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 20,
              },
            }}
          >
            {categories.map((category: Category) => (
              <SwiperSlide key={category.id}>
                <div className="flex flex-col items-center">
                  <div className="w-22 h-22 p-[2px] rounded-full border-2 border-[#D97706] hover:border-[#B45309] transition-colors duration-300 overflow-hidden">
                    <div className="w-full h-full">
                      <img
                        src={category?.image || '/images/placeholder.png'}
                        alt={category.title}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration- rounded-full"
                      />
                    </div>
                  </div>
                <h3 className="text-sm font-medium text-[#432818] text-center mt-2 hover:text-[#6F1D1B] transition-colors duration-300">
                  {category.title}
                </h3>
                </div>
              </SwiperSlide>
            ))}

            {/* Navigation Buttons */}
            <div className="categories-button-next !text-[#6F1D1B] after:!text-2xl !w-10 !h-10 !bg-white/80 !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-white transition-colors" />
            <div className="categories-button-prev !text-[#6F1D1B] after:!text-2xl !w-10 !h-10 !bg-white/80 !rounded-full !flex !items-center !justify-center !shadow-lg hover:!bg-white transition-colors" />

            {/* Pagination */}
            <div className="categories-pagination !bottom-0" />
          </Swiper>
        </div>
      </div>
    </div>
  );
}
