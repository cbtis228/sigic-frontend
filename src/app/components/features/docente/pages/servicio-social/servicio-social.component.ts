import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { PermissionsService } from '../../../../../services/permissions.service';
import { AlumnoAutocompleteComponent } from '../../components/alumno-autocomplete/alumno-autocomplete.component';
import { Alumno } from '../../../../../interfaces/alumno.interface';
import { ESTADOS_GENERALES } from '../../../../../global.constants';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatedData } from '../../../../../interfaces/paginated-data.interface';
import { forkJoin } from 'rxjs';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import {
  FileServicioSocial,
  RegistroHorasServicioSocial,
  RegistroHorasServicioSocialBase,
  ServicioSocial,
  ServicioSocialCreate,
  ServicioSocialListFilterRequest,
  ServicioSocialUpdate,
} from '../../../../../interfaces/academico.interface';
import { AcademicoService } from '../../../../../services/academico.service';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ErrorService } from '../../../../../services/error.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ServicioSocialCreateDialogComponent } from '../../components/servicio-social-create-dialog/servicio-social-create-dialog.component';
import { combineLatest, map, Subject } from 'rxjs';
import { ServicioSocialDetailDialogComponent } from '../../components/servicio-social-detail-dialog/servicio-social-detail-dialog.component';
import { ServicioSocialEditDialogComponent } from '../../components/servicio-social-edit-dialog/servicio-social-edit-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { ServicioSocialAvancesDialogComponent } from '../../components/servicio-social-avances-dialog/servicio-social-avances-dialog.component';
import { StorageService } from '../../../../../services/storage.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Configuracion } from '../../../../../interfaces/core.interface';
import { CoreService } from '../../../../../services/core.service';

@Component({
  selector: 'app-servicio-social',
  imports: [
    CommonModule,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    AlumnoAutocompleteComponent,
    MenuModule,
    TableModule,
    DialogModule,
    FileUploadModule,
    TabViewModule,
    ServicioSocialCreateDialogComponent,
    ServicioSocialDetailDialogComponent,
    ServicioSocialEditDialogComponent,
    ServicioSocialAvancesDialogComponent,
  ],
  templateUrl: './servicio-social.component.html',
  styleUrl: './servicio-social.component.scss',
})
export class ServicioSocialComponent implements OnInit {
  servicioSocialData: PaginatedData<ServicioSocial> | null = null;
  selectedServicioSocial: ServicioSocial | null = null;
  selectedServicioSocialRegistroHoras: RegistroHorasServicioSocial[] = [];
  selectedServicioSocialFiles: FileServicioSocial[] = [];

  configuracion: Configuracion | null = null;
  completadoEstatuses = [
    { label: 'En Proceso', value: false },
    { label: 'Completado', value: true },
  ];

  alumnoFilter: Alumno | null = null;
  globalFilter: string = '';
  estatusFilter: number | null = null;
  completadoFilter: boolean | null = null;
  fechaInicioFilter: Date | null = null;
  fechaFinFilter: Date | null = null;

  registrarHorasResult$ = new Subject<boolean>();

  estatuses = ESTADOS_GENERALES;
  menuItems: MenuItem[] = [];

  showCreateServicioSocialDialog: boolean = false;
  showDetailIncidenciaDialog: boolean = false;
  showEditIncidenciaDialog: boolean = false;
  showRegistrarAvancesDialog: boolean = false;
  showCreateRegistroHorasDialog: boolean = false;

