import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import moment from 'moment-jalaali';
import { debounce } from "lodash";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

interface BlogSidebarProps {
  onSearch: (query: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState<SearchResult[]>([]);
  const [isSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ایجاد تابع debounced برای جستجو
  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        onSearch(value);
        setError(null);
      } else {
        setError('لطفا حداقل 3 حرف وارد کنید');
      }
    }, 500)
  ).current;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const formatDate = (date: string) => {
    return moment(date).format('jYYYY/jMM/jDD');
  };

  return (
    <div className="space-y-8">


      {/* بخش جستجو */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-[#432818] mb-4">جستجو در مقالات</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="حداقل 3 حرف وارد کنید..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#432818] focus:border-transparent"
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* نتایج جستجو */}
      {isSearching ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((result) => (
            <Link
              key={result.id}
              to={`/blogs/${result.slug}`}
              className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <h4 className="text-sm font-medium text-[#432818] mb-1 line-clamp-2">
                {result.title}
              </h4>
              <p className="text-xs text-gray-500">{formatDate(result.created_at)}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default BlogSidebar; 