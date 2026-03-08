import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class RoleGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const allowedRoles: string[] = route.data['roles'];
    return from(this.storageService.retrieveData('role')).pipe(
      switchMap((responseRole) => {
        if (allowedRoles.includes(responseRole as string)) {
          return of(true); // permitido
        } else {
          return of(this.router.createUrlTree(['/session/login'])); // no permitido
        }
      })
    );
  }
}
