
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CONST_CONFIG } from '../../../global.constants';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidadoresService } from '../../../services/validadores.service';
import { FormFieldInterface } from '../../../interfaces/form-field.interface';
import { ConfigDbInterface } from '../../../interfaces/config-db.interface';
import { GeneralConfigInterface } from '../../../interfaces/general-config.interface';
import { CustomFormComponent } from '../../custom-controls/custom-form/custom-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-general',
  imports: [
    FileUpload,
    ButtonModule,
    BadgeModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CustomFormComponent
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {

  @Input() archivoLogo: File | null = null;
  @Output() archivoLogoChange = new EventEmitter<File | null>();

  @ViewChild('logoUpload') logoUpload!: FileUpload;

  @Input() firstStart: boolean = false;

  @Input() form: FormGroup = new FormGroup({})
  @Output() formChange = new EventEmitter<FormGroup>()

  inputFields: FormFieldInterface[] = [
    { name: 'organizacion', label: 'Nombre Comercial', type: 'text', show: true, required: true },
    { name: 'rfc', allowSpaces: false, label: 'RFC', type: 'text', show: true, required: true, minlength: 12, maxlength: 13 },
    { name: 'direccion', label: 'Dirección', type: 'text', show: true, required: true },
    { name: 'razon_social', label: 'Razón Social', type: 'text', show: true, required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text', show: true, required: true },
    { name: 'email', label: 'Email', type: 'text', show: true, required: true },
  ]

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    public validadoresService: ValidadoresService,
    private storage: StorageService
  ) {
    this.form = this.fb.group({
      organizacion: new FormControl(this.configService.appConfigValue.organizacion, { validators: [Validators.required] }),
      rfc: new FormControl(this.configService.appConfigValue.rfc, { validators: [Validators.required, Validators.minLength(12), Validators.maxLength(13)] }),
      direccion: new FormControl(this.configService.appConfigValue.direccion, { validators: [Validators.required] }),
      razon_social: new FormControl(this.configService.appConfigValue.razon_social, { validators: [Validators.required] }),
      telefono: new FormControl(this.configService.appConfigValue.telefono, { validators: [Validators.required] }),
      email: new FormControl(this.configService.appConfigValue.email, { validators: [Validators.required, Validators.email] }),
    })
  }
  onChooseFile(event: FileSelectEvent) {
    this.archivoLogo = event.files[0]
    this.archivoLogoChange.emit(this.archivoLogo)
  }

  uploadFile(fileName: CONST_CONFIG) {
    if (this.archivoLogo) {
      this.configService.uploadFile(this.archivoLogo, fileName).subscribe({
        next: (response) => {
          this.archivoLogo = null;
          this.logoUpload.clear();
          this.configService.emitLogoChange(true);
          /* this.configService.storeLogoAsBase64String(this.archivoLogo!).subscribe({
            next: (x) => {
              this.storage.storeData(CONST_CONFIG.STORED_LOGO, x)
            }
          }) */
        }
      })
    }
  }

  saveData() {
    let reqBody: ConfigDbInterface[] = []
    for (const field of this.inputFields) {
      reqBody.push({
        name: field.name,
        value: this.form.get(field.name)?.value
      })
    }
    this.configService.saveAllNoFile(reqBody).subscribe({
      next: (response) => {
        this.configService.emitConfigChange(response.data as GeneralConfigInterface);
      }
    })
  }

}
