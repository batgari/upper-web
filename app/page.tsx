'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, MapPin, Eye, Scissors, Syringe, Heart, Star, Smile, Hand, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - 당근마켓 스타일 */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 sm:pt-24 pb-12 text-center">
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              믿을 수 있는 의사를
              <br />
              <span className="text-orange-500">찾아보세요</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-lg mx-auto">
              검증된 전문의 정보를 확인하고<br className="sm:hidden" />
              나에게 맞는 의사를 찾아보세요
            </p>

            {/* Search Bar - 당근마켓 스타일 */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="의사, 병원, 시술명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 text-base bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-colors"
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
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">시술 분야</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {procedureCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group flex flex-col items-center p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all duration-200"
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
          <MapPin className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">주요 지역</h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {beautyRegions.map((region) => (
            <button
              key={region.name}
              onClick={() => handleRegionClick(region.name)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                region.highlight
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-900 font-semibold">전체 의사 목록 보기</p>
                <p className="text-gray-500 text-sm">모든 전문의 정보를 확인해보세요</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/doctor')}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-semibold transition-colors"
            >
              전체 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
