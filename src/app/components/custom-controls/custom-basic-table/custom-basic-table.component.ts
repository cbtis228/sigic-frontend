import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TableColumnInterface } from '../../../interfaces/table-column.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ConditionInterface } from '../../../interfaces/condition.interface';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { TableActionInterface } from '../../../interfaces/table-action.interface';
import { MenuService } from '../../../services/menu.service';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-custom-basic-table',
  imports: [
      CommonModule,
      FormsModule,
      TranslateModule,
      ButtonModule,
      SelectModule,
      InputTextModule,
      InputGroupModule,
      TableModule,
      PaginatorModule,
      MenuModule,
      TagModule,
  ],
  templateUrl: './custom-basic-table.component.html',
  styleUrl: './custom-basic-table.component.scss'
})
export class CustomBasicTableComponent {

  @Input() title: string = ''
  @Input() columnHeaders: TableColumnInterface[] = []
  @Input() tableId: string = ''
  @Input() data: unknown[] = []
  @Input() actions: TableActionInterface[] = []
  @Input() totalRows: number = 0
  @Input() endpointName!: string;
  @Input() filterFields!: FormFieldInterface[];
  @Input() filterForm!: FormGroup;

  @Output() onNew: EventEmitter<Event> = new EventEmitter<Event>()

  @ViewChild('actionsMenu') actionsMenu!: Menu;
  @ViewChild('datatable') datatable!: Table

  first: number = 0;
  rows: number = 10;
  sortField: string = ''
  sortOrder: number = 1;
  isSorted?: boolean = false;
  globalSearchText: string = ''

  showFiltersForm: boolean = false

  public contextMenuItems: MenuItem[] = [];

  constructor(
    public menuService: MenuService,
    private translate: TranslateService,
  ) { }


  private evaluateCondition(rowData: Record<string, unknown>, condition: ConditionInterface): boolean {
    const fieldValue = rowData[condition.field];
    const conditionValue = this.parseValue(condition.value, condition.type);

    switch (condition.operator) {
      case 'equals': return this.compareEquals(fieldValue, conditionValue, condition.type);
      case 'notEquals': return !this.compareEquals(fieldValue, conditionValue, condition.type);
      case 'biggerThan': return Number(fieldValue) > Number(conditionValue);
      case 'lessThan': return Number(fieldValue) < Number(conditionValue);
      case 'biggerOrEqualThan': return Number(fieldValue) >= Number(conditionValue);
      case 'lessOrEqualThan': return Number(fieldValue) <= Number(conditionValue);
      case 'includes': return String(fieldValue).includes(String(conditionValue));
      case 'notIncludes': return !String(fieldValue).includes(String(conditionValue));
      default: return false;
    }
  }

  private parseValue(value: unknown, type: string): unknown {
    switch (type.toLowerCase()) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value;
      case 'date':
        const date = new Date(value as string);
        return isNaN(date.getTime()) ? null : date;
      case 'string':
      default:
        return value;
    }
  }

  private compareEquals(a: unknown, b: unknown, type: string): boolean {
    if (type === 'date') {
      const aDate = a instanceof Date ? a : new Date(a as string);
      const bDate = b instanceof Date ? b : new Date(b as string);
      return aDate?.getTime() === bDate?.getTime();
    }
    return a === b;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key]) || null, obj);
  }

  deleteRow(rowIndex:number){
    this.data.splice(rowIndex, 1)
  }

  returnOptionValue(options: { label: string, value: unknown }[], value: unknown): string {
    return options.find((option) => option.value == value)?.label ?? '';
  }

  returnOptionColor(optionsFormat: { severity: "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined, value: unknown }[], value: unknown): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    return optionsFormat.find((option) => option.value == value)?.severity;
  }

}
