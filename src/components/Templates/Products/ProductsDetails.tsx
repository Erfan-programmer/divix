import React, { useState, useRef, useEffect } from "react";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaComment,
  FaRegStar,
  FaTrash,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import { FaStar, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import { toast, Toaster } from "react-hot-toast";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useCart } from "../../../ContextApi/CartProvider";
import { addToCart, removeFromCart, updateCartItemQuantity } from "./../../../utils/Cart"

const StyledAccordion = styled(Accordion)(({ }) => ({
  border: "1px solid #fff1cc",
  borderRadius: "0.5rem",
  marginBottom: "1rem",
  "&:before": {
    display: "none",
  },
})) as typeof Accordion;

const StyledAccordionSummary = styled(AccordionSummary)(({ }) => ({
  padding: "1rem",
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
})) as typeof AccordionSummary;

const StyledAccordionDetails = styled(AccordionDetails)(({ }) => ({
  padding: "1rem",
  borderTop: "1px solid #fff1cc",
})) as typeof AccordionDetails;

const CustomExpandIcon = ({ expanded }: { expanded: boolean }) => (
  <div className="w-6 h-6 flex items-center justify-center text-[#7a4522]">
    {expanded ? (
      <FaMinus className="w-4 h-4" />
    ) : (
      <FaPlus className="w-4 h-4" />
    )}
  </div>
);

const sampleReviews = [
  {
    id: 1,
    user: {
      name: "علی محمدی",
      avatar: "/images/avatar1.jpg",
    },
    rating: 5,
    date: "۱۴۰۲/۱۲/۱۵",
    comment:
      "کیف بسیار با کیفیت و زیبا. چرم طبیعی و دوخت عالی. کاملاً راضی هستم.",
  },
  {
    id: 2,
    user: {
      name: "مریم احمدی",
      avatar: "/images/avatar2.jpg",
    },
    rating: 4,
    date: "۱۴۰۲/۱۲/۱۰",
    comment: "کیف خوبی هست، فقط قیمت‌ش کمی بالاست. کیفیت ساخت عالیه.",
  },
  {
    id: 3,
    user: {
      name: "رضا حسینی",
      avatar: "/images/avatar3.jpg",
    },
    rating: 5,
    date: "۱۴۰۲/۱۲/۰۵",
    comment: "دست‌دوزی فوق‌العاده و طراحی مدرن. پیشنهاد می‌کنم حتماً بخرید.",
  },
];

const sampleProduct = {
  id: "1",
  name: "کیف چرمی دست‌دوز",
  description:
    "کیف چرمی دست‌دوز با طراحی مدرن و کیفیت بالا، مناسب برای استفاده روزمره",
  price: 2500000,
  originalPrice: 3000000,
  images: [
    "/images/header_image.jpg",
    "/images/header_image.jpg",
    "/images/header_image.jpg",
    "/images/header_image.jpg",
  ],
  category: "کیف",
  code: "BAG-001",
  tags: ["چرم طبیعی", "دست‌دوز", "مدرن", "کیف روزانه"],
  colors: ["#7a4522", "#473e39", "#fff1cc"],
  details:
    "این کیف چرمی با استفاده از بهترین چرم طبیعی و با دست‌دوزی استادکاران ایرانی ساخته شده است. طراحی مدرن و کاربردی آن، آن را به یک انتخاب ایده‌آل برای استفاده روزمره تبدیل کرده است.",
  specifications:
    "جنس: چرم طبیعی\nابعاد: 30×20×10 سانتی‌متر\nوزن: 800 گرم\nتعداد جیب: 3 عدد\nقابلیت شستشو: خشک‌شویی",
  reviews: sampleReviews,
};

interface AccordionItem {
  id: string;
  question: string;
  type: "text" | "reviews";
  content: string | typeof sampleReviews;
}

const accordionItems: AccordionItem[] = [
  {
    id: "details",
    question: "جزئیات محصول",
    type: "text",
    content: sampleProduct?.details,
  },
  {
    id: "specs",
    question: "مشخصات فنی",
    type: "text",
    content: sampleProduct?.specifications,
  },
  {
    id: "reviews",
    question: "نظرات کاربران",
    type: "reviews",
    content: sampleProduct?.reviews,
  },
];

