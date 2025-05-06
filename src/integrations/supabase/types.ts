export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          address: string
          detailed_indicators: Json | null
          environmental_impact: Json
          id: number
          location: number[]
          monitoring_systems: string[]
          name: string
          parameters: Json
          type: string
        }
        Insert: {
          address: string
          detailed_indicators?: Json | null
          environmental_impact: Json
          id?: number
          location: number[]
          monitoring_systems: string[]
          name: string
          parameters: Json
          type: string
        }
        Update: {
          address?: string
          detailed_indicators?: Json | null
          environmental_impact?: Json
          id?: number
          location?: number[]
          monitoring_systems?: string[]
          name?: string
          parameters?: Json
          type?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          date: string
          description: string | null
          id: number
          link: string | null
          name: string
          number: string
        }
        Insert: {
          date: string
          description?: string | null
          id?: number
          link?: string | null
          name: string
          number: string
        }
        Update: {
          date?: string
          description?: string | null
          id?: number
          link?: string | null
          name?: string
          number?: string
        }
        Relationships: []
      }
      measure_legal_docs: {
        Row: {
          document_id: number | null
          id: number
          measure_id: number | null
        }
        Insert: {
          document_id?: number | null
          id?: number
          measure_id?: number | null
        }
        Update: {
          document_id?: number | null
          id?: number
          measure_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measure_legal_docs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measure_legal_docs_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
        ]
      }
      measure_resources: {
        Row: {
          id: number
          measure_id: number | null
          quantity: number
          resource_id: number | null
        }
        Insert: {
          id?: number
          measure_id?: number | null
          quantity: number
          resource_id?: number | null
        }
        Update: {
          id?: number
          measure_id?: number | null
          quantity?: number
          resource_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measure_resources_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measure_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      measures: {
        Row: {
          category_id: number | null
          cost: number
          description: string | null
          effectiveness: number | null
          estimated_time: number | null
          id: number
          name: string
        }
        Insert: {
          category_id?: number | null
          cost?: number
          description?: string | null
          effectiveness?: number | null
          estimated_time?: number | null
          id?: number
          name: string
        }
        Update: {
          category_id?: number | null
          cost?: number
          description?: string | null
          effectiveness?: number | null
          estimated_time?: number | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "measures_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      object_measures: {
        Row: {
          facility_id: number | null
          id: number
          implementation_date: string | null
          measure_id: number | null
          priority: number | null
          status: string
        }
        Insert: {
          facility_id?: number | null
          id?: number
          implementation_date?: string | null
          measure_id?: number | null
          priority?: number | null
          status?: string
        }
        Update: {
          facility_id?: number | null
          id?: number
          implementation_date?: string | null
          measure_id?: number | null
          priority?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "object_measures_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "object_measures_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
        ]
      }
      program_measures: {
        Row: {
          id: number
          measure_id: number | null
          planned_funding: number
          program_id: number | null
          year: number
        }
        Insert: {
          id?: number
          measure_id?: number | null
          planned_funding: number
          program_id?: number | null
          year: number
        }
        Update: {
          id?: number
          measure_id?: number | null
          planned_funding?: number
          program_id?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_measures_measure_id_fkey"
            columns: ["measure_id"]
            isOneToOne: false
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_measures_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "regional_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_programs: {
        Row: {
          budget: number
          description: string | null
          end_date: string
          id: number
          name: string
          start_date: string
        }
        Insert: {
          budget: number
          description?: string | null
          end_date: string
          id?: number
          name: string
          start_date: string
        }
        Update: {
          budget?: number
          description?: string | null
          end_date?: string
          id?: number
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: number
          name: string
          price_per_unit: number
          type: string
          unit: string
        }
        Insert: {
          id?: number
          name: string
          price_per_unit: number
          type: string
          unit: string
        }
        Update: {
          id?: number
          name?: string
          price_per_unit?: number
          type?: string
          unit?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
