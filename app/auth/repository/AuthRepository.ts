import { supabase } from '@/app/main/agent/SupabaseAgent';
import { Database } from '@/app/database/schema/Database';

type UserRole = Database['public']['Tables']['users']['Row']['role'];

export class AuthRepository {
  /**
   * 사용자의 role을 조회합니다.
   */
  static async getUserRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data.role;
  }

  /**
   * 사용자가 존재하는지 확인합니다.
   */
  static async checkUserExists(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    // PGRST116: 레코드가 없는 경우 (정상적인 경우 - 미가입 사용자)
    if (error?.code === 'PGRST116') {
      return false;
    }

    // 다른 에러인 경우
    if (error) {
      throw error;
    }

    return data !== null;
  }

  /**
   * 새로운 사용자를 생성합니다.
   */
  static async createUser(userId: string, email: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        name: name,
        role: 'user',
      })
      .select();

    if (error) {
      throw error;
    }
  }
}
