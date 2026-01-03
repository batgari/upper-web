'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import type { Hospital, HospitalInsert } from '@/app/database/schema/HospitalTable';
import HospitalRepository from './repository/HospitalRepository';

export default function HospitalsPage() {
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  // 주소 관련 상태
  const [baseAddress, setBaseAddress] = useState(''); // 기본 주소 (도로명 주소)
  const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
  const [extraInfo, setExtraInfo] = useState(''); // 괄호 정보 (동, 건물명)
  const [region, setRegion] = useState(''); // 지역 (시/도)

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

  // 주소 검색 완료 핸들러
  const handleCompletePostcode = (data: any) => {
    // 시/도 추출 (서울특별시 -> 서울, 경기도 -> 경기 등)
    let regionName = data.sido;
    if (regionName.includes('특별시')) {
      regionName = regionName.replace('특별시', '');
    } else if (regionName.includes('광역시')) {
      regionName = regionName.replace('광역시', '');
    } else if (regionName.includes('도')) {
      regionName = regionName.replace('도', '');
    }

    // 도로명 주소 사용 (우선) - 괄호 없이
    let fullAddress = data.roadAddress || data.jibunAddress;

    // 괄호 안에 들어갈 추가 정보 (동, 건물명)
    let extraInfoArray = [];

    // 법정동명 추가
    if (data.bname !== '') {
      extraInfoArray.push(data.bname);
    }

    // 건물명이 있고, 공동주택일 경우 추가
    if (data.buildingName !== '' && data.apartment === 'Y') {
      extraInfoArray.push(data.buildingName);
    }

    // 괄호 정보를 별도로 저장
    let extraInfoString = '';
    if (extraInfoArray.length > 0) {
      extraInfoString = `(${extraInfoArray.join(', ')})`;
    }

    setBaseAddress(fullAddress);
    setExtraInfo(extraInfoString);
    setRegion(regionName);
    setShowPostcodeModal(false);
  };

  // 병원 추가 핸들러
  const handleAddHospital = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // 최종 주소: 기본 주소, 상세 주소 (괄호 정보)
    // 형식: "서울 강남구 삼성로 14, 406동 1605호 (개포동, 개포자이 프레지던스)"
    let finalAddress = baseAddress;

    if (detailAddress) {
      finalAddress += `, ${detailAddress}`;
    }

    if (extraInfo) {
      finalAddress += ` ${extraInfo}`;
    }

    const hospitalData: HospitalInsert = {
      name: formData.get('name') as string,
      address: finalAddress.trim(),
      phone: formData.get('phone') as string,
      region: region,
    };

    try {
      await HospitalRepository.create(hospitalData);
      setShowHospitalModal(false);
      fetchHospitals();
      // 폼 초기화
      (e.target as HTMLFormElement).reset();
      setBaseAddress('');
      setDetailAddress('');
      setExtraInfo('');
      setRegion('');
    } catch (error) {
      alert('병원 추가에 실패했습니다: ' + (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">병원 관리</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">등록된 병원 목록을 관리합니다</p>
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
      {showHospitalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
                <div className="space-y-2">
                  {/* 주소 검색 버튼 */}
                  <button
                    type="button"
                    onClick={() => setShowPostcodeModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Search className="w-4 h-4" />
                    주소 검색
                  </button>

                  {/* 기본 주소 (읽기 전용) */}
                  <input
                    type="text"
                    value={baseAddress}
                    readOnly
                    placeholder="주소 검색 버튼을 클릭하세요"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />

                  {/* 상세 주소 입력 */}
                  {baseAddress && (
                    <>
                      <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="상세 주소를 입력하세요 (예: 406동 1605호)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {/* 괄호 정보 표시 */}
                      {extraInfo && (
                        <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          추가 정보: {extraInfo}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {baseAddress && (
                    <>최종 주소: {baseAddress}{detailAddress && `, ${detailAddress}`} {extraInfo}</>
                  )}
                  {!baseAddress && <>예: 서울 강남구 삼성로 14, 406동 1605호 (개포동, 개포자이 프레지던스)</>}
                </p>
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
                <input
                  type="text"
                  value={region}
                  readOnly
                  placeholder="주소 검색 시 자동 입력됩니다"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
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

      {/* 우편번호 검색 모달 */}
      {showPostcodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-lg w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">주소 검색</h3>
              <button
                onClick={() => setShowPostcodeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <DaumPostcode
              onComplete={handleCompletePostcode}
              autoClose={false}
              style={{ height: '500px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
