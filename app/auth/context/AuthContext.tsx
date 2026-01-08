'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/app/main/agent/SupabaseAgent';
import { Database } from '@/app/database/schema/Database';
import { AuthRepository } from '@/app/auth/repository/AuthRepository';

type UserRole = Database['public']['Tables']['users']['Row']['role'];

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: (mode?: 'signup' | 'login') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string, retryCount = 0) => {
    try {
      const role = await AuthRepository.getUserRole(userId);
      setUserRole(role);
      setLoading(false);
    } catch (error: any) {
      // PGRST116: 레코드가 없는 경우 (미가입 사용자)
      if (error.code === 'PGRST116') {
        // 첫 시도에서 레코드가 없으면 재시도 (회원가입 직후 타이밍 이슈)
        if (retryCount < 2) {
          await new Promise(resolve => setTimeout(resolve, 800)); // 800ms 대기
          return await fetchUserRole(userId, retryCount + 1);
        }

        // 회원가입되지 않은 사용자는 세션 삭제
        await supabase.auth.signOut();
        setUser(null);
        setUserRole(null);
        setLoading(false);
        // 사용자에게 메시지 표시
        router.push('/?message=signup_required');
        return;
      } else {
        // 실제 에러인 경우
        setUserRole('user');
        setLoading(false);
      }
    }
  };

  const signInWithGoogle = async (mode: 'signup' | 'login' = 'login') => {
    // mode를 sessionStorage에 저장 (OAuth 리다이렉트 후에도 유지)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth_mode', mode);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    // 세션이 있는지 먼저 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    // 세션이 없으면 이미 로그아웃된 상태이므로 에러를 던지지 않음
    if (!session) {
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      // AuthSessionMissingError는 무시 (이미 세션 확인했지만, 타이밍 이슈로 발생할 수 있음)
      if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
        return;
      }
      throw error;
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAdmin,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
