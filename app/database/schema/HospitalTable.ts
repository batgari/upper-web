export interface HospitalTable {
  Row: {
    id: string
    created_at: string
    name: string
    address: string
    phone: string
    region: string
    homepage: string | null
  }
  Insert: {
    id?: string
    created_at?: string
    name: string
    address: string
    phone: string
    region: string
    homepage?: string | null
  }
  Update: {
    id?: string
    created_at?: string
    name?: string
    address?: string
    phone?: string
    region?: string
    homepage?: string | null
  }
}

export type Hospital = HospitalTable['Row'];
export type HospitalInsert = HospitalTable['Insert'];
export type HospitalUpdate = HospitalTable['Update'];


