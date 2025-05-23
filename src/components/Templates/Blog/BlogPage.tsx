"use client";

import { FaAngleLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import Breadcrumb from "../../Modules/Breadcrumb";
import { Link } from "react-router-dom";
import moment from "moment-jalaali";
import BlogSidebar from "./BlogSidebar";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    image: string;
    author: string;
    category: {
        id: number;
        title: string;
        slug: string;
    };
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const breadcrumbItems = [{ title: "وبلاگ" }];

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
        current_page: 1,
        last_page: 1,
        per_page: 9,
        total: 0
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();
                if (searchQuery) {
                    params.set('search', searchQuery);
                }

                const response = await fetch(`https://admin.mydivix.com/api/v1/posts?${params}&page=${currentPage}&per_page=${paginationMeta.per_page}`);
                const data = await response.json();

                if (data.success) {
                    setPosts(data.result.data);
                    setPaginationMeta({
                        current_page: data.result.current_page,
                        last_page: data.result.last_page,
                        per_page: data.result.per_page,
                        total: data.result.total
                    });
                    setIsLoading(false);
                } else {
                    setError('خطا در دریافت مقالات');
                    setIsLoading(false);
                }
            } catch (err) {
                setError('خطا در ارتباط با سرور');
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [searchQuery]);

    const formatDate = (date: string) => {
        return moment(date).format('jYYYY/jMM/jDD');
    };

    const renderSkeleton = () => {
        return Array(8).fill(0).map((_, index) => (
            <div
                key={`skeleton-${index}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
                <div className="relative h-48 md:h-56 xl:h-64 bg-gray-200 animate-pulse" />
                <div className="p-4 md:p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3" />
                    <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-[#FFFBF0] min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* محتوای اصلی */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* سایدبار */}
                    <div className="lg:col-span-1">
                        <BlogSidebar onSearch={handleSearch} />
                    </div>

                    {/* لیست مقالات */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {isLoading ? (
                                renderSkeleton()
                            ) : (
                                posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="relative h-48 md:h-56 xl:h-64">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="object-cover w-full h-[100%]"
                                            />
                                        </div>
                                        <div className="p-4 md:p-6">
                                            <h3 className="text-base md:text-lg font-bold text-[#432818] mb-2 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2">
                                                {post.category.title}
                                            </p>
                                            <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                                                <span>{formatDate(post.created_at)}</span>
                                                <Link
                                                    to={`/blogs/${post.slug}`}
                                                    className="flex justify-center gap-1 items-center text-[#432818] hover:text-[#6F1D1B] transition-colors"
                                                >
                                                    <span>ادامه مطلب</span>
                                                    <FaAngleLeft className="text-xs" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
