import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service'; // tu servicio de storage

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  permissions: string[] = [];

  constructor(private storage: StorageService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const requiredPermissions = route.data['permissions'] as string[];

    this.permissions = (await this.storage.retrieveData('permissions')) || [];

    const hasPermission = requiredPermissions.every((perm) => this.permissions.includes(perm));

    if (!hasPermission) {
      this.router.navigate(['dashboard']);
      return false;
    }

    return true;
  }
}

