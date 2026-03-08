import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuService } from '../../../services/menu.service';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table'
import { TableColumnInterface } from '@/interfaces/table-column.interface';
import { TableActionInterface } from '@/interfaces/table-action.interface';
import { TagModule } from 'primeng/tag'
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule, Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ConditionInterface } from '@/interfaces/condition.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginatedDataService } from '@/services/paginated-data.service';
import { HttpResponseBody } from '@/interfaces/http-response-body.interface';
import { PaginatedData } from '@/interfaces/paginated-data.interface';
import { SelectModule } from 'primeng/select';
import { CustomDialogComponent } from '@/components/custom-controls/custom-dialog/custom-dialog.component';
import { FormFieldInterface } from '@/interfaces/form-field.interface';
import { FormGroup, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { StorageService } from '@/services/storage.service';
import { PermissionsService } from '@/services/permissions.service';

@Component({
  selector: 'app-custom-paginated-table',
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
    CustomDialogComponent
  ],
  templateUrl: './custom-paginated-table.component.html',
  styleUrl: './custom-paginated-table.component.scss'
})
export class CustomPaginatedTableComponent {

  @Input() title: string = ''
  @Input() columnHeaders: TableColumnInterface[] = []
  @Input() tableId: string = ''
  @Input() data: unknown[] = []
  @Input() actions: TableActionInterface[] = []
  @Input() totalRows: number = 0
  @Input() endpointName!: string;
  @Input() filterFields!: FormFieldInterface[];
  @Input() filterForm!: FormGroup;
  @Input() permissionShowNew!: string;

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

  showNew: boolean = true

  public contextMenuItems: MenuItem[] = [];

  constructor(
    public menuService: MenuService,
    private translate: TranslateService,
    private db: PaginatedDataService,
    private permissionService: PermissionsService
  ) {
  }

  async ngOnInit() {
    if (this.permissionShowNew && this.permissionShowNew != '') {
      this.showNew = await this.permissionService.validate('inventario.add_ubicacion')
    }
    let menuActions: TableActionInterface[] = []
    for (const action of this.actions) {
      if (action.permission && action.permission != '') {
        if (await this.permissionService.validate(action.permission)) {
          menuActions.push(action)
        }
      } else {
        menuActions.push(action)
      }
    }
    this.actions = menuActions
  }

  private updateContextMenu(rowData: Record<string, unknown>) {
    this.contextMenuItems = this.actions
      .filter(action => {
        if (!action.condition) return true;
        return action.condition.every(condition =>
          this.evaluateCondition(rowData, condition)
        );
      })
      .map(action => ({
        label: action.label ? this.translate.instant(action.label) : null,
        icon: action.icon ? action.icon! : undefined,
        command: () => action.command ? action.command?.(rowData) : null,
        separator: action.separator ?? undefined
      }));
  }

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

  onMenuToggle(event: Event, rowData: Record<string, unknown>) {
    this.updateContextMenu(rowData);
    this.actionsMenu.toggle(event);
  }

  loadTable(event?: TableLazyLoadEvent, customFilters?: { field: string, value: string }[]) {
    let filters: string = ''
    if (event) {
      this.first = event?.first || 0;
      this.rows = event?.rows || 10;
      this.sortOrder = event?.sortOrder || 0;
      this.sortField = event?.sortField?.toString() || '';
    }
    if (customFilters) {
      filters = JSON.stringify(customFilters)
    }
    this.db.getAllPaginated(
      this.endpointName,
      this.first,
      this.rows,
      this.sortField,
      this.sortOrder == 1 ? 'asc' : 'desc',
      filters,
      this.globalSearchText
    ).subscribe({
      next: (response: PaginatedData<any>) => {
        this.data = response.results || [];
        this.totalRows = response.count || 0;
      }
    });
  }

  filterTable() {
    let filters: { field: string, value: string }[] = []
    for (const field of this.filterFields) {
      if (
        this.filterForm.get(field.name)?.value != null
        && this.filterForm.get(field.name)?.value !== undefined
        && this.filterForm.get(field.name)?.value !== '') {
        filters.push({
          field: field.colName ?? field.name,
          value: this.filterForm.get(field.name)?.value as string
        })
      }
    }
    let mockEvent: TableLazyLoadEvent = {
      first: this.first,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    }
    this.showFiltersForm = false
    this.loadTable(mockEvent, filters)
  }

  new() {
    this.onNew.emit()
  }

  showFilters() {
    // Toggle filters logic
    this.showFiltersForm = true
  }

  resetTable() {
    this.globalSearchText = ''
    this.datatable.reset()
    this.filterForm.reset()
    this.filterForm.markAsPristine()
    this.filterForm.markAsUntouched()
  }

  returnOptionValue(options: { label: string, value: unknown }[], value: unknown): string {
    return options.find((option) => option.value == value)?.label ?? '';
  }

  returnOptionColor(optionsFormat: { severity: "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined, value: unknown }[], value: unknown): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    return optionsFormat.find((option) => option.value == value)?.severity;
  }

  returnOptionBadgeClass(optionsFormat: {severity:"success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined, value:unknown}[], value: any): string {
    const severityMap: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-orange-100 text-orange-800',
      danger: 'bg-red-100 text-red-800',
      secondary: 'bg-gray-100 text-gray-700',
      contrast: 'bg-gray-800 text-white',
    };

    const match = optionsFormat.find(opt => opt.value === value);
    return severityMap[match?.severity ?? ''] ?? 'bg-gray-100 text-gray-700';
  }

}
