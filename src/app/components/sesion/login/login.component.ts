import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ValidadoresService } from '../../../services/validadores.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../services/error.service';
import { from, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  logo: SafeUrl = '';

  loginForm: FormGroup;
  constructor(
    public validadoresService: ValidadoresService,
    private authService: AuthService,
    private storage: StorageService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private errorService: ErrorService,
  ) {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  loginWithGoogle() {
    const scope = encodeURIComponent('email profile');
    const redirectUri = encodeURIComponent(
      environment.googleOauth2KeyRedirectUrl,
    );

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${environment.googleOauth2Key}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline`;

    window.location.href = authUrl; // redirige a Google
  }

  loginWithCredentials() {
    const { username, password } = this.loginForm.value;

    this.authService
      .loginWithCredentials(username, password)
      .pipe(
        switchMap((response) => {
          return from(
            Promise.all([
              this.storage.storeData('access', response.access),
              this.storage.storeData('refresh', response.refresh),
            ]),
          ).pipe(map(() => response));
        }),
        switchMap(() => {
          return this.authService.getUserRole();
        }),
      )
      .subscribe({
        next: async (roleResponse) => {
          await this.storage.storeData('role', roleResponse.role);
          await this.storage.storeData('paterno', roleResponse.paterno)
          await this.storage.storeData('materno', roleResponse.materno)
          await this.storage.storeData('nombres', roleResponse.materno)

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Inicio de sesión exitoso',
          });

          window.location.href = `/${roleResponse.role}`;
        },
        error: (err) => {
          const detailMessage = this.errorService.formatError(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo iniciar sesión. ${detailMessage}`,
          });
        },
      });
  }
}
