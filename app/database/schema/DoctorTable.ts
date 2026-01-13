import CareArea from '@/app/common/model/CareArea';
import Language from '@/app/common/model/Language';

export interface DoctorTable {
  Row: {
    id: string
    created_at: string
    name: string
    aspired_beauties: string[]  // 추구하는 beauty
    care_philosophies: string | null  // 진료 철학
    clinical_experiences: string[]  // 임상 경력
    specialist_experiences: string[]  // 전문의 취득 후 임상 경력
    specialized_areas: CareArea[]  // 전문 분야
    languages: Language[]  // 구사 가능 언어
    hospital_id: string
    photo_url: string | null
  }
  Insert: {
    id?: string
    created_at?: string
    name: string
    aspired_beauties?: string[]
    care_philosophies?: string | null
    clinical_experiences?: string[]
    specialist_experiences?: string[]
    specialized_areas?: CareArea[]
    languages?: Language[]
    hospital_id: string
    photo_url?: string | null
  }
  Update: {
    id?: string
    created_at?: string
    name?: string
    aspired_beauties?: string[]
    care_philosophies?: string | null
    clinical_experiences?: string[]
    specialist_experiences?: string[]
    specialized_areas?: CareArea[]
    languages?: Language[]
    hospital_id?: string
    photo_url?: string | null
  }
}

export type Doctor = DoctorTable['Row'];
export type DoctorInsert = DoctorTable['Insert'];
export type DoctorUpdate = DoctorTable['Update'];