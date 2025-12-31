'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { Hospital } from '@/app/database/schema/HospitalTable';
import type { DoctorInsert } from '@/app/database/schema/DoctorTable';
import HospitalRepository from '@/app/admin/hospital/repository/HospitalRepository';
import DoctorRepository, { type DoctorWithHospital } from './repository/DoctorRepository';
import { Department } from '@/app/common/model/Department';

export default function DoctorsPage() {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithHospital[]>([]);
  const [loading, setLoading] = useState(false);

  // 병원 목록 불러오기
  const fetchHospitals = async () => {
    try {
      const data = await HospitalRepository.fetchAll();
      setHospitals(data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  // 의사 목록 불러오기
  const fetchDoctors = async () => {
    try {
      const data = await DoctorRepository.fetchAll();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  // 의사 추가 핸들러
  const handleAddDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const doctorData: DoctorInsert = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      sub_specialty: formData.get('sub_specialty') as string,
      hospital_id: formData.get('hospital_id') as string,
      bio: formData.get('bio') as string,
      experience_years: parseInt(formData.get('experience_years') as string),
      region: formData.get('region') as string,
      available_hours: formData.get('available_hours') as string,
      photo_url: formData.get('photo_url') as string || null,
    };

    try {
      await DoctorRepository.create(doctorData);
      setShowDoctorModal(false);
      fetchDoctors();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('의사 추가에 실패했습니다: ' + (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">의사 관리</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">등록된 의사 목록을 관리합니다</p>
        </div>
        <button
          onClick={() => setShowDoctorModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          의사 추가
        </button>
      </div>

      {/* 의사 목록 */}
      {doctors.length > 0 ? (
        <>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">진료과</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">세부 전공</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">병원</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">지역</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">경력</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.sub_specialty || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.experience_years}년</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{doctor.experience_years}년</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">진료과:</span>
                    <span className="font-medium text-gray-900">{doctor.specialty}</span>
                  </div>
                  {doctor.sub_specialty && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">세부 전공:</span>
                      <span className="text-gray-700">{doctor.sub_specialty}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">병원:</span>
                    <span className="text-gray-700">{doctor.hospital?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">지역:</span>
                    <span className="text-gray-700">{doctor.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">등록된 의사가 없습니다.</p>
        </div>
      )}

      {/* 의사 추가 모달 */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">의사 추가</h3>
              <button onClick={() => setShowDoctorModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경력 (년) *</label>
                  <input
                    type="number"
                    name="experience_years"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">진료과 *</label>
                  <select
                    name="specialty"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    {Object.values(Department).sort().map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">세부 전공</label>
                  <input
                    type="text"
                    name="sub_specialty"
                    placeholder="예: 심장내과, 척추"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소속 병원 *</label>
                  <select
                    name="hospital_id"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지역 *</label>
                  <select
                    name="region"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="인천">인천</option>
                    <option value="부산">부산</option>
                    <option value="대구">대구</option>
                    <option value="광주">광주</option>
                    <option value="대전">대전</option>
                    <option value="울산">울산</option>
                    <option value="세종">세종</option>
                    <option value="강원">강원</option>
                    <option value="충북">충북</option>
                    <option value="충남">충남</option>
                    <option value="전북">전북</option>
                    <option value="전남">전남</option>
                    <option value="경북">경북</option>
                    <option value="경남">경남</option>
                    <option value="제주">제주</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
                <textarea
                  name="bio"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진료 시간</label>
                <input
                  type="text"
                  name="available_hours"
                  placeholder="예: 평일 09:00-18:00, 토요일 09:00-13:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로필 사진 URL</label>
                <input
                  type="url"
                  name="photo_url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '추가 중...' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
