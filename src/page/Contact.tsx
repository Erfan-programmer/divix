'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet";

import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaInstagram, FaTelegram, FaTruck, FaHeadset, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography,
  styled,
  Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, Toaster } from 'react-hot-toast';

// استایل سفارشی برای آکاردئون
const StyledAccordion = styled(Accordion)(({  }) => ({
  backgroundColor: '#FFF1CC',
  color: '#7A4522',
  borderRadius: '12px !important',
  marginBottom: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  fontFamily: 'IRANYekan',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    backgroundColor: '#7A4522',
    color: '#FFF1CC',
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#FFF1CC',
    },
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: '12px 20px',
  minHeight: '48px !important',
  '& .MuiAccordionSummary-content': {
    margin: '8px 0',
  },
});

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: '12px 20px',
  backgroundColor: 'white',
  color: '#7A4522',
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  fontFamily: 'IRANYekan',
});

const MapSkeleton = styled(Skeleton)(({  }) => ({
  height: '100%',
  minHeight: '300px',
  borderRadius: '12px',
  backgroundColor: '#7A4522',
  opacity: 0.1,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    animation: 'shining 1.5s infinite',
  },
  '@keyframes shining': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
}));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [expanded, setExpanded] = useState<string | false>(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    // شبیه‌سازی زمان لود شدن نقشه
    const timer = setTimeout(() => {
      setIsMapLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const faqItems = [
    {
      question: 'نحوه ارسال سفارش چگونه است؟',
      answer: 'سفارش‌های بالای ۵۰۰ هزار تومان به صورت رایگان ارسال می‌شوند.'
    },
    {
      question: 'مدت زمان تحویل سفارش چقدر است؟',
      answer: 'سفارش‌های تهران در همان روز و شهرستان‌ها در ۲ تا ۳ روز کاری تحویل داده می‌شوند.'
    },
    {
      question: 'آیا امکان بازگشت کالا وجود دارد؟',
      answer: 'بله، در صورت عدم رضایت از کالا تا ۷ روز امکان بازگشت وجود دارد.'
    },
    {
      question: 'روش‌های پرداخت چیست؟',
      answer: 'پرداخت آنلاین، کارت به کارت و پرداخت در محل امکان‌پذیر است.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://admin.mydivix.com/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.ok) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        toast.success('پیام شما با موفقیت ارسال شد');
      } else {
        toast.error('خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('خطا در ارسال پیام:', error);
      toast.error('خطا در ارسال پیام');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const customIcon = new L.Icon({
  iconUrl: "/images/location.png",  
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3C1A0] to-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#7A4522',
            color: '#fff',
            fontFamily: 'IRANYekan',
            borderRadius: '8px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#7A4522',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#7A4522',
            },
          },
        }}
      />
      {/* هدر صفحه */}
      <div className="relative h-[30vh] md:h-[40vh] lg:h-[50vh] w-full">
        <img
          src="/images/header_image.jpg"
          alt="درباره فروشگاهی"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-[#432818]/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">تماس با ما</h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
              ما همیشه آماده پاسخگویی به سوالات شما هستیم
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 -mt-8">
        {/* بخش خدمات فروشگاهی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-12">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaTruck className="text-[#7A4522] text-2xl md:text-3xl mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-center mb-1 md:mb-2 text-sm md:text-base" style={{ color: '#7A4522' }}>ارسال رایگان</h3>
            <p className="text-xs md:text-sm text-center text-gray-600">برای خرید بالای ۵۰۰ هزار تومان</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaShieldAlt className="text-[#7A4522] text-2xl md:text-3xl mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-center mb-1 md:mb-2 text-sm md:text-base" style={{ color: '#7A4522' }}>ضمانت اصالت</h3>
            <p className="text-xs md:text-sm text-center text-gray-600">گارانتی ۷ روزه بازگشت</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaHeadset className="text-[#7A4522] text-2xl md:text-3xl mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-center mb-1 md:mb-2 text-sm md:text-base" style={{ color: '#7A4522' }}>پشتیبانی ۲۴ ساعته</h3>
            <p className="text-xs md:text-sm text-center text-gray-600">پاسخگویی آنلاین</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaCreditCard className="text-[#7A4522] text-2xl md:text-3xl mx-auto mb-2 md:mb-3" />
            <h3 className="font-bold text-center mb-1 md:mb-2 text-sm md:text-base" style={{ color: '#7A4522' }}>پرداخت امن</h3>
            <p className="text-xs md:text-sm text-center text-gray-600">پرداخت آنلاین و امن</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* اطلاعات تماس */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white md:pb-8 rounded-xl shadow-lg">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 bg-[#432818] text-white p-2 pr-4 rounded-t-lg">اطلاعات تماس</h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-[#FFF1CC] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#7A4522] text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-sm md:text-base" style={{ color: '#7A4522' }}>آدرس</h3>
                    <p className="text-xs md:text-sm text-gray-600">تهران، خیابان ولیعصر، پلاک 123</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-[#FFF1CC] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center">
                    <FaPhone className="text-[#7A4522] text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-sm md:text-base" style={{ color: '#7A4522' }}>تلفن</h3>
                    <p className="text-xs md:text-sm text-gray-600">021-12345678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-[#FFF1CC] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center">
                    <FaEnvelope className="text-[#7A4522] text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-sm md:text-base" style={{ color: '#7A4522' }}>ایمیل</h3>
                    <p className="text-xs md:text-sm text-gray-600">info@frogstore.ir</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-[#FFF1CC] transition-colors duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center">
                    <FaClock className="text-[#7A4522] text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-sm md:text-base" style={{ color: '#7A4522' }}>ساعات کاری</h3>
                    <p className="text-xs md:text-sm text-gray-600">شنبه تا پنجشنبه: 9:00 - 21:00</p>
                  </div>
                </div>
              </div>

              {/* شبکه‌های اجتماعی */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                <h3 className="font-bold mb-3 md:mb-4 text-center text-sm md:text-base" style={{ color: '#7A4522' }}>ارتباط با ما در شبکه‌های اجتماعی</h3>
                <div className="flex justify-center gap-4 md:gap-6">
                  <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center hover:bg-[#7A4522] group transition-colors duration-300">
                    <FaWhatsapp className="text-xl md:text-2xl text-[#7A4522] group-hover:text-white transition-colors duration-300" />
                  </a>
                  <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center hover:bg-[#7A4522] group transition-colors duration-300">
                    <FaInstagram className="text-xl md:text-2xl text-[#7A4522] group-hover:text-white transition-colors duration-300" />
                  </a>
                  <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1CC] flex items-center justify-center hover:bg-[#7A4522] group transition-colors duration-300">
                    <FaTelegram className="text-xl md:text-2xl text-[#7A4522] group-hover:text-white transition-colors duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* نقشه */}
          <div className="h-[300px] md:h-[400px] lg:h-[600px] bg-white rounded-xl shadow-lg overflow-hidden relative">
            {isMapLoading ? (
              <MapSkeleton variant="rectangular" animation="wave" />
            ) : (
              <MapContainer
                center={[35.7219, 51.3347]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[35.7219, 51.3347]} icon={customIcon}>
                  <Popup>
                    فروگشاهی <br /> تهران، خیابان ولیعصر
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>

        {/* فرم تماس و سوالات متداول */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
          {/* فرم تماس */}
          <div className="bg-white rounded-xl shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white rounded-t-lg p-2 pr-4 bg-[#432818]" >فرم تماس</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 p-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: '#7A4522' }}>نام و نام خانوادگی</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 rounded-lg border border-gray-300 focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: '#7A4522' }}>ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 rounded-lg border border-gray-300 focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: '#7A4522' }}>موضوع</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 rounded-lg border border-gray-300 focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: '#7A4522' }}>پیام</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 rounded-lg border border-gray-300 focus:border-[#7A4522] focus:ring-2 focus:ring-[#7A4522]/20 transition-all duration-300 h-32 resize-none text-sm md:text-base"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 md:py-3 px-4 md:px-6 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#7A4522' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال ارسال...
                  </>
                ) : (
                  'ارسال پیام'
                )}
              </button>
            </form>
          </div>

          {/* سوالات متداول */}
          <div className="bg-white rounded-xl shadow-lg">
            <h2 className="text-lg md:text-xl bg-[#432818] rounded-t-lg p-2 font-bold mb-4 pr-4 md:mb-6 text-white">سوالات متداول</h2>
            <div className="space-y-4 sm:p-4">
              {faqItems.map((item, index) => (
                <StyledAccordion 
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                >
                  <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                      transition: 'transform 0.3s ease',
                      fontFamily: 'IRANYekan',
                      '&:hover': {
                        transform: 'translateX(8px)'
                      }
                    }}>
                      {item.question}
                    </Typography>
                  </StyledAccordionSummary>
                  <StyledAccordionDetails>
                    <Typography sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      lineHeight: 1.6,
                      fontFamily: 'IRANYekan'
                    }}>
                      {item.answer}
                    </Typography>
                  </StyledAccordionDetails>
                </StyledAccordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;