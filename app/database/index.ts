import { Database } from './database';

export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Hospital = Database['public']['Tables']['hospitals']['Row'];

export type DoctorInsert = Database['public']['Tables']['doctors']['Insert'];
export type HospitalInsert = Database['public']['Tables']['hospitals']['Insert'];

export type DoctorUpdate = Database['public']['Tables']['doctors']['Update'];
export type HospitalUpdate = Database['public']['Tables']['hospitals']['Update'];

export interface DoctorWithHospital extends Doctor {
  hospital: Hospital;
}

export interface SearchFilters {
  region?: string;
  specialty?: string;
  subSpecialty?: string;
  query?: string;
}
