import { ConditionInterface } from "./condition.interface";

export interface TableActionInterface {
  label?: string;
  icon?: string;
  type?: 'button' | 'link' | 'separator';
  separator?:boolean;
  condition?: ConditionInterface[]
  permission?:string;
  command?: (rowData: unknown) => void;  // Change to receive rowData directly
  routerLink?: string;
  tooltip?: string;
  color?: string;
  disabled?: boolean;
}
