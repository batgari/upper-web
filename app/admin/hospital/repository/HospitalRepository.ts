import { supabase } from '@/app/main/agent/SupabaseAgent';
import type { Hospital, HospitalInsert } from '@/app/database/schema/HospitalTable';

class HospitalRepository {
  async fetchAll(): Promise<Hospital[]> {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch hospitals: ${error.message}`);
    }

    return data as Hospital[];
  }

  async count(): Promise<number> {
    const { count, error } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count hospitals: ${error.message}`);
    }

    return count || 0;
  }

  async create(hospital: HospitalInsert): Promise<void> {
    const { error } = await supabase
      .from('hospitals')
      .insert([hospital as any]);

    if (error) {
      throw new Error(`Failed to create hospital: ${error.message}`);
    }
  }
}

export default new HospitalRepository();
