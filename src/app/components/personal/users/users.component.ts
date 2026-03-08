import { Component, ViewChild } from '@angular/core';
import { CustomPaginatedTableComponent } from '../../custom-controls/custom-paginated-table/custom-paginated-table.component';
import { TableColumnInterface } from '../../../interfaces/table-column.interface';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { TableActionInterface } from '../../../interfaces/table-action.interface';
import { DialogModule } from 'primeng/dialog'
import { CustomDialogComponent } from '../../custom-controls/custom-dialog/custom-dialog.component';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LARGO_PASSWORD } from '../../../global.constants';
import { HttpResponseBody } from '../../../interfaces/http-response-body.interface';
import { PaginatedData } from '../../../interfaces/paginated-data.interface';
import { ProfilesService } from '../../../services/profiles.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    CustomPaginatedTableComponent,
    // CustomDialogComponent,
    DialogModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  @ViewChild('table') table!: CustomPaginatedTableComponent

  columns: TableColumnInterface[] = []
  actions: TableActionInterface[] = [];
  data: unknown[] = []
  totalRows: number = 0

  title: string = 'users.title'
  endpointName: string = 'users'

  inputFields: FormFieldInterface[] = []
  filterFields: FormFieldInterface[] = []
  form: FormGroup = new FormGroup({})
  filterForm: FormGroup = new FormGroup({})
  showForm: boolean = false

  editingRow: unknown | null = null
  isChangingPassword: boolean = false

  gridCols:string='3';

  constructor(
    private dbAuth: AuthService,
    private dbUsers: UsersService,
    private ruta: ActivatedRoute,
    private dbPerfiles: ProfilesService,
    private translate: TranslateService
  ) {
    this.generateColumns()
    this.generateInputFields()
    this.generateFilterFields()
    this.generateActions()
    this.ruta.data.subscribe((resolvers) => {
      this.data = resolvers['users'].data.rows
      this.totalRows = resolvers['users'].data.count
    });
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      profile_id: new FormControl(undefined, { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(LARGO_PASSWORD)] }),
    })
    this.filterForm = new FormGroup({
      email: new FormControl(''),
      name: new FormControl(''),
      status: new FormControl(null),
    })
  }

  generateColumns() {
    this.columns = [
      { label: 'users.table.email', field: 'email', sortName: 'user.email', type: 'text', minWidth: '16rem' },
      { label: 'users.table.profile', field: 'profile', sortName: 'profile.name', type: 'text', minWidth: '16rem' },
      {
        label: 'users.table.status', field: 'status', sortName: 'user.status', type: 'option', minWidth: '8rem',
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
        label: 'users.form.email',
        name: 'email',
        type: 'text',
        required: true,
        show: true
      },
      {
        label: 'users.form.profile_id',
        name: 'profile_id',
        type: 'select',
        required: true,
        show: true
      },
      {
        label: 'users.form.password',
        name: 'password',
        type: 'password',
        required: true,
        show: true
      }
    ]
  }

  generateFilterFields() {
    this.filterFields = [
      {
        label: 'users.form.email',
        name: 'email',
        colName: 'email',
        type: 'text',
        required: false,
        show: true
      },
      {
        label: 'users.form.profile_id',
        name: 'name',
        colName: 'profile.name',
        type: 'text',
        required: false,
        show: true
      },
      {
        label: 'users.form.status',
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
        permission:'users_update',
        command: (rowData) => this.editRow(rowData)
      },
      {
        label: 'core.table.actions-menu.activate',
        icon: 'pi pi-play',
        type: 'button',
        permission:'users_update',
        condition: [{ field: 'status', operator: 'notEquals', value: 1, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 1)
      },
      {
        label: 'core.table.actions-menu.suspend',
        icon: 'pi pi-ban',
        type: 'button',
        permission:'users_update',
        condition: [{ field: 'status', operator: 'notEquals', value: 0, type: 'number' }],
        command: (rowData) => this.changeStatus(rowData, 0)
      },
      {
        label: 'core.table.actions-menu.delete',
        icon: 'pi pi-trash',
        type: 'button',
        permission:'users_delete',
        command: (rowData) => this.changeStatus(rowData, -1)
      },
      {
        label: 'core.table.actions-menu.change-password',
        icon: 'pi pi-pencil',
        type: 'button',
        permission:'users_change_password',
        command: (rowData) => this.changePassword(rowData)
      }
    ]
  }

  new() {
    this.gridCols='3';
    this.isChangingPassword = false
    this.dbPerfiles.getForm().subscribe({
      next: (response) => {
        this.editingRow = null
        this.form.reset()
        this.form.markAsPristine()
        this.form.markAsUntouched()
        this.inputFields[1].options = response.data
        this.inputFields[2].show = true
        this.form.get('email')?.enable()
        this.form.get('profile_id')?.enable()
        this.form.get('password')?.enable()
        this.showForm = true
      }
    })
  }

  editRow(row: unknown) {
    this.gridCols='2';
    this.isChangingPassword = false
    this.dbPerfiles.getForm().subscribe({
      next: (response) => {
        this.editingRow = row
        this.form.reset()
        this.form.markAsPristine()
        this.form.markAsUntouched()
        this.inputFields[0].show = true
        this.inputFields[1].show = true
        this.inputFields[2].show = false
        this.inputFields[1].options = response.data
        this.form.get('email')?.enable()
        this.form.get('profile_id')?.enable()
        this.form.get('password')?.disable()
        this.form.get('email')?.setValue((row as { email: string })['email'])
        this.form.get('profile_id')?.setValue((row as { profile_id: number })['profile_id'])
        this.showForm = true
      }
    })
  }

  changePassword(row: unknown) {
    this.isChangingPassword = true
    this.editingRow = row
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.inputFields[0].show = false
    this.inputFields[1].show = false
    this.inputFields[2].show = true
    this.form.get('email')?.disable()
    this.form.get('profile_id')?.disable()
    this.form.get('password')?.enable()
    this.showForm = true
  }

  changeStatus(fila: unknown, newStatus: number) {
    if (newStatus == -1) {
      this.dbUsers.delete((fila as { id: number })['id']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    } else {
      let user = {
        status: newStatus
      }
      this.dbUsers.update(user, (fila as { id: number })['id']).subscribe({
        next: (resp) => {
          this.table.loadTable()
          this.closeModal()
        }
      })
    }
  }

  // saveData() {
  //   if (this.isChangingPassword) {
  //     this.dbAuth.updatePassword((this.editingRow as { id: number })['id'], this.form.get('password')?.value).subscribe({
  //       next: (resp) => {
  //         this.dbUsers.getAllPaginated().subscribe({
  //           next: (response: HttpResponseBody<PaginatedData>) => {
  //             this.data = response.data!.rows
  //             this.totalRows = response.data!.count
  //             this.showForm = false
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     let user = {
  //       email: this.form.get('email')?.value,
  //       password: this.form.get('password')?.value,
  //       profile_id: this.form.get('profile_id')?.value
  //     }
  //     if (this.editingRow) {
  //       this.dbUsers.update(user, (this.editingRow as { id: number })['id']).subscribe({
  //         next: (resp) => {
  //           this.dbUsers.getAllPaginated().subscribe({
  //             next: (response: HttpResponseBody<PaginatedData>) => {
  //               this.data = response.data!.rows
  //               this.totalRows = response.data!.count
  //               this.showForm = false
  //             }
  //           })
  //         }
  //       })
  //     } else {
  //       this.dbAuth.register(user).subscribe({
  //         next: (resp) => {
  //           this.dbUsers.getAllPaginated().subscribe({
  //             next: (response: HttpResponseBody<PaginatedData>) => {
  //               this.data = response.data!.rows
  //               this.totalRows = response.data!.count
  //               this.showForm = false
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  closeModal() {
    this.showForm = false
  }

}
