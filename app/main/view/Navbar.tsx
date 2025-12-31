import Link from 'next/link';
import { Search, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Upper
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/doctors"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>의사 검색</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              <span>관리자</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
