import {
  FaCalendar,
  FaUser,
  FaComment,
  FaTag,
  FaShareAlt,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";
import { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { Toaster } from "react-hot-toast";


interface RelatedPost {
  id: number;
  title: string;
  image: string;
  created_at: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  category: {
    id: number;
    title: string;
    slug: string;
  };
  created_at: string;
  comments_count: number;
  related_posts: RelatedPost[];
}

interface ApiResponse {
  success: boolean;
  result: Post;
  message?: string;
}

export default function BlogDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const { id } = useParams()
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/posts/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setPost(data.result);
          setError(null);
        } else {
          setError(data.message || "خطا در دریافت مقاله");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("خطا در دریافت مقاله");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      const url = `https://mydivix.com/blogs/${post.slug}`;
      setShareUrl(url);
    }
  }, [post]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setTimeout(() => {
        }, 2000);
      })
      .catch((error) => {
        console.error("خطا در کپی کردن لینک:", error);
      });
  };

  const formatDate = (date: string) => {
    return moment(date).format("jYYYY/jMM/jDD");
  };


  if (loading) {
    return (
      <div className="bg-[#FFFBF0] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#FFFBF0] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#432818] mb-4">
              خطا در بارگذاری مقاله
            </h2>
            <p className="text-gray-600">
              {error || "مقاله مورد نظر یافت نشد"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
      <div className="bg-[#FFFBF0] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* محتوای اصلی */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* تصویر اصلی */}
                <div className="relative h-96 w-full rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex justify-between items-center mt-8 pl-4">
                  <div className="flex items-center gap-1 mb-4 border-r-4 mr-4 border-[#6F1D1B]">
                    <IoDocumentText className="text-[#6F1D1B] text-3xl" />
                    <h1 className="lg:text-3xl font-bold text-[#432818]">
                      {post.title}
                    </h1>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={copyToClipboard}
                      className="text-[#6F1D1B] hover:text-[#432818] transition-colors"
                    >
                      <FaShareAlt className="text-2xl" />
                    </button>
                  </div>
                </div>

                {/* اطلاعات مقاله */}
                <div className="p-8">
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-[#6F1D1B]" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#6F1D1B]" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaComment className="text-[#6F1D1B]" />
                      <span>{post.comments_count} نظر</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTag className="text-[#6F1D1B]" />
                      <span>{post.category.title}</span>
                    </div>
                  </div>

                  {/* محتوای مقاله */}
                  <div
                    className="prose max-w-none text-[#432818]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

      
                </div>
              </article>
            </div>

            {/* سایدبار */}
            <div className="lg:col-span-1 space-y-8">
              {/* مقالات مرتبط */}
              <div className="bg-white rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold bg-[#432818] text-white rounded-t-2xl p-4">
                  مقالات مرتبط
                </h3>
                <div className="p-6">
                  <div className="space-y-4">
                    {post?.related_posts && post.related_posts.length > 0 ? (
                      post.related_posts.map((relatedPost) => (
                        <Link
                          to={`/blogs/${relatedPost.slug}`}
                          key={relatedPost.id}
                          className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#432818] mb-1 line-clamp-2 text-sm">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(relatedPost.created_at)}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">
                        مقاله مرتبطی یافت نشد
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
