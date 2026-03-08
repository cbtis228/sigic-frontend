import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomPaginatedTableComponent } from '../../custom-controls/custom-paginated-table/custom-paginated-table.component';
import { TableColumnInterface } from '../../../interfaces/table-column.interface';
import { ActivatedRoute } from '@angular/router';
import { TableActionInterface } from '../../../interfaces/table-action.interface';
import { DialogModule } from 'primeng/dialog'
import { CustomDialogComponent } from '../../custom-controls/custom-dialog/custom-dialog.component';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfilesService } from '../../../services/profiles.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionsService } from '../../../services/permissions.service';
import { HttpResponseBody } from '../../../interfaces/http-response-body.interface';
import { DbProfilePermissionInterface } from '../../../interfaces/db-profilePermission.interface';
import { CommonModule } from '@angular/common';
import { Checkbox, CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { DbPermissionInterface } from '../../../interfaces/db-permission.interface';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { GrantedPermissionInterface } from '../../../interfaces/granted-permission-interface';


@Component({
  selector: 'app-profiles',
  imports: [
    CommonModule,
    CustomPaginatedTableComponent,
    CustomDialogComponent,
    DialogModule,
    TranslateModule,
    CheckboxModule,
    ReactiveFormsModule,
    PanelModule,
    AccordionModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent{

  @ViewChild('table') table!: CustomPaginatedTableComponent

  columns: TableColumnInterface[] = []
  actions: TableActionInterface[] = []
  data: unknown[] = []
  totalRows: number = 0

  title: string = 'profiles.title'
  endpointName: string = 'profiles'

  inputFields: FormFieldInterface[] = []
  filterFields: FormFieldInterface[] = []
  form: FormGroup = new FormGroup({})
  filterForm: FormGroup = new FormGroup({})
  showForm: boolean = false

  showPermissionsForm: boolean = false
  grantedPermissions: DbProfilePermissionInterface[] = []
  modulesPermissions: string[] = []
  mapModules = new Map();

  userPermissions:GrantedPermissionInterface[]=[]

  editingRow: unknown | null = null

  profile_id:number=0

  constructor(
    private ruta: ActivatedRoute,
    private dbProfiles: ProfilesService,
    private translate: TranslateService,
    private dbPermissions: PermissionsService
  ) {
    this.generateColumns()
    this.generateInputFields()
    this.generateFilterFields()
    this.generateActions()
    this.ruta.data.subscribe((resolvers) => {
      this.data = resolvers['profiles'].data.rows
      this.totalRows = resolvers['profiles'].data.count
      this.userPermissions=resolvers['userPermissions']
    });
    this.form = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    })
    this.filterForm = new FormGroup({
      name: new FormControl(''),
      status: new FormControl(null),
    })
  }

  generateColumns() {
    this.columns = [
      /* { label: 'profiles.table.id', field: 'id', sortName: 'profile_id', type: 'text', minWidth: '8rem' }, */
      { label: 'profiles.table.name', field: 'name', type: 'text', minWidth: '16rem' },
      {
        label: 'profiles.table.status', field: 'status', type: 'option', minWidth: '8rem',
        options: [
          { label: 'core.table.status-active', value: 1 },
          { label: 'core.table.status-suspended', value: 0 },
          { label: 'core.table.status-deleted', value: -1 }
        ],
        optionsFormat: [
          { severity: 'success', value: 1 },
          { severity: "warn", value: 0 },
          { severity: "danger", value: -1 }
        ]
      },
    ]
  }

  generateInputFields() {
    this.inputFields = [
      {
        label: 'profiles.table.name',
        name: 'name',
        type: 'text',
        required: true,
        show: true
      }
    ]
  }

  generateFilterFields() {
    this.filterFields = [
      {
        label: 'profiles.form.name',
        name: 'name',
        colName: 'name',
        type: 'text',
        required: false,
        show: true
      },
      {
        label: 'profiles.form.status',
        name: 'status',
        colName: 'status',
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
        permission:'profiles_update',
        command: (rowData) => this.editRow(rowData)
      },
      {
        label: 'core.table.actions-menu.grant-permissions',
        icon: 'pi pi-key',
        type: 'button',
        permission:'permissions_config',
        command: (rowData) => this.grantPermissions(rowData)
      },
      {
        separator:true
      },
      {
        label: 'core.table.actions-menu.activate',
        icon: 'pi pi-play',
        type: 'button',
        permission:'profiles_update',
        condition: [{ field: 'status', operator: 'notEquals', value: 1, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 1)
      },
      {
        label: 'core.table.actions-menu.suspend',
        icon: 'pi pi-ban',
        type: 'button',
        permission:'profiles_update',
        condition: [{ field: 'status', operator: 'notEquals', value: 0, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 0)
      },
      {
        label: 'core.table.actions-menu.delete',
        icon: 'pi pi-trash',
        type: 'button',
        permission:'profiles_delete',
        command: (rowData) => this.changeStatus(rowData, -1)
      }
    ]
  }

  new() {
    this.editingRow = null
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.showForm = true
  }

  changeStatus(fila: unknown, newStatus: number) {
    if (newStatus == -1) {
      this.dbProfiles.delete((fila as { id: number })['id']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    } else {
      let profile = {
        status: newStatus
      }
      this.dbProfiles.update(profile, (fila as { id: number })['id']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    }
  }

  editRow(row: unknown) {
    this.editingRow = row
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.form.get('name')?.setValue((row as { name: string })['name'])
    this.showForm = true
  }

  saveData() {
    let data = {
      name: this.form.get('name')?.value,
    }
    if (this.editingRow) {
      this.dbProfiles.update(data, (this.editingRow as { id: number })['id']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    } else {
      this.dbProfiles.register(data).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    }
  }

  grantPermissions(rowData: unknown) {
    this.profile_id = (rowData as { id: number })['id']
    this.dbPermissions.getGrantedPermissions((rowData as { id: number })['id']).subscribe({
      next: (resp: HttpResponseBody<unknown>) => {
        this.modulesPermissions = [...new Set((resp.data as DbProfilePermissionInterface[]).reduce((modules: string[], permission: DbProfilePermissionInterface) =>
          [...modules, permission.permission!.module!], []))].sort((a, b) => a.localeCompare(b))
        this.grantedPermissions = (resp.data as DbProfilePermissionInterface[]).map(permission=>({
          ...permission,
          isGranted: permission.granted===1
        }))
        for(const module of this.modulesPermissions){
          this.mapModules.set(module, this.modulePermissions(module).find(permission=>!permission.isGranted) ? false : true);
        }
        this.showPermissionsForm = true
      }
    })
  }

  modulePermissions(module: string): DbProfilePermissionInterface[] {
    return this.grantedPermissions.filter(p => p.permission?.module === module);
  }
  
  toggleGrantedParent(module:string){
    let isModuleGranted:boolean = true
    const permissions = this.modulePermissions(module);
    if(permissions.find(permission=>!permission.isGranted)){
      isModuleGranted=false
    }
    this.mapModules.set(module, isModuleGranted)
  }

  toggleAllPermissionsModule(event:Event,module:string){
    event.stopPropagation()
    this.mapModules.set(module,!this.mapModules.get(module))
    for(const permission of this.modulePermissions(module)){
      permission.isGranted=this.mapModules.get(module)
    }
  }

  saveNewPermissions(){
    let modifiedPermissions:{profile_permission_id:number, granted:number}[] = []
    modifiedPermissions= this.grantedPermissions.map(permission=>({
      profile_permission_id:permission.profile_permission_id!,
      granted:permission.isGranted ? 1 : 0
    }))
    this.dbPermissions.saveNewPermissions(modifiedPermissions,this.profile_id).subscribe({
      next:(response:HttpResponseBody<unknown>)=>{
        this.showPermissionsForm=false
      }
    })
  }

  closeModal() {
    this.showForm = false
  }

}
