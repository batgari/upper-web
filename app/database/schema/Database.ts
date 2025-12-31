import { DoctorTable } from './DoctorTable';
import { HospitalTable } from './HospitalTable';

export interface Database {
  public: {
    Tables: {
      doctors: DoctorTable
      hospitals: HospitalTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
