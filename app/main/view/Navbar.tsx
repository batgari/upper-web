'use client';

import Link from 'next/link';
import { Search, UserCircle, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Navbar() {
  const { user, isAdmin, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

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

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
              >
                <UserCircle className="w-4 h-4" />
                <span>관리자</span>
              </Link>
            )}

            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>로그인</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
