export interface HospitalTable {
  Row: {
    id: string
    created_at: string
    name: string
    address: string
    phone: string
    region: string
  }
  Insert: {
    id?: string
    created_at?: string
    name: string
    address: string
    phone: string
    region: string
  }
  Update: {
    id?: string
    created_at?: string
    name?: string
    address?: string
    phone?: string
    region?: string
  }
}

export type Hospital = HospitalTable['Row'];
export type HospitalInsert = HospitalTable['Insert'];
export type HospitalUpdate = HospitalTable['Update'];


