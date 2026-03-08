import { Component, ViewChild } from '@angular/core';
import { InventarioService } from '@/services/inventario.service';

import { CustomPaginatedTableComponent } from '@/components/custom-controls/custom-paginated-table/custom-paginated-table.component';
import { TableColumnInterface } from '@/interfaces/table-column.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomDialogComponent } from '@/components/custom-controls/custom-dialog/custom-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { TableActionInterface } from '@/interfaces/table-action.interface';
import { FormFieldInterface } from '@/interfaces/form-field.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermissionsService } from '@/services/permissions.service';
import { Ubicacion } from '@/interfaces/inventario.interface';
import { HttpResponseBody } from '@/interfaces/http-response-body.interface';
import { PaginatedData } from '@/interfaces/paginated-data.interface';


@Component({
  selector: 'app-ubicaciones',
  imports: [
    TranslateModule,
    CustomPaginatedTableComponent,
    CustomDialogComponent,
    DialogModule
  ],
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.scss'
})
export class UbicacionesComponent {

  @ViewChild('table') table!: CustomPaginatedTableComponent;


  columns: TableColumnInterface[] = []
  actions: TableActionInterface[] = [];
  data: unknown[] = []
  totalRows: number = 0

  title: string = 'ubicaciones.title'
  endpointName: string = 'inventarios/ubicaciones'

  inputFields: FormFieldInterface[] = []
  filterFields: FormFieldInterface[] = []
  form: FormGroup = new FormGroup({})
  filterForm: FormGroup = new FormGroup({})
  showForm: boolean = false

  editingRow: unknown | null = null
  isChangingPassword: boolean = false

  gridCols: string = '3';


  constructor(
    private inventariosService: InventarioService,
    private permissions: PermissionsService,
    private ruta: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.generateColumns()
    this.generateInputFields()
    this.generateFilterFields()
    this.generateActions()
    this.ruta.data.subscribe((resolvers) => {
      this.data = resolvers['ubicaciones'].results
    })
    this.form = new FormGroup({
      descripcion: new FormControl('', { validators: [Validators.required] }),
    })
    this.filterForm = new FormGroup({
      descripcion: new FormControl(''),
      estatus: new FormControl(null),
    })
  }

  new() {
    this.gridCols = '1';
    this.isChangingPassword = false
    this.editingRow = null
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.form.get('descripcion')?.enable()
    this.showForm = true
  }

  generateColumns() {
    this.columns = [
      { label: 'ubicaciones.table.id', field: 'id_ubicacion', sortName: 'id_ubicacion', type: 'id', minWidth: '8rem' },
      { label: 'ubicaciones.table.descripcion', field: 'descripcion', sortName: 'ubicacion.descripcion', type: 'text', minWidth: '16rem' },
      {
        label: 'ubicaciones.table.estatus', field: 'estatus', sortName: 'ubicacion.estatus', type: 'option', minWidth: '8rem',
        options: [
          { label: 'core.table.status-active', value: 1 },
          { label: 'core.table.status-suspended', value: 0 },
          { label: 'core.table.status-deleted', value: 3 }
        ],
        optionsFormat: [
          { severity: 'success', value: 1 },
          { severity: "warn", value: 0 },
          { severity: "danger", value: 3 }
        ]
      },
    ]
  }

  generateInputFields() {
    this.inputFields = [
      {
        label: 'ubicaciones.form.descripcion',
        name: 'descripcion',
        type: 'text',
        required: true,
        show: true
      },
    ]
  }

  generateFilterFields() {
    this.filterFields = [
      {
        label: 'ubicaciones.form.descripcion',
        name: 'descripcion',
        colName: 'descripcion',
        type: 'text',
        required: false,
        show: true
      },
      {
        label: 'ubicaciones.form.estatus',
        name: 'estatus',
        colName: 'estatus',
        type: 'select',
        required: false,
        show: true,
        options: [
          { label: this.translate.instant('core.table.status-active'), value: 1 },
          { label: this.translate.instant('core.table.status-suspended'), value: 0 }
        ]
      }
    ]
  }

  generateActions() {
    this.actions = [
      {
        label: 'core.table.actions-menu.edit',
        icon: 'pi pi-pencil',
        type: 'button',
        permission: 'inventario.change_ubicacion',
        command: (rowData) => this.editRow(rowData)
      },
      {
        label: 'core.table.actions-menu.activate',
        icon: 'pi pi-play',
        type: 'button',
        permission: 'inventario.change_ubicacion',
        condition: [{ field: 'estatus', operator: 'notEquals', value: 1, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 1)
      },
      {
        label: 'core.table.actions-menu.suspend',
        icon: 'pi pi-ban',
        type: 'button',
        permission: 'inventario.change_ubicacion',
        condition: [{ field: 'estatus', operator: 'notEquals', value: 0, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 0)
      },
      {
        label: 'core.table.actions-menu.delete',
        icon: 'pi pi-trash',
        type: 'button',
        permission: 'inventario.delete_ubicacion',
        command: (rowData) => this.changeStatus(rowData, -1)
      },
    ]
  }

  editRow(row: unknown) {
    this.gridCols = '1';
    this.editingRow = row
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.form.get('descripcion')?.setValue((row as { descripcion: string })['descripcion'])
    this.showForm = true
  }

  changeStatus(fila: unknown, newStatus: number) {
    if (newStatus == -1) {
      this.inventariosService.UbicacionDeleteApi((fila as Ubicacion)['id_ubicacion']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    } else {
      let ubicacion = {
        estatus: newStatus
      }
      this.inventariosService.UbicacionUpdateApi((fila as Ubicacion)['id_ubicacion'], ubicacion).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    }
  }

  saveData() {
    let ubicacion: Ubicacion = {
      descripcion: this.form.get('descripcion')?.value,
    }
    if (this.editingRow) {
      this.inventariosService.UbicacionUpdateApi((this.editingRow as Ubicacion)['id_ubicacion'], ubicacion).subscribe({
        next: (resp) => {
          this.inventariosService.UbicacionListApi().subscribe({
            next: (response: PaginatedData<Ubicacion>) => {
              this.data = response.results
              this.totalRows = response.count
              this.showForm = false
            }
          })
        }
      })
    } else {
      this.inventariosService.UbicacionCreateApi(ubicacion).subscribe({
        next: (resp) => {
          this.inventariosService.UbicacionListApi().subscribe({
            next: (response: PaginatedData<Ubicacion>) => {
              this.data = response.results
              this.totalRows = response.count
              this.showForm = false
            }
          })
        }
      })
    }
  }

  closeModal() {
    this.showForm = false
  }

}
