'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Hospital } from '@/app/database/schema/HospitalTable';
import type { DoctorWithHospital } from './model/DoctorTypes';
import HospitalRepository from '@/app/admin/hospital/repository/HospitalRepository';
import DoctorRepository from './repository/DoctorRepository';
import CareArea from '@/app/common/model/CareArea';
import CareCategory from '@/app/common/model/CareCategory';
import ModifyDoctorModal from './view/ModifyDoctorModal';
import WarningYesNoDialog from '@/app/common/view/WarningYesNoDialog';

export default function DoctorsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithHospital[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithHospital | null>(null);

  // 삭제 다이얼로그 상태
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

  // 의사 추가 클릭
  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setModalMode('create');
    setShowDoctorModal(true);
  };

  // 의사 수정 클릭
  const handleEditDoctor = (doctor: DoctorWithHospital) => {
    setSelectedDoctor(doctor);
    setModalMode('edit');
    setShowDoctorModal(true);
  };

  // 의사 삭제 클릭
  const handleDeleteClick = (doctor: DoctorWithHospital) => {
    setDoctorToDelete(doctor);
    setShowDeleteConfirm(true);
  };

  // 의사 삭제 확인
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

  // 모달 닫기
  const handleModalClose = () => {
    setShowDoctorModal(false);
    setSelectedDoctor(null);
    setModalMode('create');
  };

  // 전문 분야 라벨 가져오기
  const getSpecializedAreaLabel = (area: string) => {
    const isCategory = CareCategory.getAll().includes(area as CareCategory);
    return isCategory
      ? `${CareCategory.getLabel(area as CareCategory)} (전체)`
      : CareArea.getLabel(area as CareArea);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">의사 관리</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">등록된 의사 목록을 관리합니다</p>
        </div>
        <button
          onClick={handleAddDoctor}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전문 분야</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">병원</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">지역</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doctor.specialized_areas?.map(getSpecializedAreaLabel).join(', ') || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital?.region}</td>
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
                    <span className="text-gray-500">전문 분야:</span>
                    <span className="font-medium text-gray-900">
                      {doctor.specialized_areas?.map(getSpecializedAreaLabel).join(', ') || '-'}
                    </span>
                  </div>
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

      {/* 의사 추가/수정 모달 */}
      <ModifyDoctorModal
        isOpen={showDoctorModal}
        mode={modalMode}
        doctor={selectedDoctor}
        hospitals={hospitals}
        onClose={handleModalClose}
        onSuccess={fetchDoctors}
      />

      {/* 삭제 확인 다이얼로그 */}
      <WarningYesNoDialog
        isOpen={showDeleteConfirm}
        title="의사 삭제"
        message={`${doctorToDelete?.name} 의사를 삭제하시겠습니까?`}
        subMessage="이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        confirmingText="삭제 중..."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDoctorToDelete(null);
        }}
        loading={loading}
      />
    </div>
  );
}