  lastLazyLoadEvent: TableLazyLoadEvent | null = null;
  constructor(
    public permissionsService: PermissionsService,
    private academicoService: AcademicoService,
    private errorService: ErrorService,
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    forkJoin({
      servicios: this.academicoService.ServicioSocialListApi(
        '',
        '',
        {} as ServicioSocialListFilterRequest,
        0,
        10,
      ),
      configuracion: this.coreService.ConfiguracionDetailApi(),
    }).subscribe({
      next: (response) => {
        this.servicioSocialData = response.servicios;
        this.configuracion = response.configuracion;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }

  refreshHorasOnTableOfSelectedServicioSocial() {
    const servicio = this.servicioSocialData?.results.find(
      (d) => d.id === this.selectedServicioSocial!.id,
    );
    const horas = this.selectedServicioSocialRegistroHoras.reduce(
      (acc, registro) => acc + registro.horas,
      0,
    );
    servicio!.horas_acumuladas = horas;
  }

  loadRegistroHorasFromSelectedServicioSocial() {
    if (!this.selectedServicioSocial) {
      console.error('No hay un servicio social seleccionado');
      return;
    }
    this.academicoService
      .RegistroHorasServicioSocialDetailApi(this.selectedServicioSocial.id)
      .subscribe({
        next: (response) => {
          this.selectedServicioSocialRegistroHoras = response;
          this.refreshHorasOnTableOfSelectedServicioSocial();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  loadFilesFromSelectedServicioSocial() {
    if (!this.selectedServicioSocial) {
      console.error('No hay un servicio social seleccionado');
      return;
    }
    this.academicoService
      .FilesServicioSocialDetailApi(this.selectedServicioSocial.id)
      .subscribe({
        next: (response) => {
          this.selectedServicioSocialFiles = response;
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  loadServicioSocialInfo() {
    if (!this.selectedServicioSocial) {
      console.error('No hay un servicio social seleccionado');
      return;
    }

    forkJoin({
      registroHoras: this.academicoService.RegistroHorasServicioSocialDetailApi(
        this.selectedServicioSocial.id,
      ),
      files: this.academicoService.FilesServicioSocialDetailApi(
        this.selectedServicioSocial.id,
      ),
    }).subscribe({
      next: ({ registroHoras, files }) => {
        this.selectedServicioSocialRegistroHoras = registroHoras;
        this.selectedServicioSocialFiles = files;
      },
      error: (error) => {
        const detail = this.errorService.formatError(error);
        this.messageService.add({
          detail,
          severity: 'error',
        });
      },
    });
  }

  onTableEvent(event?: TableLazyLoadEvent) {
    if (event) this.lastLazyLoadEvent = event;
    const filters = {} as ServicioSocialListFilterRequest;

    filters.global_filter = this.globalFilter;
    if (this.estatusFilter !== null)
      filters.estatus = [
        { value: this.estatusFilter, matchMode: 'equals', operator: 'and' },
      ];
    if (this.completadoFilter !== null)
      filters.completado = [
        {
          value: this.completadoFilter.toString(),
          matchMode: 'equals',
          operator: 'and',
        },
      ];
    if (this.alumnoFilter !== null)
      filters.alumno__numero_control = [
        {
          value: this.alumnoFilter.numero_control,
          matchMode: 'equals',
          operator: 'and',
        },
      ];

    if (this.fechaInicioFilter !== null)
      filters.fecha_inicio = [
        {
          value: this.fechaInicioFilter.toISOString().split('T')[0],
          matchMode: 'equals',
          operator: 'and',
        },
      ];

    if (this.fechaFinFilter !== null)
      filters.fecha_fin = [
        {
          value: this.fechaFinFilter.toISOString().split('T')[0],
          matchMode: 'equals',
          operator: 'and',
        },
      ];

    const orderBy = Array.isArray(this.lastLazyLoadEvent?.sortField)
      ? this.lastLazyLoadEvent?.sortField[0] || ''
      : this.lastLazyLoadEvent?.sortField || '';
    const order = this.lastLazyLoadEvent?.sortOrder === 1 ? 'asc' : 'desc';
    const offset = this.lastLazyLoadEvent?.first || 0;
    const limit = this.lastLazyLoadEvent?.rows || 10;

    this.academicoService
      .ServicioSocialListApi(orderBy, order, filters, offset, limit)
      .subscribe({
        next: (response) => {
          this.servicioSocialData = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getEstatusBadgeClass(estatus: number): string {
    const classes = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-gray-100 text-gray-800',
      4: 'bg-blue-100 text-blue-800',
    };
    return (
      classes[estatus as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }
  updateMenuItems(servicioSocial: ServicioSocial): void {
    combineLatest([
      this.permissionsService.has$('academico.change_serviciosocial'),
      this.permissionsService.has$(
        'academico.view_registrohorasserviciosocial',
      ),
      this.permissionsService.has$('academico.view_fileserviciosocial'),
    ])
      .pipe(
        map(([canChangeServicioSocial, canViewRegistroHoras, canViewFiles]) => {
          const items: any[] = [];

          items.push({
            label: 'Detalle',
            icon: 'pi pi-eye',
            command: () => {
              this.showDetailIncidenciaDialog = true;
              this.selectedServicioSocial = servicioSocial;
            },
          });

          if (canChangeServicioSocial) {
            items.push({
              label: 'Editar',
              icon: 'pi pi-pencil',
              command: () => {
                this.showEditIncidenciaDialog = true;
                this.selectedServicioSocial = servicioSocial;
              },
            });
          }

          items.push({
            separator: true,
          });

          if (canViewRegistroHoras && canViewFiles) {
            items.push({
              label: 'Registrar avances',
              icon: 'pi pi-book',
              command: () => {
                this.selectedServicioSocial = servicioSocial;
                this.loadServicioSocialInfo();
                this.showRegistrarAvancesDialog = true;
              },
            });
          }

          if (servicioSocial.completado) {
            items.push({
              label: 'Generar acreditacion de servicio',
              icon: 'pi pi-file',
              command: () => {
                this.selectedServicioSocial = servicioSocial;
                this.generateAcreditacionServicioSocial();
              },
            });
          }

          items.push({
            separator: true,
          });

          if (!servicioSocial.completado) {
            items.push({
              label: 'Marcar como "Completado"',
              icon: 'pi pi-check',
              command: () => {
                this.showToggleCompletadoWarning(servicioSocial);
              },
            });
          } else {
            items.push({
              label: 'Marcar como "En Proceso"',
              icon: 'pi pi-times',
              command: () => {
                this.showToggleCompletadoWarning(servicioSocial);
              },
            });
          }

          return items;
        }),
      )
      .subscribe((items) => {
        this.menuItems = items;
      });
  }

  clearFilters() {
    this.alumnoFilter = null;
    this.globalFilter = '';
    this.estatusFilter = null;
    this.fechaInicioFilter = null;
    this.fechaFinFilter = null;
    this.completadoFilter = null;
    this.onTableEvent();
  }

  showToggleCompletadoWarning(servicio_social: ServicioSocial) {
    const marcarComoCompletado = !servicio_social.completado;

    this.confirmationService.confirm({
      header: marcarComoCompletado
        ? 'Marcar servicio social como "Completado"'
        : 'Marcar servicio social como "En Proceso"',

      message: marcarComoCompletado
        ? '¿Estás seguro de que deseas marcar este servicio social como "Completado"?'
        : '¿Estás seguro de que deseas marcar este servicio social como "En Proceso"?',

      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Sí, marcar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',

      accept: () => {
        this.toggleServicioSocialCompletado(servicio_social);
      },

      reject: () => {},
    });
  }

  toggleServicioSocialCompletado(servicio_social: ServicioSocial) {
    this.academicoService
      .ServicioSocialCompletadoToggleApi(servicio_social.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: `Servicio social marcado como ${
              !servicio_social.completado ? '"Completado"' : '"En Proceso"'
            }`,
          });
          servicio_social.completado = !servicio_social.completado;
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  onServicioSocialCreate(servicioSocialCreate: ServicioSocialCreate) {
    this.academicoService
      .ServicioSocialCreateApi(servicioSocialCreate)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Servicio social creado exitosamente',
          });
          this.showCreateServicioSocialDialog = false;
          this.onTableEvent();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  downloadFile(file: FileServicioSocial) {
    if (!this.selectedServicioSocial) {
      console.error('No hay un servicio social seleccionado');
      return;
    }
    this.academicoService
      .FilesServicioSocialDownloadApi(this.selectedServicioSocial.id, file.id)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  onUploadFile(file: File) {
    this.academicoService
      .FilesServicioSocialUploadApi(this.selectedServicioSocial!.id, file)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Evidencia subida exitosamente',
          });
          this.loadFilesFromSelectedServicioSocial();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  onDeleteFile(id_file_servicio: FileServicioSocial['id']) {
    this.academicoService
      .FilesServicioSocialDeleteApi(
        this.selectedServicioSocial!.id,
        id_file_servicio,
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Archivo eliminado exitosamente',
          });
          this.loadFilesFromSelectedServicioSocial();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  onServicioSocialUpdate(servicioSocialUpdate: ServicioSocialUpdate) {
    if (!this.selectedServicioSocial) return;
    this.academicoService
      .ServicioSocialUpdateApi(
        this.selectedServicioSocial.id,
        servicioSocialUpdate,
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Servicio social actualizado exitosamente',
          });
          this.showEditIncidenciaDialog = false;
          this.selectedServicioSocial = null;
          this.onTableEvent();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
        },
      });
  }

  onSaveRegistrarHoras(event: RegistroHorasServicioSocialBase) {
    this.academicoService
      .RegistroHorasServicioSocialCreateApi(
        this.selectedServicioSocial!.id,
        event,
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Horas registradas exitosamente',
          });
          this.registrarHorasResult$.next(true);
          this.loadRegistroHorasFromSelectedServicioSocial();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
          this.registrarHorasResult$.next(false);
        },
      });
  }

  onDeleteRegistroHoras(event: RegistroHorasServicioSocial['id']) {
    this.academicoService
      .RegistroHorasServicioSocialDeleteApi(
        this.selectedServicioSocial!.id,
        event,
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Registro eliminado exitosamente',
          });
          this.registrarHorasResult$.next(true);
          this.loadRegistroHorasFromSelectedServicioSocial();
        },
        error: (error) => {
          const detail = this.errorService.formatError(error);
          this.messageService.add({
            detail,
            severity: 'error',
          });
          this.registrarHorasResult$.next(false);
        },
      });
  }

  private async generateAcreditacionServicioSocial() {
    const servicio = this.selectedServicioSocial;
    const config = this.configuracion;

    if (!servicio || !servicio.alumno || !config) {
      throw new Error('Información incompleta');
    }

    const alumno = servicio.alumno;

    const ingreso = new Date(alumno.fecha_ingreso!);
    const egreso = new Date(ingreso);
    egreso.setFullYear(ingreso.getFullYear() + 3);
    const generacion = `${ingreso.getFullYear()}-${egreso.getFullYear()}`;

    const nombreAlumno =
      `${alumno.paterno} ${alumno.materno} ${alumno.nombres}`.toUpperCase();

    const doc = new Document({
      sections: [
        {
          children: [
            /* =======================
             ENCABEZADO
          ======================= */
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Subsecretaría de Educación Media Superior',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '\nDirección General de Educación Tecnológica Industrial y de Servicios',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 500 },
              children: [
                new TextRun({
                  text: '\n' + config.nombre_institucion.toUpperCase(),
                  bold: true,
                }),
              ],
            }),

            /* =======================
             ASUNTO Y FECHA
          ======================= */
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'ASUNTO: CONSTANCIA DE ACREDITACIÓN\nDE SERVICIO SOCIAL\n',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { before: 300, after: 500 },
              children: [
                new TextRun({
                  text: `${config.ciudad}, ${
                    config.estado
                  } a ${new Date().toLocaleDateString('es-MX')}`,
                }),
              ],
            }),

            /* =======================
             DESTINATARIO
          ======================= */
            new Paragraph({
              spacing: { before: 600, after: 500 },
              children: [
                new TextRun({
                  text: 'A QUIEN CORRESPONDA:',
                  bold: true,
                }),
              ],
            }),

            /* =======================
             CUERPO
          ======================= */
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 600 },
              children: [
                new TextRun({
                  text:
                    `El Director del ${config.nombre_institucion}, ubicado en ` +
                    `${config.direccion}, ${config.colonia}, C.P. ${config.codigo_postal}, ` +
                    `${config.ciudad}, ${config.estado}, dependiente de la ${config.organismo}, ` +
                    `hace constar que según documentos que obran en el plantel el (la) alumno (a):`,
                }),
              ],
            }),

            /* =======================
             NOMBRE DEL ALUMNO
          ======================= */
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 500, after: 500 },
              children: [
                new TextRun({
                  text: nombreAlumno,
                  bold: true,
                }),
              ],
            }),

            /* =======================
             DATOS DEL SERVICIO SOCIAL
          ======================= */
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 2000 },
              children: [
                new TextRun({
                  text:
                    `No. de Control: ${alumno.numero_control}, generación ${generacion}, ` +
                    `ha presentado su servicio social durante el período comprendido del ` +
                    `${servicio.fecha_inicio} al ${servicio.fecha_fin}, ` +
                    `cubriendo un total de ${servicio.horas_acumuladas} horas, ` +
                    `desarrollando actividades que consistieron en: ${servicio.actividad}.`,
                }),
              ],
            }),

            /* =======================
             FIRMA
          ======================= */
            new Paragraph({
              spacing: { before: 2000 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '________________________________________\n',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: config.nombre_director,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text:
                    config.genero_director === 'F'
                      ? 'Directora del Plantel'
                      : 'Director del Plantel',
                }),
              ],
            }),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 },
              children: [
                new TextRun({
                  text:
                    `${config.direccion}, ${config.colonia}, C.P. ${config.codigo_postal}, ` +
                    `${config.ciudad}, ${config.estado}\n`,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Tel: ${config.telefono} | ${config.correo_institucional}`,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Constancia_Servicio_Social_${alumno.numero_control}.docx`);
  }
}
