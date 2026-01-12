import { Hospital } from '@/app/database/schema/HospitalTable';
import { Doctor, DoctorTable } from '../../../database/schema/DoctorTable';


export interface DoctorWithHospital extends Doctor {
  hospital: Hospital | null;
}

export interface DoctorSearchFilters {
  region?: string;
  careArea?: string;
  query?: string;
}
