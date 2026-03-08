import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, forkJoin, from, map, of, switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-login-succes',
  templateUrl: './login-succes.component.html',
  styleUrl: './login-succes.component.scss',
})
export class LoginSuccesComponent implements OnInit {
  tempRefresh: string = '';
  tempAccess: string = '';

  constructor(
    private storage: StorageService,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  private verifyAccessToken(accessToken: string) {
    return this.auth
      .verifyAccess(accessToken)
      .pipe(catchError(() => of(false)));
  }

  private checkExistingAuthWithVerification() {
    return forkJoin({
      accessToken: from(this.storage.retrieveData('access')),
      refreshToken: from(this.storage.retrieveData('refresh')),
      userRole: from(this.storage.retrieveData('role')),
    }).pipe(
      switchMap(({ accessToken, refreshToken, userRole }) => {
        if (!accessToken || !refreshToken || !userRole) {
          return of(false);
        }

        return this.verifyAccessToken(accessToken as string).pipe(
          catchError(() => of(false)),
        );
      }),
      catchError(() => of(false)),
    );
  }

  private navigateToStoredRole() {
    return from(this.storage.retrieveData('role')).pipe(
      switchMap((role) => {
        if (role) {
          this.router.navigate([`/${role}`]);
        } else {
          this.router.navigate(['/session/login']);
        }
        return of(null);
      }),
    );
  }

  private handleGoogleLogin(code: string) {
    return this.auth.exchangeCodeGoogle(code).pipe(
      switchMap((accessResponse) =>
        forkJoin([
          from(this.storage.storeData('refresh', accessResponse.refresh)),
          from(this.storage.storeData('access', accessResponse.access)),
        ]),
      ),
      switchMap(() =>
        forkJoin({
          responsePermissions: this.auth.getUserPermissions(),
          responseType: this.auth.getUserRole(),
        }),
      ),
      switchMap((response) =>
        forkJoin([
          from(this.storage.storeData('role', response.responseType.role)),
          from(this.storage.storeData('paterno', response.responseType.paterno)),
          from(this.storage.storeData('materno', response.responseType.materno)),
          from(this.storage.storeData('nombres', response.responseType.nombres)),
          from(
            this.storage.storeData(
              'permissions',
              response.responsePermissions.permissions,
            ),
          ),
        ]).pipe(map(() => response.responseType.role)),
      ),
      switchMap((role) => {
        this.router.navigate([`/${role}`]);
        return of(null);
      }),
      catchError((err) => {
        console.error('Error en el flujo de login:', err);
        this.router.navigate(['/session/login']);
        return EMPTY;
      }),
    );
  }

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.handleGoogleLogin(code)
        .pipe(
          catchError((error) => {
            console.error('Error en el proceso de Google Login:', error);
            this.router.navigate(['/session/login']);
            return EMPTY;
          }),
        )
        .subscribe();
    } else {
      this.checkExistingAuthWithVerification()
        .pipe(
          switchMap((hasValidAuth) => {
            if (hasValidAuth) {
              return this.navigateToStoredRole();
            } else {
              this.router.navigate(['/session/login']);
              return EMPTY;
            }
          }),
          catchError((error) => {
            console.error('Error en la verificación de autenticación:', error);
            this.router.navigate(['/session/login']);
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }
}
