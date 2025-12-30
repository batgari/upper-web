'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Building2, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: '대시보드',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: '의사 관리',
      href: '/admin/doctors',
      icon: Users,
    },
    {
      name: '병원 관리',
      href: '/admin/hospitals',
      icon: Building2,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">관리자</h1>
          <p className="text-sm text-gray-500 mt-1">Upper Admin</p>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
