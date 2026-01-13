'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Heart,
  Quote,
  GraduationCap,
  Award,
  Stethoscope,
  Languages,
  User
} from 'lucide-react';
import DoctorRepository, { type DoctorWithHospital } from '@/app/admin/doctor/repository/DoctorRepository';
import CareArea from '@/app/common/model/CareArea';
import Language from '@/app/common/model/Language';

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorWithHospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        setError(null);
        const data = await DoctorRepository.getById(params.id as string);
        setDoctor(data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('의사 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchDoctor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '의사 정보를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로가기</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section - 이름, 사진 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* 사진 */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0 overflow-hidden shadow-lg">
              {doctor.photo_url ? (
                <img
                  src={doctor.photo_url}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 sm:w-20 sm:h-20" />
              )}
            </div>

            {/* 이름 */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h1>
            </div>
          </div>
        </div>

        {/* 소속 병원 */}
        {doctor.hospital && (
          <Section
            icon={<Building2 className="w-5 h-5" />}
            title="소속 병원"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{doctor.hospital.name}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{doctor.hospital.address}</span>
              </div>
              {doctor.hospital.homepage && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <a
                    href={doctor.hospital.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    {doctor.hospital.homepage}
                  </a>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* 추구미 목록 */}
        {doctor.aspired_beauties && doctor.aspired_beauties.length > 0 && (
          <Section
            icon={<Heart className="w-5 h-5" />}
            title="추구하는 아름다움"
          >
            <div className="flex flex-wrap gap-2">
              {doctor.aspired_beauties.map((beauty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-full text-sm font-medium border border-rose-100"
                >
                  {beauty}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* 진료 철학 */}
        {doctor.care_philosophies && (
          <Section
            icon={<Quote className="w-5 h-5" />}
            title="진료 철학"
          >
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
              <p className="text-gray-700 leading-relaxed italic">
                "{doctor.care_philosophies}"
              </p>
            </div>
          </Section>
        )}

        {/* 임상 경력 목록 */}
        {doctor.clinical_experiences && doctor.clinical_experiences.length > 0 && (
          <Section
            icon={<GraduationCap className="w-5 h-5" />}
            title="임상 경력"
          >
            <ul className="space-y-3">
              {doctor.clinical_experiences.map((exp, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{exp}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 전문의 취득 후 임상 경력 목록 */}
        {doctor.specialist_experiences && doctor.specialist_experiences.length > 0 && (
          <Section
            icon={<Award className="w-5 h-5" />}
            title="전문의 취득 후 임상 경력"
          >
            <ul className="space-y-3">
              {doctor.specialist_experiences.map((exp, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{exp}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 시술 분야 목록 */}
        {doctor.specialized_areas && doctor.specialized_areas.length > 0 && (
          <Section
            icon={<Stethoscope className="w-5 h-5" />}
            title="시술 분야"
          >
            <div className="flex flex-wrap gap-2">
              {doctor.specialized_areas.map((area, index) => {
                const label = CareArea.getLabel(area as CareArea) || area;
                return (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </Section>
        )}

        {/* 구사 혹은 통역 언어 목록 */}
        {doctor.languages && doctor.languages.length > 0 && (
          <Section
            icon={<Languages className="w-5 h-5" />}
            title="구사 · 통역 언어"
          >
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((lang, index) => {
                const label = Language.getLabel(lang as Language) || lang;
                return (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

// Section Component
function Section({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