interface Review {
  id: number;
  rating: number;
  comment: string;
  advantages: string[];
  disadvantages: string[];
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface ReviewResponse {
  success: boolean;
  message: string;
  result: {
    data: Review[];
  };
}

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="border-b border-[#fff1cc] last:border-b-0 py-4">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-[#432818] flex items-center justify-center">
        <FaUser className="w-6 h-6 text-[#FFF1CC]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-bold text-[#171717]">{review.user.name}</h4>
            <span className="text-sm text-[#473e39]">
              {new Date(review.created_at).toLocaleDateString('fa-IR')}
            </span>
          </div>
          <Rating
            icon={<FaStar size={24} color="#7a4522" />}
            emptyIcon={<FaRegStar size={24} color="#fff1cc" />}
            value={review.rating}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#7a4522",
              },
              "& .MuiRating-iconEmpty": {
                color: "#fff1cc",
              },
            }}
          />
        </div>
        <p className="text-[#473e39] text-sm leading-6 mb-3">{review.comment}</p>

        {/* مزایا و معایب */}
        {(review.advantages.length > 0 || review.disadvantages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {review.advantages.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-green-600 mb-2">مزایا:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {review.advantages.map((advantage, index) => (
                    <li key={index} className="text-sm text-[#473e39]">{advantage}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.disadvantages.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-red-600 mb-2">معایب:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {review.disadvantages.map((disadvantage, index) => (
                    <li key={index} className="text-sm text-[#473e39]">{disadvantage}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

interface SubmitReviewRequest {
  comment: string;
}

const ReviewForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (review: SubmitReviewRequest) => void;
  onCancel: () => void;
}) => {
  const [comment, setComment] = useState("");

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-[#fff1cc]">
      <h3 className="text-xl font-bold text-[#171717] mb-6">ثبت نظر جدید</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ comment });
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Typography className="text-[#473e39]">نظر شما:</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="تجربه خود را از خرید و استفاده از این محصول با دیگران به اشتراک بگذارید..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#fff1cc",
                },
                "&:hover fieldset": {
                  borderColor: "#7a4522",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7a4522",
                },
              },
            }}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#432818",
              "&:hover": {
                bgcolor: "#7a4522",
              },
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            ثبت نظر
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={onCancel}
            sx={{
              borderColor: "#fff1cc",
              color: "#432818",
              "&:hover": {
                borderColor: "#7a4522",
                bgcolor: "#fff1cc",
              },
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            انصراف
          </Button>
        </div>
      </form>
    </div>
  );
};

interface Price {
  id: number;
  price: number;
  regular_price: number;
  sale_price: number;
  discount: number | null;
  discount_price: number;
  cart_max: number;
  cart_min: number;
  attributes: any[];
}

interface ProductImage {
  id: number;
  image: string;
  ordering: number;
}

interface ApiProduct {
  id: number;
  title: string;
  title_en: string;
  category_id: number;
  image: string;
  unit: string;
  type: string;
  price: number;
  regular_price: number | null;
  sale_price: number;
  special: boolean;
  description: string;
  short_description: string;
  brand_id: number;
  images: ProductImage[];
  category: string;
  specificationGroups: any[];
  link: string;
  is_available: boolean;
  prices: Price[];
}

interface ProductDetailResponse {
  success: boolean;
  message: string;
  result: ApiProduct;
}

interface ExtendedProductData extends ApiProduct {
  brand: string;
  rating: number;
  sales: number;
  inStock: boolean;
  dateAdded: string;
  features: string[];
  discount?: number;
}

interface RelatedProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  category: {
    id: number;
    title: string;
  };
}

const ProductDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-4 md:py-8">
    {/* Breadcrumb Skeleton */}
    <div className="flex items-center gap-2 mb-4 md:mb-8">
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {/* تصاویر اسکلتون */}
      <div className="space-y-2 md:space-y-4">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="relative h-[20vh] md:h-[30vh] md:h-[60vh] bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* اطلاعات محصول اسکلتون */}
      <div className="space-y-4 md:space-y-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* ویژگی‌ها اسکلتون */}
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                {[1, 2, 3].map((attr) => (
                  <div key={attr} className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* قیمت‌ها اسکلتون */}
        <div className="space-y-2">
          {[1, 2].map((item) => (
            <div key={item} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>

        {/* دکمه‌ها اسکلتون */}
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

        {/* اطلاعات تکمیلی اسکلتون */}
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-6 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function ProductsDetails() {
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();
  const [cartCounts, setCartCounts] = useState<{ [key: number]: number }>({});
  const [productData, setProductData] = useState<ExtendedProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [availablePrices, setAvailablePrices] = useState<Price[]>([]);
  const { fetchCart, cartData } = useCart();
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  const updateCartCountsFromCart = () => {
    if (!cartData) return;
    const newCartCounts: { [key: number]: number } = {};

    cartData.forEach(item => {
      if (item.price?.id) {
        newCartCounts[item.price.id] = item.quantity;
      }
    });

    setCartCounts(newCartCounts);
  };

  useEffect(() => {
    updateCartCountsFromCart();
  }, [cartData]);

  const getProductCartCount = async (priceId: number) => {
    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/cart_count?price_id=${priceId}`,
        {
          method: "GET",
          headers: {
            "cart-id": `${localStorage.getItem("cart-id")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      setCartCounts(prev => ({
        ...prev,
        [priceId]: data || 0
      }));
    } catch (error) {
      console.error("خطا در دریافت تعداد محصول:", error);
      setCartCounts(prev => ({
        ...prev,
        [priceId]: 0
      }));
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/products/${id}`
        );
        const data: ProductDetailResponse = await response.json();

        if (data.success) {

          const firstPrice = data.result.prices[0];
          setSelectedPrice(firstPrice);
          await getProductCartCount(firstPrice.id);

          // تنظیم ویژگی‌های پیش‌فرض برای اولین قیمت
          const initialAttributes: { [key: string]: string } = {};
          firstPrice.attributes.forEach(attr => {
            initialAttributes[attr.group.name] = attr.name;
          });
          setSelectedAttributes(initialAttributes);

          await setProductData({
            ...data.result,
            brand: `برند ${data.result.brand_id}`,
            rating: 4.5,
            sales: 150,
            features: [
              "مقاومت بالا در برابر فشار",
              "ساخته شده از مواد با کیفیت",
              "گارانتی اصالت کالا",
              "نصب آسان",
              data.result.short_description,
            ],
            inStock: data.result.is_available,
            dateAdded: new Date().toISOString(),
            discount: firstPrice?.discount || 0,
          });
          setIsLoading(false);

        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    if (productData) {
      // فیلتر کردن قیمت‌ها بر اساس ویژگی‌های انتخاب شده
      const filteredPrices = productData?.prices.filter((price) => {
        return Object.entries(selectedAttributes).every(
          ([groupName, value]) => {
            const attribute = price.attributes.find(
              (attr) => attr.group.name === groupName && attr.name === value
            );
            return attribute !== undefined;
          }
        );
      });
      setAvailablePrices(filteredPrices);
    }
  }, [selectedAttributes, productData]);

  const getUniqueAttributes = (groupName: string) => {
    if (!productData) return [];
    const attributes = new Set<string>();
    productData?.prices.forEach((price) => {
      price.attributes.forEach((attr) => {
        if (attr.group.name === groupName) {
          attributes.add(attr.name);
        }
      });
    });
    return Array.from(attributes);
  };

  const getAttributeGroups = () => {
    if (!productData) return [];
    const groups = new Map<string, { type: string; name: string }>();
    productData?.prices.forEach((price) => {
      price.attributes.forEach((attr) => {
        if (!groups.has(attr.group.name)) {
          groups.set(attr.group.name, {
            type: attr.group.type,
            name: attr.group.name,
          });
        }
      });
    });
    return Array.from(groups.values());
  };

  const handleAttributeChange = (groupName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [groupName]: value,
    }));
  };

  const handlePriceSelect = (price: Price) => {
    setSelectedPrice(price);
    setQuantity(0);
  };

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);

    // اگر پنل نظرات باز شد، نظرات را دریافت کن
    if (panel === 'panelreviews' && isExpanded) {
      fetchReviews();
    }
  };

  const handleShowReviewForm = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (review: SubmitReviewRequest) => {
    if (!review.comment.trim()) {
      toast.error("لطفا نظر خود را وارد کنید");
      return;
    }

    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/products/${productData?.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${localStorage.getItem("token")}`,
            "Accept": "application/json",
            "x-api-key": "9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy",
          },
          body: JSON.stringify(review),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("نظر شما با موفقیت ثبت شد");
        setShowReviewForm(false);
        // دریافت مجدد نظرات
        fetchReviews();
      } else {
        toast.error(data.message || "خطا در ثبت نظر");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const handleAddToCart = async (price: Price) => {
    if (!price) {
      toast.error("لطفا یک گزینه را انتخاب کنید");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await fetch("https://admin.mydivix.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "cart-id": `${localStorage.getItem("cart-id")}`,
        },
        body: JSON.stringify({
          price_id: price.id,
          quantity: quantity || 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("محصول به سبد خرید اضافه شد");
        await fetchCart();
        await addToCart(selectedPrice?.id as number, 1)
        setCartCounts(prev => ({
          ...prev,
          [price.id]: (prev[price.id] || 0) + 1
        }));
        setIsUpdatingQuantity(false);
        setQuantity(1);
      } else {
        toast.error(data.message || "خطا در افزودن به سبد خرید");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number, price: Price) => {
    if (!price) {
      toast.error("لطفا یک گزینه را انتخاب کنید");
      return;
    }

    setIsUpdatingQuantity(true);
    try {
      if (newQuantity === 0) {
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/cart/${price.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "cart-id": `${localStorage.getItem("cart-id")}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          await fetchCart();
          await removeFromCart(selectedPrice?.id as number,)
          setCartCounts(prev => ({
            ...prev,
            [price.id]: 0
          }));
          toast.success("محصول با موفقیت از سبد خرید حذف شد");
        } else {
          toast.error(data.message || "خطا در حذف محصول");
        }
        return;
      }

      const isDecrease = newQuantity < (cartCounts[price.id] || 0);
      const endpoint = isDecrease
        ? "https://admin.mydivix.com/api/v1/cart/decrease"
        : "https://admin.mydivix.com/api/v1/cart";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cart-id": `${localStorage.getItem("cart-id")}`,
        },
        body: JSON.stringify({
          price_id: price.id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (response.status === 422) {
        toast.error('تعداد محصول در انبار تمام شده است');
        return;
      }
      if (data.success) {
        await fetchCart();
        setCartCounts(prev => ({
          ...prev,
          [price.id]: newQuantity
        }));
        toast.success("تعداد محصول با موفقیت بروزرسانی شد");
        await updateCartItemQuantity(selectedPrice?.id as number, newQuantity)
      } else {
        console.error("خطا در بروزرسانی تعداد:", data.message);
        toast.error("تعداد این محصول در انبار به پایان رسیده است");
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const fetchReviews = async () => {
    if (!productData) return;

    try {
      setIsLoadingReviews(true);
      setReviewsError(null);

      const response = await fetch(
        `https://admin.mydivix.com/api/v1/products/${productData?.id}/reviews`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': '9anHzmriziuiUjNcwICqB7b1MDJa6xV3uQzOmZWy',
          },
        }
      );

      const data: ReviewResponse = await response.json();

      if (data.success) {
        setReviews(data.result.data);
      } else {
        setReviewsError(data.message || 'خطا در دریافت نظرات');
      }
    } catch (err) {
      setReviewsError('خطا در ارتباط با سرور');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productData) return;

      try {
        setIsLoadingRelated(true);
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/products/${productData?.id}/relatedProducts`
        );
        const data = await response.json();

        if (data.success) {
          setRelatedProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [productData]);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#7a4522",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          duration: 2000,
        }}
      />
      {isLoading ? (
        <ProductDetailsSkeleton />
      ) : (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#473e39] mb-4 md:mb-8">
            <Link to="/" className="hover:text-[#7a4522] transition-colors">
              صفحه اصلی
            </Link>
            <FaChevronLeft className="w-2 h-2 md:w-3 md:h-3" />
            <Link
              to="/products"
              className="hover:text-[#7a4522] transition-colors"
            >
              محصولات
            </Link>
            <FaChevronLeft className="w-2 h-2 md:w-3 md:h-3" />
            <span className="text-[#D97706]">{productData?.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* بخش تصاویر محصول */}
            <div className="space-y-2 md:space-y-4">
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {productData?.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative h-[20vh] md:h-[30vh] md:h-[60vh] cursor-pointer`}
                  >
                    <img
                      src={image.image}
                      alt={`${productData?.title} ${index + 1}`}
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* بخش اطلاعات محصول */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-bold text-[#171717]">
                  {productData?.title}
                </h1>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: productData?.description as string }}
                className="text-sm md:text-base text-[#473e39]"
              />

              {/* انتخاب ویژگی‌ها */}
              <div className="space-y-8">
                {getAttributeGroups().map((group) => (
                  <div key={group.name} className="space-y-1 flex justify-between items-center">
                    <h3 className="text-base md:text-lg font-bold text-[#171717] flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[#7a4522] rounded-full"></span>
                      {group.name}:
                    </h3>
                    <div className={`flex flex-wrap gap-4 ${group.type === "color"
                      ? "justify-start"
                      : group.type === "size"
                        ? "justify-center"
                        : "justify-end"
                      }`}>
                      {getUniqueAttributes(group.name).map((attrName) => {
                        const price = productData?.prices.find((p) =>
                          p.attributes.some(
                            (a) =>
                              a.group.name === group.name && a.name === attrName
                          )
                        );
                        const attr = price?.attributes.find(
                          (a) => a.name === attrName
                        );

                        return (
                          <button
                            key={attrName}
                            onClick={() => {
                              handleAttributeChange(group.name, attrName);
                              setSelectedPrice(price || null);
                            }}
                            className={`transition-all duration-300 ${group.type === "color"
                              ? `w-10 h-10 rounded-full shadow-md hover:shadow-lg ${selectedAttributes[group.name] === attrName
                                ? "ring-4 ring-[#7a4522] ring-offset-2 scale-110"
                                : "hover:scale-105"
                              }`
                              : group.type === "size"
                                ? `w-12 h-12 rounded-lg border-2 font-bold text-lg ${selectedAttributes[group.name] === attrName
                                  ? "border-[#7a4522] bg-[#fff1cc] text-[#7a4522] shadow-md"
                                  : "border-[#e5e7eb] hover:border-[#7a4522] hover:bg-[#fff1cc]/20 text-[#4b5563] hover:text-[#7a4522]"
                                }`
                                : `px-5 py-2.5 rounded-xl border-2 font-medium text-sm md:text-base ${selectedAttributes[group.name] === attrName
                                  ? "border-[#7a4522] bg-[#fff1cc] text-[#7a4522] shadow-md"
                                  : "border-[#e5e7eb] hover:border-[#7a4522] hover:bg-[#fff1cc]/20 text-[#4b5563] hover:text-[#7a4522]"
                                }`
                              }`}
                            style={
                              group.type === "color" && attr
                                ? {
                                  backgroundColor: attr.value,
                                  boxShadow: selectedAttributes[group.name] === attrName
                                    ? '0 0 0 4px #fff1cc'
                                    : '0 2px 4px rgba(0,0,0,0.1)'
                                }
                                : undefined
                            }
                          >
                            {group.type !== "color" && (
                              <span className={`flex items-center gap-2 ${group.type === "size" ? "justify-center" : ""
                                }`}>
                                {attrName}
                                {selectedAttributes[group.name] === attrName && group.type !== "size" && (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* نمایش قیمت‌های موجود */}
              {availablePrices.length > 0 && (
                <div className="space-y-4">
                  {availablePrices.map((price) => (
                    <div
                      key={price.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPrice?.id === price.id
                        ? "border-[#7a4522] bg-[#fff1cc]/10"
                        : "border-[#fff1cc] hover:border-[#7a4522]"
                        }`}
                      onClick={() => handlePriceSelect(price)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-[#7a4522]">
                          {price.discount
                            ? price.discount_price.toLocaleString()
                            : price.price.toLocaleString()}{" "}
                          تومان
                        </span>
                        {price.discount && (
                          <span className="text-sm text-gray-400 line-through">
                            {price.regular_price.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {price.attributes.map((attr) => (
                          <div
                            key={attr.id}
                            className="flex items-center gap-2"
                          >
                            {attr.group.type === "color" ? (
                              <div
                                className="w-6 h-6 rounded-full border-2 border-[#fff1cc]"
                                style={{ backgroundColor: attr.value }}
                              />
                            ) : (
                              <span className="text-sm text-[#473e39]">
                                {attr.name}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* بخش سبد خرید واحد */}
              {selectedPrice && (
                <div className="mt-4">
                  {cartCounts[selectedPrice.id] > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-2">
                        <button
                          onClick={() => handleQuantityChange(
                            cartCounts[selectedPrice.id] === 1 ? 0 : cartCounts[selectedPrice.id] - 1,
                            selectedPrice
                          )}
                          disabled={isUpdatingQuantity}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center transition-all duration-300 bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {cartCounts[selectedPrice.id] === 1 ? <FaTrash size={12} /> : "-"}
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#222]">
                          {cartCounts[selectedPrice.id]}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(cartCounts[selectedPrice.id] + 1, selectedPrice)}
                          disabled={cartCounts[selectedPrice.id] >= 10 || isUpdatingQuantity}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--primary)] flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingQuantity ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="text-white">+</span>
                          )}
                        </button>
                      </div>
                      <Link
                        to="/checkout/cart"
                        className="flex-1 bg-[#7a4522] text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-[#623111] transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                        <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        تکمیل سبد خرید
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(selectedPrice)}
                      disabled={isAddingToCart}
                      className="w-full bg-[#7a4522] text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-[#623111] transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? (
                        <div className="w-4 h-4 border-2 border-secondary-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaShoppingCart size={14} />
                          <span>افزودن به سبد خرید</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2 md:space-y-4">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-[#473e39]">دسته‌بندی:</span>
                  <span className="font-medium text-[#171717]">
                    {productData?.category}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-[#473e39]">واحد:</span>
                  <span className="font-medium text-[#171717]">
                    {productData?.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-2 md:space-y-4">
                {accordionItems.map((item) => (
                  <div key={item.id} className="mb-2 md:mb-4">
                    <StyledAccordion
                      expanded={expanded === `panel${item.id}`}
                      onChange={handleAccordionChange(`panel${item.id}`)}
                    >
                      <StyledAccordionSummary
                        expandIcon={
                          <CustomExpandIcon
                            expanded={expanded === `panel${item.id}`}
                          />
                        }
                        aria-controls={`panel${item.id}-content`}
                        id={`panel${item.id}-header`}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                              md: "0.95rem",
                            },
                            transition: "transform 0.3s ease",
                            fontFamily: "IRANYekan",
                            color: "#171717",
                            "&:hover": {
                              transform: "translateX(8px)",
                            },
                          }}
                        >
                          {item.question}
                        </Typography>
                      </StyledAccordionSummary>
                      <StyledAccordionDetails>
                        {item.type === "reviews" ? (
                          <div className="space-y-2 md:space-y-4">
                            {isLoadingReviews ? (
                              <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                  <div key={item} className="animate-pulse">
                                    <div className="flex items-start gap-4">
                                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                      <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : reviewsError ? (
                              <div className="text-center text-red-500 py-4">{reviewsError}</div>
                            ) : reviews.length === 0 ? (
                              <div className="text-center py-8">
                                <FaComment className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">هنوز نظری برای این محصول ثبت نشده است</p>
                              </div>
                            ) : (
                              reviews.map((review) => <ReviewItem key={review.id} review={review} />)
                            )}

                            {showReviewForm && (
                              <div ref={reviewFormRef} className="mt-4 md:mt-8">
                                <ReviewForm
                                  onSubmit={handleSubmitReview}
                                  onCancel={() => setShowReviewForm(false)}
                                />
                              </div>
                            )}
                            {!showReviewForm && (
                              <button
                                onClick={handleShowReviewForm}
                                className="inline-flex items-center justify-center gap-2 bg-[#432818] text-white py-1.5 md:py-2 px-3 md:px-4 rounded-lg hover:bg-[#7a4522] transition-colors duration-300 text-xs md:text-sm mt-2 md:mt-4"
                              >
                                <FaComment className="w-3 h-3 md:w-4 md:h-4" />
                                ثبت نظر
                              </button>
                            )}
                          </div>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
                              lineHeight: 1.6,
                              fontFamily: "IRANYekan",
                              color: "#473e39",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {item.content as string}
                          </Typography>
                        )}
                      </StyledAccordionDetails>
                    </StyledAccordion>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* بخش محصولات مرتبط */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#432818] mb-8">محصولات مرتبط</h2>

            {isLoadingRelated ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : relatedProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts?.map((product) => (
                  <Link
                    key={product?.id}
                    to={`/products/${product?.id}`}
                    className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                      <img
                        src={product?.image || "/images/placeholder.jpg"}
                        alt={product?.title}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-[#432818] mb-2 line-clamp-2">
                      {product?.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#7a4522] font-bold">
                        {product?.price.toLocaleString()} تومان
                      </span>
                      <span className="text-sm text-gray-500">
                        {product?.category.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                محصول مرتبطی یافت نشد
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}