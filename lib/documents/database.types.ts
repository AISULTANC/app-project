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
      documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number | null
          content_text: string | null
          file_path: string | null
          uploaded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          file_size?: number | null
          content_text?: string | null
          file_path?: string | null
          uploaded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          file_size?: number | null
          content_text?: string | null
          file_path?: string | null
          uploaded_at?: string
          created_at?: string
        }
      }
    }
  }
}
