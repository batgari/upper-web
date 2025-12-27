export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      doctors: {
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
          region: string
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
          region: string
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
          region?: string
          available_hours?: string | null
        }
      }
      hospitals: {
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
