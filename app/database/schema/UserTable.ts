import { Json } from '../model/Json';

export interface UserTable {
  Row: {
    id: string
    created_at: string
    email: string
    name: string | null
    role: 'user' | 'admin'
  }
  Insert: {
    id: string
    created_at?: string
    email: string
    name?: string | null
    role?: 'user' | 'admin'
  }
  Update: {
    id?: string
    created_at?: string
    email?: string
    name?: string | null
    role?: 'user' | 'admin'
  }
}
