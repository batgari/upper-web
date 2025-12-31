'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Briefcase } from 'lucide-react';
import DoctorRepository, { type DoctorWithHospital } from '@/app/admin/doctor/repository/DoctorRepository';
import { Department } from '@/app/common/model/Department';

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithHospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 가져오기
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);

        const data = await DoctorRepository.search({
          region: selectedRegion || undefined,
          specialty: selectedSpecialty || undefined,
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
  }, [searchQuery, selectedRegion, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">의사 검색</h1>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="의사 이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">모든 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
            </select>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">모든 진료과</option>
              {Object.values(Department).sort().map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
              <p className="text-sm text-gray-600 mb-4">
                총 <span className="font-semibold text-blue-600">{doctors.length}</span>명의 의사를 찾았습니다.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer"
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
      </div>
    </div>
  );
}
