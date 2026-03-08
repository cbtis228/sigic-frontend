import { Component } from '@angular/core';
import { GeneralComponent } from '../general/general.component';
import { LoadingService } from '../../../services/loading.service';
import { StorageService } from '../../../services/storage.service';
import { ThemeService } from '../../../services/theme.service';
import { AppConfigurator } from '../../layout/app.configurator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TabsModule } from 'primeng/tabs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';
import { ConfigDbInterface } from '../../../interfaces/config-db.interface';
import { GeneralConfigInterface } from '../../../interfaces/general-config.interface';
import { CONST_CONFIG, USER_KEY } from '../../../global.constants';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserLoggedInterface } from '../../../interfaces/user-logged.interface';
import { CommonModule } from '@angular/common';
import { ValidadoresService } from '../../../services/validadores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GeneralComponent,
    TranslateModule,
    ButtonModule,
    TabViewModule,
    TabsModule
  ],
  providers: [
    AppConfigurator
  ],
  templateUrl: './initial.component.html',
  styleUrl: './initial.component.scss'
})
export class InitialComponent {

  archivoLogo: File | null = null
  form: FormGroup = new FormGroup({})
  loginForm: FormGroup = new FormGroup({})
  step: number = 0;

  constructor(
    public storage: StorageService,
    public loading: LoadingService,
    private appConfigurator: AppConfigurator,
    private themeService: ThemeService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private configService: ConfigService,
    private authService: AuthService,
    public validadoresService: ValidadoresService,
    private router: Router
  ) {
    this.appConfigurator.onPresetChange(this.themeService.themeConfig().preset!)
    this.form = this.fb.group({
      organizacion: new FormControl(this.configService.appConfigValue.organizacion, { validators: [Validators.required] }),
      rfc: new FormControl(this.configService.appConfigValue.rfc, { validators: [Validators.required, Validators.minLength(12), Validators.maxLength(13)] }),
      direccion: new FormControl(this.configService.appConfigValue.direccion, { validators: [Validators.required] }),
      razon_social: new FormControl(this.configService.appConfigValue.razon_social, { validators: [Validators.required] }),
      telefono: new FormControl(this.configService.appConfigValue.telefono, { validators: [Validators.required] }),
      email: new FormControl(this.configService.appConfigValue.email, { validators: [Validators.required, Validators.email] }),
    })

    this.loginForm = this.fb.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] }),
    })
  }

  saveConfig() {
    let reqBody: ConfigDbInterface[] = [
      { name: 'organizacion', value: this.form.get('organizacion')?.value! },
      { name: 'rfc', value: this.form.get('rfc')?.value! },
      { name: 'direccion', value: this.form.get('direccion')?.value! },
      { name: 'razon_social', value: this.form.get('razon_social')?.value! },
      { name: 'telefono', value: this.form.get('telefono')?.value! },
      { name: 'email', value: this.form.get('email')?.value! },
    ]
    forkJoin([this.configService.saveAllNoFile(reqBody), this.configService.uploadFile(this.archivoLogo!, CONST_CONFIG.CONFIG_LOGO)]).subscribe({
      next: (response) => {
        this.configService.emitConfigChange(response[0].data as GeneralConfigInterface);
        this.configService.emitLogoChange(true);
        this.configService.getFile(CONST_CONFIG.CONFIG_LOGO).subscribe({
          next: (file) => {
            this.configService.storeLogoAsBase64String(file).subscribe({
              next: (x) => {
                this.storage.storeData(CONST_CONFIG.STORED_LOGO, x);
                this.step = 1;
              }
            })
          }
        })
      }
    })
  }
}
