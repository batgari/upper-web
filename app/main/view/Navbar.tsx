import Link from 'next/link';
import { Search, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-rose-500">
              Upper
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/doctor"
              className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              <span>의사 검색</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
            >
              <UserCircle className="w-4 h-4" />
              <span>관리자</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
