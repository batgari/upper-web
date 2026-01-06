import { DoctorTable } from './DoctorTable';
import { HospitalTable } from './HospitalTable';
import { UserTable } from './UserTable';

export interface Database {
  public: {
    Tables: {
      doctors: DoctorTable
      hospitals: HospitalTable
      users: UserTable
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
