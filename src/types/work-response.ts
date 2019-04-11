export interface WorkResponse {
  status: boolean;
  message: boolean | string;
  result: Result;
}

export interface Result {
  netSalary: number;
  grossSalary: number;
  tax: number;
  currency: string;
  days_in_a_row: number;
  to_achievment: number;
  to_achievment_text: string;
  xp: number;
  health: number;
  consumedSummary: any[];
  first_work: boolean;
  daily_tasks_done: boolean;
}
