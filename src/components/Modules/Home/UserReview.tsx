import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TfiCommentAlt } from "react-icons/tfi";
export default function UserReview() {
  const testimonials = [
    {
      id: 1,
      name: "علی محمدی",
      comment: "کیفیت محصولات فوق‌العاده است. بسیار راضی هستم.",
      rating: 5,
      image: "/images/header_image.jpg",
    },
    {
      id: 2,
      name: "مریم احمدی",
      comment: "تحویل سریع و بسته‌بندی بسیار خوب.",
      rating: 4,
      image: "/images/header_image.jpg",
    },
    {
      id: 3,
      name: "رضا حسینی",
      comment: "پشتیبانی عالی و محصولات با کیفیت.",
      rating: 5,
      image: "/images/header_image.jpg",
    },
  ];

  return (
    <section className="container mx-auto">
      <h2 className="text-2xl font-bold text-[#222] text-[#222] gap-2 text-[] text-center mb-12 flex items-center justify-center">
        <TfiCommentAlt />
        <span>نظرات مشتریان</span>
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover h-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#222]">
                    {testimonial.name}
                  </h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < testimonial.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#666]">{testimonial.comment}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
