'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Building2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalHospitals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // 의사 수 조회
    const { count: doctorsCount } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    // 병원 수 조회
    const { count: hospitalsCount } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalDoctors: doctorsCount || 0,
      totalHospitals: hospitalsCount || 0,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">Upper 관리자 대시보드</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
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
            href="/admin/doctors"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">의사 관리</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/admin/hospitals"
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
