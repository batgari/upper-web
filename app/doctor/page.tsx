'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Stethoscope, Briefcase, X, Building2, ChevronRight, Home } from 'lucide-react';
import DoctorRepository, { type DoctorWithHospital } from '@/app/admin/doctor/repository/DoctorRepository';
import CareArea from '@/app/common/model/CareArea';

// useSearchParams()를 사용하는 컴포넌트를 Suspense로 감싸기 위한 내부 컴포넌트
function DoctorsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    searchParams.get('region') ? [searchParams.get('region')!] : []
  );
  const [selectedCareAreas, setSelectedCareAreas] = useState<string[]>(
    searchParams.get('careArea') ? [searchParams.get('careArea')!] : []
  );
  const [doctors, setDoctors] = useState<DoctorWithHospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 미용 분야 주요 지역
  const regions = [
    '강남', '압구정', '청담', '신사', '논현', '신논현',
    '홍대', '이태원', '명동', '잠실', '송파',
    '부산 서면', '대구 동성로', '인천', '대전', '광주'
  ];

  const careAreas = Object.values(CareArea).filter((v): v is CareArea => typeof v === 'string');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);

        const data = await DoctorRepository.search({
          region: selectedRegions.length > 0 ? selectedRegions[0] : undefined,
          careArea: selectedCareAreas.length > 0 ? selectedCareAreas[0] : undefined,
          query: searchQuery || undefined,
        });

        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [searchQuery, selectedRegions, selectedCareAreas]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [region]
    );
  };

  const toggleCareArea = (careArea: string) => {
    setSelectedCareAreas(prev =>
      prev.includes(careArea) ? prev.filter(s => s !== careArea) : [careArea]
    );
  };

  const clearFilters = () => {
    setSelectedRegions([]);
    setSelectedCareAreas([]);
    setSearchQuery('');
  };

  const activeFilterCount = selectedRegions.length + selectedCareAreas.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - 당근마켓 스타일 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>

            {/* Search Bar - 메인과 동일한 스타일 */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="의사, 병원, 시술명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">필터:</span>
              <div className="flex flex-wrap gap-2">
                {selectedRegions.map(region => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    {region}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {selectedCareAreas.map(careArea => (
                  <button
                    key={careArea}
                    onClick={() => toggleCareArea(careArea)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors"
                  >
                    <Stethoscope className="w-3 h-3" />
                    {CareArea.getLabel(careArea as CareArea)}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium ml-2"
              >
                전체 해제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Filter Panel - 나열식 */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-28 overflow-hidden">
              {/* Region Filter */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-gray-900">지역</h3>
                </div>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedRegions.includes(region)
                          ? 'bg-rose-500 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* CareArea Filter */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-gray-900">시술 분야</h3>
                </div>
                <div className="space-y-0.5 max-h-72 overflow-y-auto">
                  {careAreas.map((careArea) => (
                    <button
                      key={careArea}
                      onClick={() => toggleCareArea(careArea)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCareAreas.includes(careArea)
                          ? 'bg-rose-500 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {CareArea.getLabel(careArea)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Results Area */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                총 <span className="font-bold text-gray-900">{doctors.length}</span>명의 의사
              </p>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500 text-sm">로딩 중...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-base font-medium">검색 결과가 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">다른 조건으로 검색해보세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => router.push(`/doctor/${doctor.id}`)}
                    className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {/* 수평으로 긴 박스 형태 */}
                    <div className="flex items-center gap-4">
                      {/* 프로필 이미지 */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center text-rose-600 font-bold text-xl flex-shrink-0 overflow-hidden">
                        {doctor.photo_url ? (
                          <img
                            src={doctor.photo_url}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          doctor.name.charAt(0)
                        )}
                      </div>

                      {/* 의사 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900">
                            {doctor.name}
                          </h3>
                          {doctor.specialized_areas?.slice(0, 2).map((area) => (
                            <span key={area} className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs font-medium">
                              {CareArea.getLabel(area as CareArea)}
                            </span>
                          ))}
                          {doctor.specialized_areas && doctor.specialized_areas.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              +{doctor.specialized_areas.length - 2}
                            </span>
                          )}
                        </div>

                        {doctor.hospital && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{doctor.hospital.name}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {doctor.experience_years && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              경력 {doctor.experience_years}년
                            </span>
                          )}
                          {doctor.hospital?.address && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3" />
                              {doctor.hospital.address.split(' ').slice(0, 2).join(' ')}
                            </span>
                          )}
                        </div>

                      </div>

                      {/* 화살표 */}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-rose-500 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// useSearchParams() 사용으로 인한 정적 생성 에러 방지 - Suspense로 감싸기
export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <DoctorsPageContent />
    </Suspense>
  );
}
