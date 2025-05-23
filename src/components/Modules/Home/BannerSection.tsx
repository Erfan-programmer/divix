import { Navigation, Autoplay } from "swiper/modules";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";

export default function BannerSection() {
  const banners = [
    {
      id: 1,
      image:
        "/images/leathers/banner_SlideBanner_HHklb2_508a08fb-65da-4f8f-9dd8-ec1c67a59b9c.webp",
      title: "کیف‌های چرمی دست‌دوز",
      description:
        "کیف‌های چرمی با طراحی منحصر به فرد و کیفیت عالی، مناسب برای هر سلیقه و مناسبت",
    },
    {
      id: 2,
      image:
        "/images/leathers/banner_SlideBanner_HHklb2_508a08fb-65da-4f8f-9dd8-ec1c67a59b9c.webp",
      title: "کمربندهای چرمی لوکس",
      description: "کمربندهای چرمی با دوام و زیبا، مناسب برای آقایان و بانوان",
    },
    {
      id: 3,
      image:
        "/images/leathers/banner_SlideBanner_HHklb2_508a08fb-65da-4f8f-9dd8-ec1c67a59b9c.webp",
      title: "جا سوئیچی‌های چرمی",
      description: "جا سوئیچی‌های چرمی با طرح‌های متنوع و کیفیت عالی",
    },
    {
      id: 4,
      image:
        "/images/leathers/banner_SlideBanner_HHklb2_508a08fb-65da-4f8f-9dd8-ec1c67a59b9c.webp",
      title: "تخفیف‌های ویژه",
      description: "تا 50% تخفیف روی محصولات منتخب، فرصت را از دست ندهید",
    },
    {
      id: 5,
      image:
        "/images/leathers/banner_SlideBanner_HHklb2_508a08fb-65da-4f8f-9dd8-ec1c67a59b9c.webp",
      title: "محصولات جدید",
      description: "جدیدترین محصولات چرمی با طراحی‌های مدرن و زیبا",
    },
  ];
  return (
    <section className="relative min-h-screen bg-[#FFFBF0] py-8 md:py-16 mt-10">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col md:flex-row h-full items-stretch gap-4">
          {banners.length <= 2 ? (
            // نمایش ساده برای 3 بنر یا کمتر
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative h-[50vh] md:h-[80vh] rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img src={banner.image} alt="" className="object-cover h-full object-center" />
                </div>
              ))}
            </div>
          ) : banners.length <= 2 ? (
            // نمایش دو اسلایدر برای 4 تا 5 بنر
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[50vh] md:h-[80vh] relative overflow-hidden rounded-2xl">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  speed={1000}
                  autoplay={false}
                  className="h-full group/swiper !overflow-hidden"
                >
                  {banners
                    .slice(0, Math.ceil(banners.length / 2))
                    .map((banner) => (
                      <SwiperSlide
                        key={banner.id}
                        className="h-[10rem] sm:h-auto"
                      >
                        <div className="relative h-full group cursor-pointer overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="object-cover h-full object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-[#432818]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="group text-center transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition-all duration-500 p-4 md:p-8">
                              <h3 className="text-xl md:text-3xl group-hover:opacity-100 opacity-0 transition-all duration-500 text-[#FFF1CC] mb-2 md:mb-4">
                                {banner.title}
                              </h3>
                              <p className="text-sm md:text-base group-hover:opacity-100 opacity-0 transition-all duration-500 text-gray-200 max-w-md">
                                {banner.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="h-[50vh] md:h-[80vh] relative overflow-hidden rounded-2xl">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  speed={1000}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    reverseDirection: true,
                  }}
                  className="h-full group/swiper !overflow-hidden"
                >
                  {banners
                    .slice(Math.ceil(banners.length / 2))
                    .map((banner) => (
                      <SwiperSlide
                        key={banner.id}
                        className="h-[10rem] sm:h-auto"
                      >
                        <div className="relative h-full group cursor-pointer overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="object-cover h-full object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-[#432818]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="group text-center transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition-all duration-500 p-4 md:p-8">
                              <h3 className="text-xl md:text-3xl group-hover:opacity-100 opacity-0 transition-all duration-500 text-[#FFF1CC] mb-2 md:mb-4">
                                {banner.title}
                              </h3>
                              <p className="text-sm md:text-base group-hover:opacity-100 opacity-0 transition-all duration-500 text-gray-200 max-w-md">
                                {banner.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <>
              {/* Right Side Slider */}
              <div className="right-carousel md:w-1/3 relative overflow-hidden rounded-2xl md:rounded-l-2xl">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  speed={1000}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    reverseDirection: true,
                  }}
                  className="h-full group/swiper !overflow-hidden"
                >
                  {banners
                    .slice(0, Math.ceil(banners.length / 3))
                    .map((banner) => (
                      <SwiperSlide
                        key={banner.id}
                        className="h-[28rem] sm:h-auto"
                      >
                        <div className="relative h-full group cursor-pointer overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="object-cover h-full object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-[#432818]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="group text-center transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition-all duration-500 p-4 md:p-8">
                              <h3 className="text-xl md:text-3xl group-hover:opacity-100 opacity-0 transition-all duration-500 text-[#FFF1CC] mb-2 md:mb-4">
                                {banner.title}
                              </h3>
                              <p className="text-sm md:text-base group-hover:opacity-100 opacity-0 transition-all duration-500 text-gray-200 max-w-md">
                                {banner.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>

              {/* Left Side Sliders */}
              {/* Top Carousel */}
              <div className="top-carousel md:w-1/3 h-[80vh] relative overflow-hidden rounded-2xl md:rounded-tr-2xl">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  speed={1000}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    reverseDirection: true,
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next-top",
                    prevEl: ".swiper-button-prev-top",
                  }}
                  className="h-full group/swiper !overflow-hidden"
                >
                  {banners
                    .slice(
                      Math.ceil(banners.length / 3),
                      Math.ceil((banners.length * 2) / 3)
                    )
                    .map((banner) => (
                      <SwiperSlide
                        key={banner.id}
                        className="h-[10rem] sm:h-auto"
                      >
                        <div className="relative h-full group cursor-pointer overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="object-cover h-full object-center object-center h-[100vh]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-[#432818]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="group text-center transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition-all duration-500 px-4 md:px-6">
                              <div className="text-lg md:text-2xl group-hover:opacity-100 opacity-0 transition-all duration-500 text-[#FFF1CC] mt-2 md:mt-4">
                                {banner.title}
                              </div>
                              <div className="mt-2 md:mt-4 text-sm md:text-base group-hover:opacity-100 opacity-0 transition-all duration-500 text-gray-200 max-w-md">
                                {banner.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  <div className="swiper-button-prev-top absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF1CC]/80 hover:bg-[#FFF1CC] flex items-center justify-center cursor-pointer z-10 transition-all duration-300 opacity-100">
                    <BsArrowLeft className="text-[#432818] text-lg md:text-xl" />
                  </div>
                  <div className="swiper-button-next-top absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF1CC]/80 hover:bg-[#FFF1CC] flex items-center justify-center cursor-pointer z-10 transition-all duration-300 opacity-100">
                    <BsArrowRight className="text-[#432818] text-lg md:text-xl" />
                  </div>
                </Swiper>
              </div>

              {/* Bottom Carousel */}
              <div className="bottom-carousel md:w-1/3 h-[80vh] relative overflow-hidden rounded-2xl md:rounded-br-2xl">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  speed={1000}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    reverseDirection: true,
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next-bottom",
                    prevEl: ".swiper-button-prev-bottom",
                  }}
                  className="h-full group/swiper !overflow-hidden"
                >
                  {banners
                    .slice(Math.ceil((banners.length * 2) / 3))
                    .map((banner) => (
                      <SwiperSlide key={banner.id}>
                        <div className="relative h-full group cursor-pointer overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="object-cover h-full object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-[#432818]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="group text-center transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100 opacity-0 transition-all duration-500 px-4 md:px-6">
                              <div className="text-lg md:text-2xl group-hover:opacity-100 opacity-0 transition-all duration-500 text-[#FFF1CC] mt-2 md:mt-4">
                                {banner.title}
                              </div>
                              <div className="mt-2 md:mt-4 text-sm md:text-base group-hover:opacity-100 opacity-0 transition-all duration-500 text-gray-200 max-w-md">
                                {banner.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  <div className="swiper-button-prev-bottom absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF1CC]/80 hover:bg-[#FFF1CC] flex items-center justify-center cursor-pointer z-10 transition-all duration-300 opacity-100">
                    <BsArrowLeft className="text-[#432818] text-lg md:text-xl" />
                  </div>
                  <div className="swiper-button-next-bottom absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF1CC]/80 hover:bg-[#FFF1CC] flex items-center justify-center cursor-pointer z-10 transition-all duration-300 opacity-100">
                    <BsArrowRight className="text-[#432818] text-lg md:text-xl" />
                  </div>
                </Swiper>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
