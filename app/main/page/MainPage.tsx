import Link from 'next/link';
import { Search, MapPin, Stethoscope } from 'lucide-react';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            믿을 수 있는 의사를 찾아보세요
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            지역별, 진료과별 전문의 검색 서비스
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            의사 검색하기
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">지역별 검색</h3>
            <p className="text-gray-600">
              원하는 지역의 전문의를 쉽게 찾을 수 있습니다
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">진료과별 검색</h3>
            <p className="text-gray-600">
              다양한 진료 분야의 전문의 정보를 제공합니다
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">상세 정보</h3>
            <p className="text-gray-600">
              의사의 경력, 전문 분야, 진료 시간 등을 확인하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
