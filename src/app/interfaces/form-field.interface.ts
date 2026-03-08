import { SelectOptionsInterface } from "./select-options.interface";

export interface FormFieldInterface{
  name: string;
  label: string;
  type: string;
  show?: boolean;
  colName?:string;
  min?: number;
  max?: number;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  mode?: string;
  currency?: string;
  step?: number;
  classList?: string;
  allowSpaces?:boolean;
  pattern?: string;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  value?: unknown;
  initialValue?:unknown;
  options?: SelectOptionsInterface[];
  suggestions?:string[];
}