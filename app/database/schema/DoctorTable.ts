// 고정된 값 타입 (최대 30글자)
export type CareArea = string;
export type Language = string;

export interface DoctorTable {
  Row: {
    id: string
    created_at: string
    name: string
    aspired_beauty: string[]  // 추구하는 beauty
    care_philosophy: string | null  // 진료 철학
    clinical_experience: string[]  // 임상 경력
    specialist_experience: string[]  // 전문의 취득 후 임상 경력
    specialized_area: CareArea[]  // 전문 분야
    languages: Language[]  // 구사 가능 언어
    hospital_id: string
    photo_url: string | null
    experience_years: number | null
    available_hours: string | null
  }
  Insert: {
    id?: string
    created_at?: string
    name: string
    aspired_beauty?: string[]
    care_philosophy?: string | null
    clinical_experience?: string[]
    specialist_experience?: string[]
    specialized_area?: CareArea[]
    languages?: Language[]
    hospital_id: string
    photo_url?: string | null
    experience_years?: number | null
    available_hours?: string | null
  }
  Update: {
    id?: string
    created_at?: string
    name?: string
    aspired_beauty?: string[]
    care_philosophy?: string | null
    clinical_experience?: string[]
    specialist_experience?: string[]
    specialized_area?: CareArea[]
    languages?: Language[]
    hospital_id?: string
    photo_url?: string | null
    experience_years?: number | null
    available_hours?: string | null
  }
}

export type Doctor = DoctorTable['Row'];
export type DoctorInsert = DoctorTable['Insert'];
export type DoctorUpdate = DoctorTable['Update'];