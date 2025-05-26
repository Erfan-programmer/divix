import React from 'react';
import type { SearchResponse } from '../types/Product';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

interface SearchResultsProps {
    data: SearchResponse;
}

const SearchResults: React.FC<SearchResultsProps> = ({ data }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    };
    console.log("search result =>" , data)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.result.data.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative">
                            <img
                                src={product.image as string}
                                alt={product.title}
                                className="w-full h-48 object-contain p-4"
                            />
                            {product.special && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                    ویژه
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <Link to={`/product/${product.slug}`}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-300">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-600 mb-2">{product.title_en}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-green-600">
                                    {formatPrice(product.price)}
                                </span>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2">
                                    <FaShoppingCart />
                                    <span>افزودن به سبد</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {data.result.meta.total > 0 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                        {data.result.meta.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`px-4 py-2 rounded-lg ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                onClick={() => {
                                    if (link.url) {
                                        window.location.href = link.url;
                                    }
                                }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {data.result.meta.total === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">نتیجه‌ای یافت نشد</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults; 