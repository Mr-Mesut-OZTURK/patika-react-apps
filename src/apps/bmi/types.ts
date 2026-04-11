export type BMICategory = "underweight" | "normal" | "overweight" | "obese";

export interface BMIData {
  height: number; // cm
  weight: number; // kg
  bmi: number;
  category: BMICategory;
  date: string; // ISO string
}
