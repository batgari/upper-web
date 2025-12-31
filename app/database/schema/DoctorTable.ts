export interface DoctorTable {
  Row: {
    id: string
    created_at: string
    name: string
    specialty: string
    sub_specialty: string | null
    hospital_id: string
    photo_url: string | null
    bio: string | null
    experience_years: number | null
    available_hours: string | null
  }
  Insert: {
    id?: string
    created_at?: string
    name: string
    specialty: string
    sub_specialty?: string | null
    hospital_id: string
    photo_url?: string | null
    bio?: string | null
    experience_years?: number | null
    available_hours?: string | null
  }
  Update: {
    id?: string
    created_at?: string
    name?: string
    specialty?: string
    sub_specialty?: string | null
    hospital_id?: string
    photo_url?: string | null
    bio?: string | null
    experience_years?: number | null
    available_hours?: string | null
  }
}

export type Doctor = DoctorTable['Row'];
export type DoctorInsert = DoctorTable['Insert'];
export type DoctorUpdate = DoctorTable['Update'];