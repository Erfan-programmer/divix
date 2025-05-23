import React from 'react';
import { FaChevronLeft, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <ol className="flex items-center space-x-2 space-x-reverse">
        <li>
          <Link
            to="/"
            className="flex items-center text-[#432818] hover:text-[#7A4522] transition-colors"
          >
            <FaHome className="w-4 h-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <FaChevronLeft className="w-3 h-3 text-gray-400 mx-2" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-[#432818] hover:text-[#7A4522] transition-colors text-sm"
              >
                {item.title}
              </Link>
            ) : (
              <span className="text-gray-500 text-sm">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 