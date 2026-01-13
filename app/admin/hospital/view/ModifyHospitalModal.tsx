'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import type { HospitalInsert } from '@/app/database/schema/HospitalTable';
import HospitalRepository from '../repository/HospitalRepository';

interface ModifyHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModifyHospitalModal({
  isOpen,
  onClose,
  onSuccess,
}: ModifyHospitalModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);

  // 주소 관련 상태
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [region, setRegion] = useState('');

  // 폼 초기화
  const resetForm = () => {
    setBaseAddress('');
    setDetailAddress('');
    setExtraInfo('');
    setRegion('');
  };

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
      handleClose();
      onSuccess();
    } catch (error) {
      alert('병원 추가에 실패했습니다: ' + (error as Error).message);
    }

    setLoading(false);
  };

  // 모달 닫기
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 병원 추가 모달 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">병원 추가</h3>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
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
                onClick={handleClose}
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
    </>
  );
}
