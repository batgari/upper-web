'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, AlertCircle } from 'lucide-react';
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
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithHospital | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorWithHospital | null>(null);

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

  // 의사 추가/수정 핸들러 (통합)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const doctorData = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      sub_specialty: formData.get('sub_specialty') as string,
      hospital_id: formData.get('hospital_id') as string,
      bio: formData.get('bio') as string,
      experience_years: parseInt(formData.get('experience_years') as string),
      available_hours: formData.get('available_hours') as string,
      photo_url: formData.get('photo_url') as string || null,
    };

    try {
      if (modalMode === 'create') {
        await DoctorRepository.create(doctorData as DoctorInsert);
        alert('의사 추가 완료!');
      } else if (selectedDoctor) {
        await DoctorRepository.update(selectedDoctor.id, doctorData);
        alert('의사 정보 수정 완료!');
      }

      handleModalClose();
      fetchDoctors();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      const errorMsg = modalMode === 'create' ? '의사 추가' : '의사 수정';
      alert(`${errorMsg}에 실패했습니다: ` + (error as Error).message);
    }

    setLoading(false);
  };

  // 의사 수정 핸들러
  const handleEditDoctor = (doctor: DoctorWithHospital) => {
    setSelectedDoctor(doctor);
    setModalMode('edit');
    setShowDoctorModal(true);
  };

  // 의사 삭제 클릭 핸들러
  const handleDeleteClick = (doctor: DoctorWithHospital) => {
    setDoctorToDelete(doctor);
    setShowDeleteConfirm(true);
  };

  // 의사 삭제 확인 핸들러
  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;

    setLoading(true);
    try {
      await DoctorRepository.delete(doctorToDelete.id);
      alert(`${doctorToDelete.name} 의사 삭제 완료!`);
      fetchDoctors();
      setShowDeleteConfirm(false);
      setDoctorToDelete(null);
    } catch (error) {
      alert('의사 삭제에 실패했습니다: ' + (error as Error).message);
    }
    setLoading(false);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setShowDoctorModal(false);
    setSelectedDoctor(null);
    setModalMode('create');
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.sub_specialty || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.experience_years}년</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(doctor)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">{doctor.experience_years}년</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doctor)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
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
                    <span className="text-gray-700">{doctor.hospital?.region}</span>
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
              <h3 className="text-xl font-bold">
                {modalMode === 'create' ? '의사 추가' : `${selectedDoctor?.name} 수정`}
              </h3>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedDoctor?.name || ''}
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
                    defaultValue={selectedDoctor?.experience_years || ''}
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
                    defaultValue={selectedDoctor?.specialty || ''}
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
                    defaultValue={selectedDoctor?.sub_specialty || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소속 병원 *</label>
                <select
                  name="hospital_id"
                  required
                  defaultValue={selectedDoctor?.hospital_id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">선택</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} ({hospital.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={selectedDoctor?.bio || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진료 시간</label>
                <input
                  type="text"
                  name="available_hours"
                  placeholder="예: 평일 09:00-18:00, 토요일 09:00-13:00"
                  defaultValue={selectedDoctor?.available_hours || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로필 사진 URL</label>
                <input
                  type="url"
                  name="photo_url"
                  placeholder="https://example.com/photo.jpg"
                  defaultValue={selectedDoctor?.photo_url || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? (modalMode === 'create' ? '추가 중...' : '수정 중...')
                    : (modalMode === 'create' ? '추가' : '수정')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && doctorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">의사 삭제</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {doctorToDelete.name} 의사를 삭제하시겠습니까?
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDoctorToDelete(null);
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
