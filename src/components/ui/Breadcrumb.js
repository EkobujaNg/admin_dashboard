'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm font-semibold text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
          {item.href ? (
            <Link 
              href={item.href}
              className="text-primary-10 hover:text-primary-20 transition-colors font-Raleway"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-400 font-Raleway">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
