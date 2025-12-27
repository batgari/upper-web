'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Hospital, Doctor, HospitalInsert, DoctorInsert } from '@/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 병원 목록 불러오기
  const fetchHospitals = async () => {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHospitals(data as Hospital[]);
    }
  };

  // 의사 목록 불러오기
  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, hospital:hospitals(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDoctors(data as any[]);
    }
  };

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  // 병원 추가 핸들러
  const handleAddHospital = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const hospitalData: HospitalInsert = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      region: formData.get('region') as string,
    };

    const { error } = await supabase
      .from('hospitals')
      .insert([hospitalData as any]);

    if (!error) {
      setShowHospitalModal(false);
      fetchHospitals();
      (e.target as HTMLFormElement).reset();
    } else {
      alert('병원 추가에 실패했습니다: ' + error.message);
    }

    setLoading(false);
  };

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

    const { error } = await supabase
      .from('doctors')
      .insert([doctorData as any]);

    if (!error) {
      setShowDoctorModal(false);
      fetchDoctors();
      (e.target as HTMLFormElement).reset();
    } else {
      alert('의사 추가에 실패했습니다: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'doctors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                의사 관리
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'hospitals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                병원 관리
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'doctors' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">의사 목록</h2>
                  <button
                    onClick={() => setShowDoctorModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    의사 추가
                  </button>
                </div>

                {doctors.length > 0 ? (
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
                          <tr key={doctor.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.sub_specialty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.region}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.experience_years}년</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">등록된 의사가 없습니다.</p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">병원 목록</h2>
                  <button
                    onClick={() => setShowHospitalModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    병원 추가
                  </button>
                </div>

                {hospitals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">병원명</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주소</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">지역</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {hospitals.map((hospital) => (
                          <tr key={hospital.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{hospital.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.region}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">등록된 병원이 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 병원 추가 모달 */}
      {showHospitalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">병원 추가</h3>
              <button onClick={() => setShowHospitalModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddHospital} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">병원명 *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="02-1234-5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역 *</label>
                <select
                  name="region"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">지역 선택</option>
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHospitalModal(false)}
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
                    <option value="내과">내과</option>
                    <option value="외과">외과</option>
                    <option value="정형외과">정형외과</option>
                    <option value="성형외과">성형외과</option>
                    <option value="피부과">피부과</option>
                    <option value="안과">안과</option>
                    <option value="이비인후과">이비인후과</option>
                    <option value="산부인과">산부인과</option>
                    <option value="소아청소년과">소아청소년과</option>
                    <option value="정신건강의학과">정신건강의학과</option>
                    <option value="치과">치과</option>
                    <option value="한의원">한의원</option>
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
