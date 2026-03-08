import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import {
  FileServicioSocial,
  RegistroHorasServicioSocial,
  RegistroHorasServicioSocialBase,
  ServicioSocial,
} from '../../../../../interfaces/academico.interface';
import { Observable, Subscription } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { ServicioSocialAvancesTimelineComponent } from '../servicio-social-avances-timeline/servicio-social-avances-timeline.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServicioSocialAvancesFileListComponent } from '../servicio-social-avances-file-list/servicio-social-avances-file-list.component';
import { FileUploadModule } from 'primeng/fileupload';
import { PermissionsService } from '../../../../../services/permissions.service';

@Component({
  selector: 'app-servicio-social-avances-dialog',
  imports: [
    DialogModule,
    TabViewModule,
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule,
    InputNumberModule,
    CommonModule,
    TextareaModule,
    TimelineModule,
    ConfirmDialogModule,
    ServicioSocialAvancesTimelineComponent,
    FileUploadModule,
    ServicioSocialAvancesFileListComponent,
  ],
  templateUrl: './servicio-social-avances-dialog.component.html',
  styleUrl: './servicio-social-avances-dialog.component.scss',
})
export class ServicioSocialAvancesDialogComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() servicioSocial: ServicioSocial | null = null;
  @Input() registroHorasServicioSocial: RegistroHorasServicioSocial[] = [];
  @Input() filesServicioSocial: FileServicioSocial[] = [];
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() saveRegistrarHoras =
    new EventEmitter<RegistroHorasServicioSocialBase>();
  @Output() deleteRegistrarHoras = new EventEmitter<
    RegistroHorasServicioSocial['id']
  >();
  @Output() uploadFile = new EventEmitter<File>();
  @Output() downloadFile = new EventEmitter<FileServicioSocial>();
  @Output() deleteFile = new EventEmitter<FileServicioSocial>();

  @Input() result$!: Observable<boolean>;

  private resultSub?: Subscription;

  form: FormGroup;

  visibleRegistrarHorasDialog = false;
  visibleUploadFileDialog = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public permissionService: PermissionsService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      horas: [0, Validators.required],
      descripcion: [''],
      fecha_registro: [new Date(), Validators.required],
    });
  }

  get horasAcumuladas() {
    return this.registroHorasServicioSocial.reduce(
      (acc, registro) => acc + registro.horas,
      0
    );
  }

  ngOnInit(): void {
    if (this.result$) {
      this.resultSub = this.result$.subscribe((success) => {
        if (success) {
          this.onHideRegistrarHorasDialog();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.resultSub?.unsubscribe();
  }

  onShowRegistrarHorasDialog(): void {
    this.visibleRegistrarHorasDialog = true;
  }

  onHideRegistrarHorasDialog(): void {
    this.visibleRegistrarHorasDialog = false;
    this.form.reset();
  }

  onShowUploadFileDialog() {
    this.visibleUploadFileDialog = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  onCancelUpload() {
    this.selectedFile = null;
    this.visibleUploadFileDialog = false;
  }

  uploadSelectedFile() {
    if (!this.selectedFile) return;

    this.uploadFile.emit(this.selectedFile);

    this.selectedFile = null;
    this.visibleUploadFileDialog = false;
  }

  onSaveRegistrarHoras(): void {
    const formattedHour = this.form
      .get('fecha_registro')
      ?.value.toISOString()
      .split('T')[0];
    const eventObj = {
      horas: this.form.get('horas')?.value,
      descripcion: this.form.get('descripcion')?.value || '',
      fecha_registro: formattedHour,
    } as RegistroHorasServicioSocialBase;
    this.saveRegistrarHoras.emit(eventObj);
  }

  onDeleteRegistroHorasServicioSocial(
    event: RegistroHorasServicioSocial
  ): void {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar este registro de horas de servicio social? Esta acción es irreversible.',
      header: 'Confirmar eliminación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.deleteRegistrarHoras.emit(event.id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Accion cancelada',
          life: 3000,
        });
      },
    });
  }
}
