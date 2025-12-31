import { Hospital } from '@/app/database/schema/HospitalTable';
import { Doctor, DoctorTable } from '../../../database/schema/DoctorTable';


export interface DoctorWithHospital extends Doctor {
  hospital: Hospital;
}

export interface SearchFilters {
  region?: string;
  specialty?: string;
  subSpecialty?: string;
  query?: string;
}
