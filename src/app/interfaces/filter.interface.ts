export interface FilterField {
  value: string | number | boolean | Date | null;
  matchMode: string;
  operator: "and" | "or";  // restringimos a estos dos valores
}
