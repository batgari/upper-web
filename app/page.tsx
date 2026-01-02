'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Department } from '@/app/common/model/Department';

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

  const handleSpecialtyClick = (specialty: string) => {
    router.push(`/doctor?specialty=${encodeURIComponent(specialty)}`);
  };

  const handleRegionClick = (region: string) => {
    router.push(`/doctor?region=${encodeURIComponent(region)}`);
  };

  // 주요 진료과 선택 (plan.md에서 언급한 성형외과, 피부과 등)
  const mainSpecialties = [
    Department.성형외과,
    Department.피부과,
    Department.안과,
    Department.치과,
    Department.정형외과,
    Department.내과,
    Department.산부인과,
    Department.소아청소년과,
    Department.이비인후과,
    Department.비뇨의학과,
    Department.정신건강의학과,
    Department.심장내과,
  ];

  const regions = [
    '서울',
    '경기',
    '인천',
    '부산',
    '대구',
    '광주',
    '대전',
    '울산',
    '세종',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-16 pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            믿을 수 있는 의사를 찾아보세요
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="지역, 병원, 의사 이름으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </form>
        </div>

        {/* Specialties Section */}
        <div className="py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">진료 분야</h2>
          <div className="flex flex-wrap gap-2">
            {mainSpecialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyClick(specialty)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors"
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Regions Section */}
        <div className="py-8 border-t border-gray-200 pb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">지역</h2>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionClick(region)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors"
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
