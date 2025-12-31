import { supabase } from '@/app/main/agent/SupabaseAgent';
import type { Doctor, DoctorInsert } from '@/app/database/schema/DoctorTable';
import type { Hospital } from '@/app/database/schema/HospitalTable';

export interface DoctorWithHospital extends Doctor {
  hospital: Hospital | null;
}

export interface DoctorSearchFilters {
  region?: string;
  specialty?: string;
  query?: string;
}

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

    if (filters.region) {
      query = query.eq('region', filters.region);
    }
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

    return data as DoctorWithHospital[];
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
}

export default new DoctorRepository();
