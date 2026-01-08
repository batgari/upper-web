'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles, MapPin, Eye, Scissors, Syringe, Heart, Star, Smile, Hand, Users } from 'lucide-react';

// useSearchParams()를 사용하는 컴포넌트를 Suspense로 감싸기 위한 내부 컴포넌트
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const messageShown = useRef(false);

  // 인증 메시지 처리
  useEffect(() => {
    const message = searchParams.get('message');
    if (message && !messageShown.current) {
      messageShown.current = true;

      switch (message) {
        case 'welcome':
          alert('환영합니다! Upper에 가입되었습니다.');
          break;
        case 'already_registered':
          alert('이미 가입된 계정입니다. 로그인을 이용해주세요.');
          break;
        case 'signup_required':
          alert('회원가입이 필요합니다. 먼저 회원가입을 진행해주세요.');
          break;
        case 'signup_failed':
          alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
          break;
      }

      // URL에서 message 파라미터 제거
      router.replace('/');
    }
  }, [searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/doctor?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/doctor');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/doctor?query=${encodeURIComponent(category)}`);
  };

  const handleRegionClick = (region: string) => {
    router.push(`/doctor?region=${encodeURIComponent(region)}`);
  };

  // 시술 카테고리 (plan.md 요구사항)
  const procedureCategories = [
    { name: '눈 성형', icon: Eye, color: 'from-pink-500 to-rose-500' },
    { name: '코 성형', icon: Sparkles, color: 'from-purple-500 to-indigo-500' },
    { name: '지방 성형', icon: Heart, color: 'from-orange-500 to-red-500' },
    { name: '보톡스', icon: Syringe, color: 'from-cyan-500 to-blue-500' },
    { name: '필러', icon: Star, color: 'from-emerald-500 to-teal-500' },
    { name: '리프팅', icon: Hand, color: 'from-violet-500 to-purple-500' },
    { name: '피부시술', icon: Smile, color: 'from-amber-500 to-orange-500' },
    { name: '윤곽성형', icon: Scissors, color: 'from-rose-500 to-pink-500' },
  ];

  // 미용 분야 주요 지역 (plan.md 요구사항)
  const beautyRegions = [
    { name: '강남', highlight: true },
    { name: '압구정', highlight: true },
    { name: '청담', highlight: true },
    { name: '신사', highlight: false },
    { name: '논현', highlight: false },
    { name: '신논현', highlight: false },
    { name: '홍대', highlight: false },
    { name: '이태원', highlight: false },
    { name: '명동', highlight: false },
    { name: '부산 서면', highlight: false },
    { name: '대구 동성로', highlight: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 sm:pt-16 pb-12 text-center">
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Looking for a Korean aesthetic doctor at Upper?
            </h1>

            <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-lg mx-auto">
              검증된 전문의 정보를 확인하고 <br className="sm:hidden" />
              나에게 맞는 의사를 찾아보세요
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="의사, 병원, 시술명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 text-base bg-white/80 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:outline-none transition-all placeholder-gray-400 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-semibold transition-colors"
                >
                  검색
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Procedure Categories Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-gray-900">시술 분야</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {procedureCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group flex flex-col items-center p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl hover:border-rose-200 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Beauty Regions Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-gray-900">주요 지역</h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {beautyRegions.map((region) => (
            <button
              key={region.name}
              onClick={() => handleRegionClick(region.name)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                region.highlight
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-rose-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gray-900 font-semibold">전체 의사 목록 보기</p>
              <p className="text-gray-500 text-sm">모든 전문의 정보를 확인해보세요</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/doctor')}
            className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-semibold transition-colors"
          >
            전체 보기
          </button>
        </div>
      </div>
    </div>
  );
}

// useSearchParams() 사용으로 인한 정적 생성 에러 방지 - Suspense로 감싸기
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
