'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/app/auth/context/AuthContext';
import AuthModal from '@/app/auth/view/AuthModal';

export default function Navbar() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');

  const handleOpenAuthModal = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
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
                  <>
                    <button
                      onClick={() => handleOpenAuthModal('signup')}
                      className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>회원가입</span>
                    </button>
                    <button
                      onClick={() => handleOpenAuthModal('login')}
                      className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors text-sm font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>로그인</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </nav>
  );
}
