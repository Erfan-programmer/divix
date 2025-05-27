import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import type { SearchResponse } from '../types/Product';
import { toast } from 'react-hot-toast';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async (signal?: AbortSignal) => {
            try {
                setLoading(true);
                const query = searchParams.get('q');
                const page = searchParams.get('page') || '1';
                
                if (!query) {
                    setSearchResults(null);
                    return;
                }

                const response = await fetch(
                    `https://admin.mydivix.com/api/v1/search/products?q=${encodeURIComponent(query)}&page=${page}`,
                    { signal }
                );
                
                const data: SearchResponse = await response.json();
                
                if (!data.success) {
                    throw new Error(data.message || 'خطا در دریافت نتایج جستجو');
                }

                setSearchResults(data);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching search results:', error);
                toast.error(error instanceof Error ? error.message : 'خطا در دریافت نتایج جستجو');
                setSearchResults(null);
            } finally {
                setLoading(false);
            }
        };

        const abortController = new AbortController();
        fetchSearchResults(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!searchResults) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-lg">خطا در دریافت نتایج جستجو</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    نتایج جستجو برای: {searchParams.get('q')}
                </h1>
                <SearchResults data={searchResults} />
            </div>
        </div>
    );
};

export default SearchPage; 