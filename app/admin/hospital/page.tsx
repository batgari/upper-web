'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Hospital } from '@/app/database/schema/HospitalTable';
import HospitalRepository from './repository/HospitalRepository';
import ModifyHospitalModal from './view/ModifyHospitalModal';

export default function HospitalsPage() {
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // 병원 목록 불러오기
  const fetchHospitals = async () => {
    try {
      const data = await HospitalRepository.fetchAll();
      setHospitals(data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">병원 관리</h1>
        </div>
        <button
          onClick={() => setShowHospitalModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          병원 추가
        </button>
      </div>

      {/* 병원 목록 */}
      {hospitals.length > 0 ? (
        <>
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
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
                    <tr key={hospital.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{hospital.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-4">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{hospital.region}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">주소:</span>
                    <p className="text-gray-700 mt-1">{hospital.address}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">전화번호:</span>
                    <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">{hospital.phone}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">등록된 병원이 없습니다.</p>
        </div>
      )}

      {/* 병원 추가 모달 */}
      <ModifyHospitalModal
        isOpen={showHospitalModal}
        onClose={() => setShowHospitalModal(false)}
        onSuccess={fetchHospitals}
      />
    </div>
  );
}
