'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');

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
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    의사 추가
                  </button>
                </div>
                <p className="text-gray-500 text-center py-8">
                  Supabase 데이터베이스 연결 후 의사 목록을 관리할 수 있습니다.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">병원 목록</h2>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    병원 추가
                  </button>
                </div>
                <p className="text-gray-500 text-center py-8">
                  Supabase 데이터베이스 연결 후 병원 목록을 관리할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
