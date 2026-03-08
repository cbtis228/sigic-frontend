export interface TableColumnInterface{
  field:string;
  sortName?:string;
  label:string;
  type:'text'|'option'|'date'|'currency'|'id';
  minWidth?:string;
  options?:{label:string, value:unknown}[];
  optionsFormat?:{severity:"success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined, value:unknown}[];
  format?:string;
}
