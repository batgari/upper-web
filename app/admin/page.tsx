'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Building2, ArrowRight } from 'lucide-react';
import DoctorRepository from './doctor/repository/DoctorRepository';
import HospitalRepository from './hospital/repository/HospitalRepository';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalHospitals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsCount, hospitalsCount] = await Promise.all([
        DoctorRepository.count(),
        HospitalRepository.count(),
      ]);

      setStats({
        totalDoctors: doctorsCount,
        totalHospitals: hospitalsCount,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">대시보드</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">총 의사 수</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">총 병원 수</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHospitals}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 바로가기 링크 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 작업</h2>
        <div className="space-y-3">
          <Link
            href="/admin/doctor"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">의사 관리</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/admin/hospital"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">병원 관리</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
