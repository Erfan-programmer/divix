"use client";

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
import { toast } from "react-hot-toast";

interface Comment {
  id: number;
  body: string;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}

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

interface CommentsResponse {
  success: boolean;
  result: {
    data: Comment[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export default function BlogDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [lastCommentPage, setLastCommentPage] = useState(1);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    body: "",
  });
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const {id} = useParams()
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
    const fetchComments = async () => {
      if (!post) return;

      try {
        setIsLoadingComments(true);
        const response = await fetch(
          `https://admin.mydivix.com/api/v1/posts/${post.id}/comments?page=${commentPage}&per_page=5`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CommentsResponse = await response.json();
        if (data.success) {
          setComments(data.result.data);
          setTotalComments(data.result.meta.total);
          setLastCommentPage(data.result.meta.last_page);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [post, commentPage]);

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
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("خطا در کپی کردن لینک:", error);
      });
  };

  const formatDate = (date: string) => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.body.trim()) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }

    try {
      const response = await fetch(
        `https://admin.mydivix.com/api/v1/posts/${post?.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(commentForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("نظر شما با موفقیت ثبت شد");
        setCommentForm({ name: "", email: "", body: "" });
        // دریافت مجدد نظرات
        setCommentPage(1);
      } else {
        toast.error(data.message || "خطا در ثبت نظر");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
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
                  className="object-cover"
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

                {/* بخش نظرات */}
                <div className="mt-12">
                  <h3 className="text-lg md:text-2xl font-bold text-[#432818] mb-6">
                    نظرات ({totalComments})
                  </h3>
                  <div className="space-y-6">
                    {/* فرم ارسال نظر */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-bold text-[#432818] mb-4">
                        ارسال نظر
                      </h4>
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="نام"
                            value={commentForm.name}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                          />
                          <input
                            type="email"
                            placeholder="ایمیل"
                            value={commentForm.email}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                          />
                        </div>
                        <textarea
                          placeholder="نظر شما"
                          rows={4}
                          value={commentForm.body}
                          onChange={(e) => setCommentForm(prev => ({ ...prev, body: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                        ></textarea>
                        <button
                          type="submit"
                          className="bg-[#6F1D1B] text-white px-6 py-2 rounded-lg hover:bg-[#432818] transition-colors"
                        >
                          ارسال نظر
                        </button>
                      </form>
                    </div>

                    {/* لیست نظرات */}
                    <div className="space-y-4">
                      {isLoadingComments ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                              <div className="flex items-center justify-between mb-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                              </div>
                              <div className="h-4 w-full bg-gray-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : comments.length > 0 ? (
                        <>
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-[#432818]">
                                  {comment.user.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-600">{comment.body}</p>
                            </div>
                          ))}

                          {/* صفحه‌بندی */}
                          {lastCommentPage > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                              <button
                                onClick={() => setCommentPage(prev => Math.max(prev - 1, 1))}
                                disabled={commentPage === 1}
                                className="px-4 py-2 border border-[#6F1D1B] rounded-lg text-[#6F1D1B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6F1D1B] hover:text-white transition-colors"
                              >
                                قبلی
                              </button>
                              <span className="px-4 py-2 text-[#432818]">
                                صفحه {commentPage} از {lastCommentPage}
                              </span>
                              <button
                                onClick={() => setCommentPage(prev => Math.min(prev + 1, lastCommentPage))}
                                disabled={commentPage === lastCommentPage}
                                className="px-4 py-2 border border-[#6F1D1B] rounded-lg text-[#6F1D1B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6F1D1B] hover:text-white transition-colors"
                              >
                                بعدی
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          هنوز نظری ثبت نشده است
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
  );
}
