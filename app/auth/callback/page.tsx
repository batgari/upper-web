'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/main/agent/SupabaseAgent';
import { AuthRepository } from '@/app/auth/repository/AuthRepository';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // sessionStorage에서 mode 읽기
      const mode = sessionStorage.getItem('auth_mode') || 'login';

      try {
        // Supabase가 Hash Fragment로 토큰을 전달하는 경우 처리
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          router.replace('/?error=auth_failed');
          return;
        }

        if (!data.session) {
          router.replace('/?error=auth_failed');
          return;
        }

        const userId = data.session.user.id;
        const userEmail = data.session.user.email || '';
        const userName = data.session.user.user_metadata?.name || userEmail;

        // users 테이블에서 사용자 확인
        const userExists = await AuthRepository.checkUserExists(userId);

        if (mode === 'signup') {
          if (userExists) {
            // 이미 가입된 사용자
            await supabase.auth.signOut();
            sessionStorage.removeItem('auth_mode');
            // NavBar 상태 업데이트를 위해 약간의 지연 후 페이지 이동
            await new Promise(resolve => setTimeout(resolve, 100));
            window.location.href = '/?message=already_registered';
            return;
          } else {
            // 신규 회원가입: users 테이블에 레코드 생성
            try {
              await AuthRepository.createUser(userId, userEmail, userName);
              sessionStorage.removeItem('auth_mode');
              router.replace('/?message=welcome');
            } catch (insertError) {
              sessionStorage.removeItem('auth_mode');
              router.replace('/?message=signup_failed');
            }
          }
        } else {
          // login 모드
          if (!userExists) {
            // 미가입 사용자
            await supabase.auth.signOut();
            sessionStorage.removeItem('auth_mode');
            // 상태 업데이트를 위해 약간의 지연 후 페이지 이동
            await new Promise(resolve => setTimeout(resolve, 100));
            window.location.href = '/?message=signup_required';
            return;
          } else {
            // 정상 로그인
            sessionStorage.removeItem('auth_mode');
            router.replace('/');
          }
        }
      } catch (err) {
        router.replace('/?error=auth_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
        <p className="text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  );
}
