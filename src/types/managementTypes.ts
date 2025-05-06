
export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Measure {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  effectiveness: number | null;
  estimated_time: number | null;
  cost: number;
  category?: Category;
  resources?: MeasureResource[];
  legal_documents?: MeasureLegalDoc[];
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  unit: string;
  price_per_unit: number;
}

export interface MeasureResource {
  id: number;
  measure_id: number | null;
  resource_id: number | null;
  quantity: number;
  resource?: Resource;
}

export interface LegalDocument {
  id: number;
  name: string;
  number: string;
  date: string;
  description: string | null;
  link: string | null;
}

export interface MeasureLegalDoc {
  id: number;
  measure_id: number | null;
  document_id: number | null;
  document?: LegalDocument;
}

export interface ObjectMeasure {
  id: number;
  facility_id: number | null;
  measure_id: number | null;
  priority: number | null;
  status: string;
  implementation_date: string | null;
  measure?: Measure;
}

export interface RegionalProgram {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description: string | null;
  budget: number;
}

export interface ProgramMeasure {
  id: number;
  program_id: number | null;
  measure_id: number | null;
  year: number;
  planned_funding: number;
  measure?: Measure;
}

export enum MeasureStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface MeasureCost {
  id: number;
  name: string;
  totalCost: number;
  resources: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface ProgramReport {
  program: RegionalProgram;
  years: number[];
  totalBudget: number;
  measuresCount: number;
  measuresByYear: Record<number, ProgramMeasure[]>;
  totalByYear: Record<number, number>;
  categoriesDistribution: {
    categoryId: number;
    categoryName: string;
    count: number;
    funding: number;
    percentage: number;
  }[];
}

export interface CategoryStatistics {
  id: number;
  name: string;
  measures_count: number;
  total_cost: number;
  avg_effectiveness: number;
}
