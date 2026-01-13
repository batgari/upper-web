'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import type { Hospital } from '@/app/database/schema/HospitalTable';
import type { DoctorInsert } from '@/app/database/schema/DoctorTable';
import type { DoctorWithHospital } from '../model/DoctorTypes';
import DoctorRepository from '../repository/DoctorRepository';
import CareArea from '@/app/common/model/CareArea';
import CareCategory from '@/app/common/model/CareCategory';
import Language from '@/app/common/model/Language';

interface ModifyDoctorModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  doctor: DoctorWithHospital | null;
  hospitals: Hospital[];
  onClose: () => void;
  onSuccess: () => void;
}

// 최대 선택 개수
const MAX_SPECIALIZED_AREAS = 3;
const MAX_ASPIRED_BEAUTIES = 3;

export default function ModifyDoctorModal({
  isOpen,
  mode,
  doctor,
  hospitals,
  onClose,
  onSuccess,
}: ModifyDoctorModalProps) {
  const [loading, setLoading] = useState(false);

  // 폼 상태
  const [expandedCategories, setExpandedCategories] = useState<Set<CareCategory>>(new Set());
  const [selectedSpecializedAreas, setSelectedSpecializedAreas] = useState<Set<string>>(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState<Set<Language>>(new Set());
  const [aspiredBeauties, setAspiredBeauties] = useState<string[]>([]);
  const [aspiredBeautyInput, setAspiredBeautyInput] = useState('');
  const [clinicalExperiences, setClinicalExperiences] = useState<string[]>([]);
  const [specialistExperiences, setSpecialistExperiences] = useState<string[]>([]);

  // 모달이 열릴 때 폼 초기화
  useEffect(() => {
    if (isOpen && doctor && mode === 'edit') {
      setSelectedSpecializedAreas(new Set(doctor.specialized_areas || []));
      setSelectedLanguages(new Set((doctor.languages || []) as Language[]));
      setAspiredBeauties(doctor.aspired_beauties || []);
      setClinicalExperiences(doctor.clinical_experiences || []);
      setSpecialistExperiences(doctor.specialist_experiences || []);
    } else if (isOpen && mode === 'create') {
      resetFormState();
    }
  }, [isOpen, doctor, mode]);

  // 폼 초기화
  const resetFormState = () => {
    setExpandedCategories(new Set());
    setSelectedSpecializedAreas(new Set());
    setSelectedLanguages(new Set());
    setAspiredBeauties([]);
    setAspiredBeautyInput('');
    setClinicalExperiences([]);
    setSpecialistExperiences([]);
  };

  // CareCategory 토글
  const toggleCategory = (category: CareCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // CareCategory 선택/해제
  const toggleCategorySelection = (category: CareCategory) => {
    const newSelected = new Set(selectedSpecializedAreas);

    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      if (newSelected.size >= MAX_SPECIALIZED_AREAS) {
        alert(`전문 분야는 최대 ${MAX_SPECIALIZED_AREAS}개까지 선택할 수 있습니다.`);
        return;
      }
      newSelected.add(category);
    }
    setSelectedSpecializedAreas(newSelected);
  };

  // CareArea 선택/해제
  const toggleAreaSelection = (area: CareArea) => {
    const newSelected = new Set(selectedSpecializedAreas);

    if (newSelected.has(area)) {
      newSelected.delete(area);
    } else {
      if (newSelected.size >= MAX_SPECIALIZED_AREAS) {
        alert(`전문 분야는 최대 ${MAX_SPECIALIZED_AREAS}개까지 선택할 수 있습니다.`);
        return;
      }
      newSelected.add(area);
    }
    setSelectedSpecializedAreas(newSelected);
  };

  // 카테고리가 선택되었는지 확인
  const isCategorySelected = (category: CareCategory): boolean => {
    return selectedSpecializedAreas.has(category);
  };

  // 카테고리의 일부 area가 선택되었는지 확인
  const isCategoryPartiallySelected = (category: CareCategory): boolean => {
    const categoryAreas = CareArea.getCareAreaByCareCategory(category);
    return categoryAreas.some(area => selectedSpecializedAreas.has(area));
  };

  // area가 선택되었는지 확인
  const isAreaSelected = (area: CareArea): boolean => {
    return selectedSpecializedAreas.has(area);
  };

  // 언어 토글
  const toggleLanguage = (lang: Language) => {
    const newSelected = new Set(selectedLanguages);
    if (newSelected.has(lang)) {
      newSelected.delete(lang);
    } else {
      newSelected.add(lang);
    }
    setSelectedLanguages(newSelected);
  };

  // 추구하는 beauty 추가
  const addAspiredBeauty = () => {
    if (aspiredBeauties.length >= MAX_ASPIRED_BEAUTIES) {
      alert(`추구하는 아름다움은 최대 ${MAX_ASPIRED_BEAUTIES}개까지 입력할 수 있습니다.`);
      return;
    }
    if (aspiredBeautyInput.trim() && !aspiredBeauties.includes(aspiredBeautyInput.trim())) {
      setAspiredBeauties([...aspiredBeauties, aspiredBeautyInput.trim()]);
      setAspiredBeautyInput('');
    }
  };

  // 추구하는 beauty 삭제
  const removeAspiredBeauty = (beauty: string) => {
    setAspiredBeauties(aspiredBeauties.filter(b => b !== beauty));
  };

  // 임상 경력 추가
  const addClinicalExperience = () => {
    setClinicalExperiences([...clinicalExperiences, '']);
  };

  // 임상 경력 수정
  const updateClinicalExperience = (index: number, value: string) => {
    const newExperiences = [...clinicalExperiences];
    newExperiences[index] = value;
    setClinicalExperiences(newExperiences);
  };

  // 임상 경력 삭제
  const removeClinicalExperience = (index: number) => {
    setClinicalExperiences(clinicalExperiences.filter((_, i) => i !== index));
  };

  // 전문의 경력 추가
  const addSpecialistExperience = () => {
    setSpecialistExperiences([...specialistExperiences, '']);
  };

  // 전문의 경력 수정
  const updateSpecialistExperience = (index: number, value: string) => {
    const newExperiences = [...specialistExperiences];
    newExperiences[index] = value;
    setSpecialistExperiences(newExperiences);
  };

  // 전문의 경력 삭제
  const removeSpecialistExperience = (index: number) => {
    setSpecialistExperiences(specialistExperiences.filter((_, i) => i !== index));
  };

  // 폼 제출 핸들러
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const doctorData = {
      name: formData.get('name') as string,
      specialized_areas: Array.from(selectedSpecializedAreas),
      hospital_id: formData.get('hospital_id') as string,
      experience_years: parseInt(formData.get('experience_years') as string),
      available_hours: formData.get('available_hours') as string,
      photo_url: formData.get('photo_url') as string || null,
      aspired_beauties: aspiredBeauties.filter(b => b.trim()),
      care_philosophies: formData.get('care_philosophies') as string || null,
      clinical_experiences: clinicalExperiences.filter(exp => exp.trim()),
      specialist_experiences: specialistExperiences.filter(exp => exp.trim()),
      languages: Array.from(selectedLanguages),
    };

    try {
      if (mode === 'create') {
        await DoctorRepository.create(doctorData as DoctorInsert);
        alert('의사 추가 완료!');
      } else if (doctor) {
        await DoctorRepository.update(doctor.id, doctorData);
        alert('의사 정보 수정 완료!');
      }

      handleClose();
      onSuccess();
    } catch (error) {
      const errorMsg = mode === 'create' ? '의사 추가' : '의사 수정';
      alert(`${errorMsg}에 실패했습니다: ` + (error as Error).message);
    }

    setLoading(false);
  };

  // 모달 닫기
  const handleClose = () => {
    resetFormState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {mode === 'create' ? '의사 추가' : `${doctor?.name} 수정`}
          </h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* 1. 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={doctor?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 2. 경력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">경력 (년) *</label>
            <input
              type="number"
              name="experience_years"
              required
              min="0"
              defaultValue={doctor?.experience_years || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 3. 프로필 사진 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">프로필 사진 URL</label>
            <input
              type="url"
              name="photo_url"
              placeholder="https://example.com/photo.jpg"
              defaultValue={doctor?.photo_url || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 4. 소속 병원 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소속 병원 *</label>
            <select
              name="hospital_id"
              required
              defaultValue={doctor?.hospital_id || ''}
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

          {/* 5. 추구하는 아름다움 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추구하는 아름다움 <span className="text-xs font-normal text-gray-500">({aspiredBeauties.length}/{MAX_ASPIRED_BEAUTIES})</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={aspiredBeautyInput}
                onChange={(e) => setAspiredBeautyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAspiredBeauty();
                  }
                }}
                placeholder="예: 자연스러운 아름다움"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAspiredBeauty}
                disabled={aspiredBeauties.length >= MAX_ASPIRED_BEAUTIES}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가
              </button>
            </div>
            {aspiredBeauties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aspiredBeauties.map((beauty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {beauty}
                    <button
                      type="button"
                      onClick={() => removeAspiredBeauty(beauty)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 6. 진료 철학 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">진료 철학</label>
            <textarea
              name="care_philosophies"
              rows={3}
              defaultValue={doctor?.care_philosophies || ''}
              placeholder="의사의 진료 철학이나 신념을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 7. 임상 경력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">임상 경력</label>
            <div className="space-y-2">
              {clinicalExperiences.map((exp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exp}
                    onChange={(e) => updateClinicalExperience(index, e.target.value)}
                    placeholder="예: 서울대학교병원 피부과 전공의"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeClinicalExperience(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addClinicalExperience}
                className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                + 임상 경력 추가
              </button>
            </div>
          </div>

          {/* 8. 전문의 취득 후 임상 경력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전문의 취득 후 임상 경력</label>
            <div className="space-y-2">
              {specialistExperiences.map((exp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exp}
                    onChange={(e) => updateSpecialistExperience(index, e.target.value)}
                    placeholder="예: ABC피부과 원장"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecialistExperience(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecialistExperience}
                className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                + 전문의 경력 추가
              </button>
            </div>
          </div>

          {/* 9. 전문 분야 - 2 Depth 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전문 분야 * <span className="text-xs font-normal text-gray-500">({selectedSpecializedAreas.size}/{MAX_SPECIALIZED_AREAS})</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">카테고리 또는 세부 분야를 최대 {MAX_SPECIALIZED_AREAS}개까지 선택할 수 있습니다.</p>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
              {CareCategory.getAll().map((category) => {
                const categoryAreas = CareArea.getCareAreaByCareCategory(category);
                const isExpanded = expandedCategories.has(category);
                const isSelected = isCategorySelected(category);
                const isPartial = isCategoryPartiallySelected(category);

                return (
                  <div key={category} className="border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center gap-2 p-3 hover:bg-gray-50">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <label className="flex items-center gap-2 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isPartial;
                          }}
                          onChange={() => toggleCategorySelection(category)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {CareCategory.getLabel(category)}
                        </span>
                        {isSelected && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            전체
                          </span>
                        )}
                      </label>
                    </div>

                    {isExpanded && (
                      <div className="pl-10 pr-3 pb-3 space-y-1 bg-gray-50">
                        {categoryAreas.map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={isAreaSelected(area)}
                              onChange={() => toggleAreaSelection(area)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {CareArea.getLabel(area)}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedSpecializedAreas.size > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {Array.from(selectedSpecializedAreas).map((item) => {
                  const isCategory = CareCategory.getAll().includes(item as CareCategory);
                  const label = isCategory
                    ? `${CareCategory.getLabel(item as CareCategory)} (전체)`
                    : CareArea.getLabel(item as CareArea);
                  return (
                    <span
                      key={item}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        isCategory ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => {
                          const newSelected = new Set(selectedSpecializedAreas);
                          newSelected.delete(item);
                          setSelectedSpecializedAreas(newSelected);
                        }}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* 10. 구사/통역 가능 언어 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">구사/통역 가능 언어</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg max-h-32 overflow-y-auto">
              {Language.getAll().map((lang) => (
                <label
                  key={lang}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer text-sm transition-colors ${
                    selectedLanguages.has(lang)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.has(lang)}
                    onChange={() => toggleLanguage(lang)}
                    className="sr-only"
                  />
                  {Language.getLabel(lang)}
                </label>
              ))}
            </div>
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
              {loading
                ? (mode === 'create' ? '추가 중...' : '수정 중...')
                : (mode === 'create' ? '추가' : '수정')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
