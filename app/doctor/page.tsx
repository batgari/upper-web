'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Stethoscope, Briefcase } from 'lucide-react';
import DoctorRepository, { type DoctorWithHospital } from '@/app/admin/doctor/repository/DoctorRepository';
import { Department } from '@/app/common/model/Department';

export default function DoctorsPage() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    searchParams.get('region') ? [searchParams.get('region')!] : []
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.get('specialty') ? [searchParams.get('specialty')!] : []
  );
  const [doctors, setDoctors] = useState<DoctorWithHospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const regions = [
    '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산',
    '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];

  const specialties = Object.values(Department).sort();

  // 데이터 가져오기
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);

        const data = await DoctorRepository.search({
          region: selectedRegions.length > 0 ? selectedRegions[0] : undefined,
          specialty: selectedSpecialties.length > 0 ? selectedSpecialties[0] : undefined,
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
  }, [searchQuery, selectedRegions, selectedSpecialties]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [region]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty) ? prev.filter(s => s !== specialty) : [specialty]
    );
  };

  const clearFilters = () => {
    setSelectedRegions([]);
    setSelectedSpecialties([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="지역, 병원, 의사 이름으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
            />
          </div>
        </form>

        {/* Layout: Left Filter Panel + Right Results */}
        <div className="flex gap-6">
          {/* Left Filter Panel */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">필터</h2>
                {(selectedRegions.length > 0 || selectedSpecialties.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    초기화
                  </button>
                )}
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">지역</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region)}
                        onChange={() => toggleRegion(region)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specialty Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">진료과</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {specialties.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(specialty)}
                        onChange={() => toggleSpecialty(specialty)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Results Area */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">검색 결과가 없습니다.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-6">
                    총 <span className="font-semibold text-blue-600">{doctors.length}</span>명의 의사를 찾았습니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        {/* 의사 사진 */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold text-xl flex-shrink-0">
                            {doctor.photo_url ? (
                              <img
                                src={doctor.photo_url}
                                alt={doctor.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              doctor.name.charAt(0)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                              {doctor.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <Stethoscope className="w-4 h-4" />
                              <span>{doctor.specialty}</span>
                            </div>
                          </div>
                        </div>

                        {/* 세부 전공 */}
                        {doctor.sub_specialty && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">세부 전공:</span> {doctor.sub_specialty}
                          </p>
                        )}

                        {/* 병원 정보 */}
                        {doctor.hospital && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900">
                              {doctor.hospital.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {doctor.hospital.address}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doctor.hospital.phone}
                            </p>
                          </div>
                        )}

                        {/* 경력 및 지역 */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t">
                          {doctor.experience_years && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{doctor.experience_years}년</span>
                            </div>
                          )}
                          {doctor.hospital?.region && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{doctor.hospital.region}</span>
                            </div>
                          )}
                        </div>

                        {/* 소개 */}
                        {doctor.bio && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {doctor.bio}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
