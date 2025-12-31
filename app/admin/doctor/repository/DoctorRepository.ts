import { supabase } from '@/app/main/agent/SupabaseAgent';
import type { DoctorInsert, DoctorUpdate } from '@/app/database/schema/DoctorTable';
import type { DoctorWithHospital, DoctorSearchFilters } from '../model/DoctorTypes';

class DoctorRepository {
  async fetchAll(): Promise<DoctorWithHospital[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, hospital:hospitals(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }

    return data as DoctorWithHospital[];
  }

  async search(filters: DoctorSearchFilters): Promise<DoctorWithHospital[]> {
    let query = supabase
      .from('doctors')
      .select('*, hospital:hospitals(*)');

    if (filters.specialty) {
      query = query.eq('specialty', filters.specialty);
    }
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to search doctors: ${error.message}`);
    }

    let results = data as DoctorWithHospital[];

    // 클라이언트 측에서 지역 필터링
    if (filters.region) {
      results = results.filter(doctor => doctor.hospital?.region === filters.region);
    }

    return results;
  }

  async count(): Promise<number> {
    const { count, error } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count doctors: ${error.message}`);
    }

    return count || 0;
  }

  async create(doctor: DoctorInsert): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .insert([doctor as any]);

    if (error) {
      throw new Error(`Failed to create doctor: ${error.message}`);
    }
  }

  async getById(id: string): Promise<DoctorWithHospital> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, hospital:hospitals(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }

    return data as DoctorWithHospital;
  }

  async update(id: string, updates: DoctorUpdate): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .update(updates as any)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update doctor: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete doctor: ${error.message}`);
    }
  }
}

export default new DoctorRepository();
