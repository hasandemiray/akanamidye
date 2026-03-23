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
      hatlar: {
        Row: {
          id: string
          hat_adi: string
          blok: string
          halat_metresi: number
          metrede_midye: number
          ekim_tarihi: string
          yavru_orani: number
          hedef_kg: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hat_adi: string
          blok: string
          halat_metresi: number
          metrede_midye: number
          ekim_tarihi: string
          yavru_orani?: number
          hedef_kg?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hat_adi?: string
          blok?: string
          halat_metresi?: number
          metrede_midye?: number
          ekim_tarihi?: string
          yavru_orani?: number
          hedef_kg?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
